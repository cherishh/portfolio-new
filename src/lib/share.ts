import { createHmac } from 'crypto'

const SHARE_SECRET = process.env.SHARE_SECRET || 'default-secret-change-me'

export interface ShareLinkOptions {
  key: string
  expiresInSeconds: number
}

export function generateShareLink(
  key: string,
  expiresInSeconds: number,
): string {
  const expires = Math.floor(Date.now() / 1000) + expiresInSeconds
  const encodedKey = Buffer.from(key).toString('base64url')
  const payload = `key=${encodedKey}&e=${expires}`
  const signature = createHmac('sha256', SHARE_SECRET)
    .update(payload)
    .digest('hex')
    .slice(0, 16)

  return `/d/${encodedKey}?e=${expires}&s=${signature}`
}

export function verifyShareLink(
  encodedKey: string,
  expires: string,
  signature: string,
): { valid: boolean; key?: string; error?: string } {
  const payload = `key=${encodedKey}&e=${expires}`
  const expectedSig = createHmac('sha256', SHARE_SECRET)
    .update(payload)
    .digest('hex')
    .slice(0, 16)

  if (signature !== expectedSig) {
    return { valid: false, error: 'Invalid signature' }
  }

  const expiresNum = parseInt(expires, 10)
  if (isNaN(expiresNum) || Date.now() / 1000 > expiresNum) {
    return { valid: false, error: 'Link expired' }
  }

  try {
    const key = Buffer.from(encodedKey, 'base64url').toString('utf-8')
    return { valid: true, key }
  } catch {
    return { valid: false, error: 'Invalid key encoding' }
  }
}

export const SHARE_DURATIONS = {
  '24h': 24 * 60 * 60,
  '7d': 7 * 24 * 60 * 60,
  '30d': 30 * 24 * 60 * 60,
  '1y': 365 * 24 * 60 * 60,
} as const

export type ShareDuration = keyof typeof SHARE_DURATIONS
