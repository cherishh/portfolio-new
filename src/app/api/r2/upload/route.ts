import { NextRequest, NextResponse } from 'next/server'
import { uploadFile } from '@/lib/r2'
import { requireAuth } from '@/lib/auth'
import type { UploadResponse } from '@/types/files'

export async function POST(request: NextRequest) {
  const authError = await requireAuth('files')
  if (authError) return authError

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      const response: UploadResponse = {
        success: false,
        error: 'No file provided',
      }
      return NextResponse.json(response, { status: 400 })
    }

    // 检查文件大小 (4MB limit for Vercel)
    const maxSize = 4 * 1024 * 1024 // 4MB (Vercel限制4.5MB，留0.5MB缓冲)
    if (file.size > maxSize) {
      const response: UploadResponse = {
        success: false,
        error: `File size exceeds limit. Maximum size is ${Math.round(maxSize / 1024 / 1024)}MB, file size is ${Math.round(file.size / 1024 / 1024)}MB`,
      }
      return NextResponse.json(response, { status: 413 })
    }

    // 检查文件名
    if (!file.name || file.name.length > 255) {
      const response: UploadResponse = {
        success: false,
        error: 'Invalid file name',
      }
      return NextResponse.json(response, { status: 400 })
    }

    console.log(`Uploading file: ${file.name}, Size: ${Math.round(file.size / 1024)}KB, Type: ${file.type}`)

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Use original file name as key
    const key = file.name

    const uploadedFile = await uploadFile(key, buffer, file.type)

    const response: UploadResponse = {
      success: true,
      file: {
        ...uploadedFile,
        status: 'uploaded',
      },
    }

    console.log(`File uploaded successfully: ${file.name}`)
    return NextResponse.json(response)
  } catch (error) {
    console.error('Error uploading file:', error)

    let errorMessage = 'Failed to upload file'
    let statusCode = 500

    if (error instanceof Error) {
      errorMessage = error.message
      
      // 特定错误处理
      if (error.message.includes('timeout')) {
        errorMessage = 'Upload timeout. Please try uploading a smaller file or check your connection.'
        statusCode = 408
      } else if (error.message.includes('network')) {
        errorMessage = 'Network error. Please check your connection and try again.'
        statusCode = 503
      } else if (error.message.includes('413') || error.message.includes('too large')) {
        errorMessage = 'File too large. Please try a smaller file.'
        statusCode = 413
      }
    }

    const response: UploadResponse = {
      success: false,
      error: errorMessage,
    }

    return NextResponse.json(response, { status: statusCode })
  }
}