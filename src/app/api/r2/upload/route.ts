import { NextRequest, NextResponse } from 'next/server'
import { uploadFile } from '@/lib/r2'
import type { UploadResponse } from '@/types/files'

export async function POST(request: NextRequest) {
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

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error uploading file:', error)

    const response: UploadResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to upload file',
    }

    return NextResponse.json(response, { status: 500 })
  }
}