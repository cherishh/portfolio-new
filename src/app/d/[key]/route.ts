import { NextRequest, NextResponse } from 'next/server'
import { verifyShareLink } from '@/lib/share'
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'

const r2Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
})

const BUCKET_NAME = process.env.R2_BUCKET!

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> },
) {
  const { key: encodedKey } = await params
  const searchParams = request.nextUrl.searchParams
  const expires = searchParams.get('e')
  const signature = searchParams.get('s')

  if (!expires || !signature) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
  }

  const result = verifyShareLink(encodedKey, expires, signature)
  if (!result.valid || !result.key) {
    return NextResponse.json(
      { error: result.error },
      { status: result.error === 'Link expired' ? 410 : 403 },
    )
  }

  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: result.key,
    })

    const response = await r2Client.send(command)

    if (!response.Body) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

    const fileName = result.key.split('/').pop() || 'download'
    const contentType = response.ContentType || 'application/octet-stream'

    const stream = response.Body.transformToWebStream()

    return new NextResponse(stream, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${encodeURIComponent(fileName)}"`,
        'Content-Length': response.ContentLength?.toString() || '',
        'Cache-Control': 'private, max-age=3600',
      },
    })
  } catch (error) {
    console.error('Download error:', error)
    return NextResponse.json(
      { error: 'Failed to download file' },
      { status: 500 },
    )
  }
}
