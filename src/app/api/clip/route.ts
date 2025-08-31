import { Redis } from '@upstash/redis'
import { NextRequest, NextResponse } from 'next/server'

const redis = Redis.fromEnv()

const CLIP_KEY = 'global:clipboard'

interface ClipboardData {
  content: string
  lastModified: number
  version: number
}

export async function GET() {
  try {
    const data = await redis.get<ClipboardData>(CLIP_KEY)
    
    if (!data) {
      return NextResponse.json({
        content: '',
        lastModified: Date.now(),
        version: 0
      })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching clipboard data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch clipboard data' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { content, expectedVersion } = await request.json()

    if (typeof content !== 'string') {
      return NextResponse.json(
        { error: 'Content must be a string' },
        { status: 400 }
      )
    }

    // Get current data for version checking
    const currentData = await redis.get<ClipboardData>(CLIP_KEY)
    const currentVersion = currentData?.version || 0

    // Simple conflict detection (optional, for future enhancement)
    if (expectedVersion !== undefined && expectedVersion !== currentVersion) {
      return NextResponse.json({
        conflict: true,
        currentData,
        message: 'Content was modified by another user'
      }, { status: 409 })
    }

    const newVersion = currentVersion + 1
    const newData: ClipboardData = {
      content,
      lastModified: Date.now(),
      version: newVersion
    }

    await redis.set(CLIP_KEY, newData)

    return NextResponse.json(newData)
  } catch (error) {
    console.error('Error saving clipboard data:', error)
    return NextResponse.json(
      { error: 'Failed to save clipboard data' },
      { status: 500 }
    )
  }
}

export async function DELETE() {
  try {
    await redis.del(CLIP_KEY)
    
    const emptyData: ClipboardData = {
      content: '',
      lastModified: Date.now(),
      version: 0
    }

    return NextResponse.json(emptyData)
  } catch (error) {
    console.error('Error clearing clipboard data:', error)
    return NextResponse.json(
      { error: 'Failed to clear clipboard data' },
      { status: 500 }
    )
  }
}