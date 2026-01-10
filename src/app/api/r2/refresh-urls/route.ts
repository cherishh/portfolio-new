import { NextRequest, NextResponse } from 'next/server'
import { getDownloadUrl } from '@/lib/r2'
import { requireAuth } from '@/lib/auth'
import type { DownloadResponse } from '@/types/files'

export async function POST(request: NextRequest) {
  const authError = await requireAuth('files')
  if (authError) return authError

  try {
    const { keys } = await request.json()
    
    if (!keys || !Array.isArray(keys)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid keys provided' 
      }, { status: 400 })
    }

    // 为每个文件生成新的预签名 URL
    const refreshedUrls = await Promise.all(
      keys.map(async (key: string) => {
        try {
          const url = await getDownloadUrl(key, 3600 * 24) // 24小时有效期
          return { key, url, success: true }
        } catch (error) {
          return { key, error: 'Failed to generate URL', success: false }
        }
      })
    )

    const response = {
      success: true,
      urls: refreshedUrls,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error refreshing URLs:', error)

    const response = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to refresh URLs',
    }

    return NextResponse.json(response, { status: 500 })
  }
}