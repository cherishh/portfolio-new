import { Redis } from '@upstash/redis'
import { NextRequest, NextResponse } from 'next/server'

const redis = Redis.fromEnv()

// Reuse the same keys as the clipboard feature
const CLIP_KEY = 'global:clipboard'

interface ClipboardData {
  content: string
  lastModified: number
}

export async function GET(request: NextRequest) {
  // Verify the request is from Vercel Cron
  const authHeader = request.headers.get('authorization')

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    // Simple ping to keep Redis active - just read the current data
    // This is enough to prevent Upstash from marking the database as inactive
    const data = await redis.get<ClipboardData>(CLIP_KEY)

    const timestamp = new Date().toISOString()

    console.log(`[Keepalive] Redis ping successful at ${timestamp}`)

    return NextResponse.json({
      success: true,
      message: 'Redis keepalive ping successful',
      timestamp,
      hasData: !!data
    })
  } catch (error) {
    console.error('[Keepalive] Redis ping failed:', error)
    return NextResponse.json(
      { error: 'Redis keepalive ping failed' },
      { status: 500 }
    )
  }
}
