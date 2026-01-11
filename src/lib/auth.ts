import { createHmac } from 'crypto'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

const AUTH_SECRET = process.env.AUTH_SECRET || 'fallback-secret-change-me'
const COOKIE_NAME = 'auth-token'
const TOKEN_EXPIRY = 24 * 60 * 60 * 1000

export type AuthScope = 'files' | 'mamamiya'

interface TokenPayload {
  scope: AuthScope
  exp: number
}

// Sign a token with HMAC-SHA256
function signToken(payload: TokenPayload): string {
  const data = JSON.stringify(payload)
  const signature = createHmac('sha256', AUTH_SECRET)
    .update(data)
    .digest('base64url')
  const encodedData = Buffer.from(data).toString('base64url')
  return `${encodedData}.${signature}`
}

// Verify and decode a token
function verifyToken(token: string): TokenPayload | null {
  try {
    const [encodedData, signature] = token.split('.')
    if (!encodedData || !signature) return null

    const data = Buffer.from(encodedData, 'base64url').toString()
    const expectedSignature = createHmac('sha256', AUTH_SECRET)
      .update(data)
      .digest('base64url')

    if (signature !== expectedSignature) return null

    const payload = JSON.parse(data) as TokenPayload

    // Check expiration
    if (Date.now() > payload.exp) return null

    return payload
  } catch {
    return null
  }
}

// Create auth cookie for a scope
export function createAuthCookie(scope: AuthScope): {
  name: string
  value: string
  options: {
    httpOnly: boolean
    secure: boolean
    sameSite: 'strict'
    path: string
    maxAge: number
  }
} {
  const payload: TokenPayload = {
    scope,
    exp: Date.now() + TOKEN_EXPIRY,
  }

  return {
    name: `${COOKIE_NAME}-${scope}`,
    value: signToken(payload),
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: TOKEN_EXPIRY / 1000, // seconds
    },
  }
}

// Clear auth cookie for a scope
export function clearAuthCookie(scope: AuthScope): {
  name: string
  options: {
    httpOnly: boolean
    secure: boolean
    sameSite: 'strict'
    path: string
    maxAge: number
  }
} {
  return {
    name: `${COOKIE_NAME}-${scope}`,
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 0,
    },
  }
}

// Check if request is authenticated for a scope (for API routes)
export async function isAuthenticated(scope: AuthScope): Promise<boolean> {
  const cookieStore = await cookies()
  const token = cookieStore.get(`${COOKIE_NAME}-${scope}`)?.value

  if (!token) return false

  const payload = verifyToken(token)
  return payload !== null && payload.scope === scope
}

// Middleware helper: return 401 if not authenticated
export async function requireAuth(
  scope: AuthScope,
): Promise<NextResponse | null> {
  const authenticated = await isAuthenticated(scope)

  if (!authenticated) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 },
    )
  }

  return null // Authenticated, continue
}

// Get password for scope from env
export function getPasswordForScope(scope: AuthScope): string | undefined {
  switch (scope) {
    case 'files':
      return process.env.AUTH_PASSWORD_FILES
    case 'mamamiya':
      return process.env.AUTH_PASSWORD_MAMAMIYA
    default:
      return undefined
  }
}
