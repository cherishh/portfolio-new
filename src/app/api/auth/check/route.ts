import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated, type AuthScope } from '@/lib/auth'

interface CheckResponse {
  authenticated: boolean
}

export async function GET(request: NextRequest): Promise<NextResponse<CheckResponse>> {
  const scope = request.nextUrl.searchParams.get('scope') as AuthScope | null

  if (!scope || (scope !== 'files' && scope !== 'mamamiya')) {
    return NextResponse.json({ authenticated: false })
  }

  const authenticated = await isAuthenticated(scope)

  return NextResponse.json({ authenticated })
}
