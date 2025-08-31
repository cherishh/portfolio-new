import { NextRequest, NextResponse } from 'next/server'
import { getDownloadUrl } from '@/lib/r2'
import type { UploadCompleteRequest, UploadCompleteResponse } from '@/types/files'

export async function POST(request: NextRequest) {
  try {
    const { fileName, fileSize, contentType }: UploadCompleteRequest = await request.json()
    
    if (!fileName) {
      return NextResponse.json({
        success: false,
        error: 'File name is required'
      }, { status: 400 })
    }

    console.log(`Upload completed for: ${fileName}, Size: ${Math.round(fileSize / 1024)}KB`)

    // 生成下载URL
    const downloadUrl = await getDownloadUrl(fileName, 3600 * 24) // 24小时有效期

    const fileItem = {
      key: fileName,
      name: fileName.split('/').pop() || fileName,
      size: fileSize,
      lastModified: new Date(),
      contentType,
      url: downloadUrl,
      status: 'uploaded' as const
    }

    const response: UploadCompleteResponse = {
      success: true,
      file: fileItem
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error completing upload:', error)

    const response: UploadCompleteResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to complete upload'
    }

    return NextResponse.json(response, { status: 500 })
  }
}