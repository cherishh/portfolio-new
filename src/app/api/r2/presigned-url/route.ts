import { NextRequest, NextResponse } from 'next/server'
import { getPresignedUploadUrl } from '@/lib/r2'

export async function POST(request: NextRequest) {
  try {
    const { fileName, contentType, fileSize } = await request.json()
    
    if (!fileName) {
      return NextResponse.json({
        success: false,
        error: 'File name is required'
      }, { status: 400 })
    }

    // 可以添加一些基本验证，但不限制文件大小
    if (fileName.length > 255) {
      return NextResponse.json({
        success: false,
        error: 'File name too long'
      }, { status: 400 })
    }

    console.log(`Generating presigned URL for: ${fileName}, Size: ${Math.round((fileSize || 0) / 1024)}KB`)

    // 生成预签名URL，有效期1小时
    const { url, fields } = await getPresignedUploadUrl(
      fileName,
      contentType,
      3600 // 1小时过期
    )

    return NextResponse.json({
      success: true,
      presignedUrl: url,
      fields,
      expiresIn: 3600
    })
  } catch (error) {
    console.error('Error generating presigned URL:', error)

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate presigned URL'
    }, { status: 500 })
  }
}