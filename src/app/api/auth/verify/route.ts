import { NextRequest, NextResponse } from 'next/server'

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

    // Get the correct password based on scope
    let correctPassword: string | undefined

    switch (scope) {
      case 'files':
        correctPassword = process.env.AUTH_PASSWORD_FILES
        break
      case 'mamamiya':
        correctPassword = process.env.AUTH_PASSWORD_MAMAMIYA
        break
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid scope' },
          { status: 400 }
        )
    }

    if (!correctPassword) {
      console.error(`Password not configured for scope: ${scope}`)
      return NextResponse.json(
        { success: false, error: 'Authentication not configured' },
        { status: 500 }
      )
    }

    if (password === correctPassword) {
      return NextResponse.json({ success: true })
    }

    return NextResponse.json(
      { success: false, error: 'Invalid password' },
      { status: 401 }
    )
  } catch (error) {
    console.error('Auth verification error:', error)
    return NextResponse.json(
      { success: false, error: 'Verification failed' },
      { status: 500 }
    )
  }
}
