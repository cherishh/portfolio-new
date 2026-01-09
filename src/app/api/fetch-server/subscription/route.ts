import { NextRequest, NextResponse } from 'next/server'

interface SubscriptionRequest {
  url: string
}

interface SubscriptionResponse {
  success: boolean
  content?: string
  error?: string
}

export async function POST(request: NextRequest): Promise<NextResponse<SubscriptionResponse>> {
  try {
    const body: SubscriptionRequest = await request.json()

    if (!body.url) {
      return NextResponse.json(
        { success: false, error: 'URL is required' },
        { status: 400 }
      )
    }

    // Fetch the subscription content
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
