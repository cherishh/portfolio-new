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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Get current history
    const currentHistory = await redis.get<HistoryItem[]>(HISTORY_KEY) || []
    
    // Filter out the item with the specified id
    const updatedHistory = currentHistory.filter(item => item.id !== id)
    
    // Check if any item was actually removed
    if (updatedHistory.length === currentHistory.length) {
      return NextResponse.json(
        { error: 'History item not found' },
        { status: 404 }
      )
    }
    
    // Save updated history
    await redis.set(HISTORY_KEY, updatedHistory)
    
    return NextResponse.json({ success: true, removedId: id })
  } catch (error) {
    console.error('Error deleting history item:', error)
    return NextResponse.json(
      { error: 'Failed to delete history item' },
      { status: 500 }
    )
  }
}