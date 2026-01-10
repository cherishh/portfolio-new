import { NextRequest, NextResponse } from 'next/server'
import { deleteFile } from '@/lib/r2'
import { requireAuth } from '@/lib/auth'
import type { DeleteResponse } from '@/types/files'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { key: string } }
) {
  const authError = await requireAuth('files')
  if (authError) return authError

  try {
    const key = decodeURIComponent(params.key)
    
    await deleteFile(key)

    const response: DeleteResponse = {
      success: true,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error deleting file:', error)

    const response: DeleteResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete file',
    }

    return NextResponse.json(response, { status: 500 })
  }
}