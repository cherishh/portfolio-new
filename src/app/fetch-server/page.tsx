'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { QRCodeSVG } from 'qrcode.react'
import { Copy, Check, Loader2 } from 'lucide-react'

// Server info interface
interface ServerInfo {
  id: string
  name: string
  type: string
  address: string
  port: string | number
  raw: string
}

// Decode base64 (handle both standard and URL-safe base64)
function decodeBase64(str: string): string {
  try {
    const base64 = str.replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=')
    return atob(padded)
  } catch {
    return atob(str)
  }
}

// Parse VMess link
function parseVmess(link: string): ServerInfo | null {
  try {
    const base64Part = link.replace('vmess://', '')
    const decoded = decodeBase64(base64Part)
    const config = JSON.parse(decoded)
    return {
      id: crypto.randomUUID(),
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
      id: crypto.randomUUID(),
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
      id: crypto.randomUUID(),
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
      id: crypto.randomUUID(),
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

// Server card component
function ServerCard({ server }: { server: ServerInfo }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(server.raw)
      setCopied(true)
      toast.success('Copied')
      setTimeout(() => setCopied(false), 1500)
    } catch {
      toast.error('Failed to copy')
    }
  }

  return (
    <div className="group relative flex flex-col items-center gap-4 rounded-xl border border-zinc-200 bg-white p-5 transition-all hover:border-zinc-300 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700">
      {/* Type badge */}
      <span className="absolute right-3 top-3 rounded-md bg-zinc-100 px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
        {server.type}
      </span>

      {/* QR Code */}
      <div className="rounded-lg bg-white p-2">
        <QRCodeSVG value={server.raw} size={120} level="M" />
      </div>

      {/* Server Info */}
      <div className="w-full space-y-1 text-center">
        <h3 className="truncate font-medium text-zinc-900 dark:text-zinc-100">
          {server.name}
        </h3>
        <p className="truncate font-mono text-xs text-zinc-500 dark:text-zinc-400">
          {server.address}:{server.port}
        </p>
      </div>

      {/* Copy button */}
      <button
        onClick={handleCopy}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 font-mono text-xs text-zinc-600 transition-all hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
      >
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5 text-emerald-500" />
            <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
          </>
        ) : (
          <>
            <Copy className="h-3.5 w-3.5" />
            <span>Copy Link</span>
          </>
        )}
      </button>
    </div>
  )
}

const SUBSCRIPTION_URL = 'https://jmssub.net/members/getsub.php?service=1291732&id=531988f5-2ce4-4135-acec-439082056742'

export default function FetchServerPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [servers, setServers] = useState<ServerInfo[]>([])

  useEffect(() => {
    if (sessionStorage.getItem('fetch-server-auth') === 'true') {
      setIsAuthenticated(true)
    }
  }, [])

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === 'zhimakaimen-ttt') {
      setIsAuthenticated(true)
      sessionStorage.setItem('fetch-server-auth', 'true')
    } else {
      toast.error('Invalid password')
      setPassword('')
    }
  }

  const fetchSubscription = async () => {
    setIsLoading(true)
    setServers([])

    try {
      const response = await fetch('/api/fetch-server/subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: SUBSCRIPTION_URL }),
      })

      const data = await response.json()
      if (!data.success) throw new Error(data.error)

      const parsed = parseSubscription(data.content)
      if (parsed.length === 0) {
        toast.error('No servers found')
      } else {
        setServers(parsed)
        toast.success(`${parsed.length} servers loaded`)
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to fetch')
    } finally {
      setIsLoading(false)
    }
  }

  // Password gate
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <form onSubmit={handlePasswordSubmit} className="w-full max-w-xs space-y-4">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border-2 border-zinc-200 dark:border-zinc-700">
              <svg className="h-5 w-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="font-mono text-lg font-medium text-zinc-900 dark:text-zinc-100">Protected</h1>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoFocus
            className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 font-mono text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-colors focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:border-zinc-500"
          />
          <button
            type="submit"
            className="w-full rounded-lg bg-zinc-900 py-3 font-mono text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Unlock
          </button>
        </form>
      </div>
    )
  }

  // Main content
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-mono text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Servers
          </h1>
          {servers.length > 0 && (
            <p className="mt-1 font-mono text-sm text-zinc-500">{servers.length} nodes</p>
          )}
        </div>
        <button
          onClick={fetchSubscription}
          disabled={isLoading}
          className="flex items-center gap-2 rounded-lg bg-zinc-900 px-5 py-2.5 font-mono text-sm font-medium text-white transition-all hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Loading...</span>
            </>
          ) : (
            <span>Fetch</span>
          )}
        </button>
      </div>

      {/* Server Grid */}
      {servers.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {servers.map((server) => (
            <ServerCard key={server.id} server={server} />
          ))}
        </div>
      ) : (
        <div className="flex min-h-[40vh] flex-col items-center justify-center rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800">
          <div className="text-center">
            <div className="mx-auto mb-3 h-10 w-10 rounded-full border-2 border-zinc-200 dark:border-zinc-700" />
            <p className="font-mono text-sm text-zinc-400">
              {isLoading ? 'Fetching servers...' : 'Click Fetch to load servers'}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
