import { Redis } from '@upstash/redis'
import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { requireAuth } from '@/lib/auth'

const redis = Redis.fromEnv()

const RATE_LIMIT_KEY = 'mamamiya:rate-limit'
const MAX_REQUESTS = 10
const WINDOW_SECONDS = 60
const SUBSCRIPTION_URL = 'https://jmssub.net/members/getsub.php?service=1291732&id=531988f5-2ce4-4135-acec-439082056742'

interface ServerInfo {
  id: string
  name: string
  type: string
  address: string
  port: string | number
  raw: string
}

interface SubscriptionResponse {
  success: boolean
  servers?: ServerInfo[]
  error?: string
}

// Decode base64 (handle both standard and URL-safe base64)
function decodeBase64(str: string): string {
  try {
    const base64 = str.replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=')
    return Buffer.from(padded, 'base64').toString('utf-8')
  } catch {
    return Buffer.from(str, 'base64').toString('utf-8')
  }
}

// Parse VMess link
function parseVmess(link: string): ServerInfo | null {
  try {
    const base64Part = link.replace('vmess://', '')
    const decoded = decodeBase64(base64Part)
    const config = JSON.parse(decoded)
    return {
      id: randomUUID(),
      name: config.ps || config.remarks || 'VMess Server',
      type: 'vmess',
      address: config.add || config.host || '',
      port: config.port || '',
      raw: link,
    }
  } catch {
    return null
  }
}

// Parse Shadowsocks link
function parseSS(link: string): ServerInfo | null {
  try {
    const withoutProtocol = link.replace('ss://', '')
    const [mainPart, name] = withoutProtocol.split('#')
    let address: string, port: string

    if (mainPart.includes('@')) {
      const [, serverPart] = mainPart.split('@')
      const serverMatch = serverPart.match(/(.+):(\d+)/)
      address = serverMatch ? serverMatch[1] : ''
      port = serverMatch ? serverMatch[2] : ''
    } else {
      const decoded = decodeBase64(mainPart)
      const match = decoded.match(/@(.+):(\d+)/)
      address = match ? match[1] : ''
      port = match ? match[2] : ''
    }

    return {
      id: randomUUID(),
      name: name ? decodeURIComponent(name) : 'SS Server',
      type: 'ss',
      address,
      port,
      raw: link,
    }
  } catch {
    return null
  }
}

// Parse Trojan link
function parseTrojan(link: string): ServerInfo | null {
  try {
    const url = new URL(link.replace('trojan://', 'https://'))
    const name = url.hash ? decodeURIComponent(url.hash.slice(1)) : 'Trojan Server'
    return {
      id: randomUUID(),
      name,
      type: 'trojan',
      address: url.hostname,
      port: url.port || '443',
      raw: link,
    }
  } catch {
    return null
  }
}

// Parse VLESS link
function parseVless(link: string): ServerInfo | null {
  try {
    const url = new URL(link.replace('vless://', 'https://'))
    const name = url.hash ? decodeURIComponent(url.hash.slice(1)) : 'VLESS Server'
    return {
      id: randomUUID(),
      name,
      type: 'vless',
      address: url.hostname,
      port: url.port || '443',
      raw: link,
    }
  } catch {
    return null
  }
}

// Parse any proxy link
function parseProxyLink(link: string): ServerInfo | null {
  const trimmed = link.trim()
  if (trimmed.startsWith('vmess://')) return parseVmess(trimmed)
  if (trimmed.startsWith('ss://')) return parseSS(trimmed)
  if (trimmed.startsWith('trojan://')) return parseTrojan(trimmed)
  if (trimmed.startsWith('vless://')) return parseVless(trimmed)
  return null
}

// Parse subscription content
function parseSubscription(content: string): ServerInfo[] {
  let decoded: string
  try {
    decoded = decodeBase64(content.trim())
  } catch {
    decoded = content
  }
  const lines = decoded.split('\n').filter((line) => line.trim())
  return lines.map(parseProxyLink).filter((s): s is ServerInfo => s !== null)
}

export async function POST(_request: NextRequest): Promise<NextResponse<SubscriptionResponse>> {
  const authError = await requireAuth('mamamiya')
  if (authError) return authError as NextResponse<SubscriptionResponse>

  try {
    // Rate limit check
    const count = await redis.incr(RATE_LIMIT_KEY)
    if (count === 1) {
      await redis.expire(RATE_LIMIT_KEY, WINDOW_SECONDS)
    }
    if (count > MAX_REQUESTS) {
      return NextResponse.json(
        { success: false, error: 'Rate limit exceeded. Try again later.' },
        { status: 429 }
      )
    }

    const response = await fetch(SUBSCRIPTION_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SubscriptionFetcher/1.0)',
      },
    })

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: `Failed to fetch: ${response.status} ${response.statusText}` },
        { status: response.status }
      )
    }

    const content = await response.text()
    const servers = parseSubscription(content)

    return NextResponse.json({
      success: true,
      servers,
    })
  } catch (error) {
    console.error('Subscription fetch error:', error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch subscription',
      },
      { status: 500 }
    )
  }
}
