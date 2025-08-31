import { NextRequest, NextResponse } from 'next/server'
import { getDownloadUrl, getPublicUrl } from '@/lib/r2'
import type { DownloadResponse } from '@/types/files'

export async function GET(
  request: NextRequest,
  { params }: { params: { key: string } }
) {
  try {
    const key = decodeURIComponent(params.key)
    const searchParams = request.nextUrl.searchParams
    const useSignedUrl = searchParams.get('signed') === 'true'

    let downloadUrl: string

    if (useSignedUrl) {
      // Generate a signed URL for private access
      downloadUrl = await getDownloadUrl(key)
    } else {
      // Use public URL (since your bucket is publicly accessible)
      downloadUrl = getPublicUrl(key)
    }

    const response: DownloadResponse = {
      success: true,
      url: downloadUrl,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error generating download URL:', error)

    const response: DownloadResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate download URL',
    }

    return NextResponse.json(response, { status: 500 })
  }
}