import { Redis } from '@upstash/redis'
import { NextRequest, NextResponse } from 'next/server'

const redis = Redis.fromEnv()

const RATE_LIMIT_KEY = 'fetch-server:rate-limit'
const MAX_REQUESTS = 10
const WINDOW_SECONDS = 60

interface SubscriptionResponse {
  success: boolean
  content?: string
  error?: string
}

export async function POST(request: NextRequest): Promise<NextResponse<SubscriptionResponse>> {
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

    const body = await request.json()

    if (!body.url) {
      return NextResponse.json(
        { success: false, error: 'URL is required' },
        { status: 400 }
      )
    }

    const response = await fetch(body.url, {
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

    return NextResponse.json({
      success: true,
      content,
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
