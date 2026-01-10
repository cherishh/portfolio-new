import { NextRequest, NextResponse } from 'next/server'
import { createAuthCookie, getPasswordForScope, type AuthScope } from '@/lib/auth'

interface VerifyResponse {
  success: boolean
  error?: string
}

export async function POST(request: NextRequest): Promise<NextResponse<VerifyResponse>> {
  try {
    const { password, scope } = await request.json()

    if (!password || !scope) {
      return NextResponse.json(
        { success: false, error: 'Password and scope are required' },
        { status: 400 }
      )
    }

    // Validate scope
    if (scope !== 'files' && scope !== 'mamamiya') {
      return NextResponse.json(
        { success: false, error: 'Invalid scope' },
        { status: 400 }
      )
    }

    const correctPassword = getPasswordForScope(scope as AuthScope)

    if (!correctPassword) {
      console.error(`Password not configured for scope: ${scope}`)
      return NextResponse.json(
        { success: false, error: 'Authentication not configured' },
        { status: 500 }
      )
    }

    if (password !== correctPassword) {
      return NextResponse.json(
        { success: false, error: 'Invalid password' },
        { status: 401 }
      )
    }

    // Create signed cookie
    const cookie = createAuthCookie(scope as AuthScope)

    const response = NextResponse.json({ success: true })
    response.cookies.set(cookie.name, cookie.value, cookie.options)

    return response
  } catch (error) {
    console.error('Auth verification error:', error)
    return NextResponse.json(
      { success: false, error: 'Verification failed' },
      { status: 500 }
    )
  }
}
