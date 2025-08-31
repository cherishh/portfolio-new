import { NextRequest, NextResponse } from 'next/server'
import { listFiles } from '@/lib/r2'
import type { ListFilesResponse } from '@/types/files'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const prefix = searchParams.get('prefix') || undefined
    const maxKeys = parseInt(searchParams.get('maxKeys') || '1000')

    const files = await listFiles(prefix, maxKeys)
    
    const filesWithStatus = files.map(file => ({
      ...file,
      status: 'uploaded' as const,
    }))

    const response: ListFilesResponse = {
      success: true,
      files: filesWithStatus,
      total: filesWithStatus.length,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error listing files:', error)
    
    const response: ListFilesResponse = {
      success: false,
      files: [],
      total: 0,
      error: error instanceof Error ? error.message : 'Failed to list files',
    }

    return NextResponse.json(response, { status: 500 })
  }
}