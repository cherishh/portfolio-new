import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { generateShareLink, SHARE_DURATIONS, ShareDuration } from '@/lib/share'

export async function POST(request: Request) {
  const authError = await requireAuth('files')
  if (authError) return authError

  try {
    const { key, duration } = (await request.json()) as {
      key: string
      duration: ShareDuration
    }

    if (!key || !duration) {
      return NextResponse.json(
        { error: 'Missing key or duration' },
        { status: 400 },
      )
    }

    const expiresInSeconds = SHARE_DURATIONS[duration]
    if (!expiresInSeconds) {
      return NextResponse.json({ error: 'Invalid duration' }, { status: 400 })
    }

    const shareLink = generateShareLink(key, expiresInSeconds)

    return NextResponse.json({ shareLink })
  } catch (error) {
    console.error('Failed to generate share link:', error)
    return NextResponse.json(
      { error: 'Failed to generate share link' },
      { status: 500 },
    )
  }
}
