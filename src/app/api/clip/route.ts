import { Redis } from '@upstash/redis'
import { NextRequest, NextResponse } from 'next/server'

const redis = Redis.fromEnv()

const CLIP_KEY = 'global:clipboard'
const HISTORY_KEY = 'global:clipboard:history'

interface ClipboardData {
  content: string
  lastModified: number
}

interface HistoryItem {
  id: string
  content: string
  timestamp: number
  preview: string
}

export async function GET() {
  try {
    const data = await redis.get<ClipboardData>(CLIP_KEY)
    
    if (!data) {
      return NextResponse.json({
        content: '',
        lastModified: Date.now()
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
    const { content } = await request.json()

    if (typeof content !== 'string') {
      return NextResponse.json(
        { error: 'Content must be a string' },
        { status: 400 }
      )
    }

    // Get current data to check if content is different (avoid duplicate history entries)
    const currentData = await redis.get<ClipboardData>(CLIP_KEY)
    const shouldAddToHistory = !currentData || currentData.content !== content

    const timestamp = Date.now()
    const newData: ClipboardData = {
      content,
      lastModified: timestamp
    }

    // Save current content
    await redis.set(CLIP_KEY, newData)

    // Add to history if content is different
    if (shouldAddToHistory && content.trim()) {
      const historyItem: HistoryItem = {
        id: `${timestamp}`,
        content,
        timestamp,
        preview: content.substring(0, 100) // First 100 characters as preview
      }

      // Get current history
      const currentHistory = await redis.get<HistoryItem[]>(HISTORY_KEY) || []
      
      // Add new item to beginning and keep only last 10 items
      const updatedHistory = [historyItem, ...currentHistory].slice(0, 10)
      
      // Save updated history
      await redis.set(HISTORY_KEY, updatedHistory)
    }

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
      lastModified: Date.now()
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