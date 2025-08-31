import { Redis } from '@upstash/redis'
import { NextRequest, NextResponse } from 'next/server'

const redis = Redis.fromEnv()
const HISTORY_KEY = 'global:clipboard:history'

interface HistoryItem {
  id: string
  content: string
  timestamp: number
  preview: string
}

export async function GET() {
  try {
    const history = await redis.get<HistoryItem[]>(HISTORY_KEY) || []
    return NextResponse.json(history)
  } catch (error) {
    console.error('Error fetching clipboard history:', error)
    return NextResponse.json(
      { error: 'Failed to fetch clipboard history' },
      { status: 500 }
    )
  }
}

export async function DELETE() {
  try {
    await redis.del(HISTORY_KEY)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error clearing clipboard history:', error)
    return NextResponse.json(
      { error: 'Failed to clear clipboard history' },
      { status: 500 }
    )
  }
}