import { S3Client, ListObjectsV2Command, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const r2Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
})

const BUCKET_NAME = process.env.R2_BUCKET!

export interface FileItem {
  key: string
  name: string
  size: number
  lastModified: Date
  contentType?: string
  url: string
}

export async function listFiles(prefix?: string, maxKeys: number = 1000): Promise<FileItem[]> {
  try {
    const command = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: prefix,
      MaxKeys: maxKeys,
    })

    const response = await r2Client.send(command)
    
    const items = await Promise.all((response.Contents || []).map(async item => {
      // 尝试生成预签名 URL 作为备选方案
      const url = await getDownloadUrl(item.Key!, 3600 * 24) // 24小时有效期
      
      return {
        key: item.Key!,
        name: item.Key!.split('/').pop() || item.Key!,
        size: item.Size || 0,
        lastModified: item.LastModified || new Date(),
        url
      }
    }))
    
    return items
  } catch (error) {
    console.error('Failed to list files:', error)
    throw new Error('Failed to list files from R2')
  }
}

export async function uploadFile(key: string, file: Buffer, contentType?: string): Promise<FileItem> {
  try {
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: file,
      ContentType: contentType,
    })

    await r2Client.send(command)

    // 生成预签名 URL
    const url = await getDownloadUrl(key, 3600 * 24) // 24小时有效期

    return {
      key,
      name: key.split('/').pop() || key,
      size: file.length,
      lastModified: new Date(),
      contentType,
      url
    }
  } catch (error) {
    console.error('Failed to upload file:', error)
    throw new Error('Failed to upload file to R2')
  }
}

export async function deleteFile(key: string): Promise<void> {
  try {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    })

    await r2Client.send(command)
  } catch (error) {
    console.error('Failed to delete file:', error)
    throw new Error('Failed to delete file from R2')
  }
}

export async function getDownloadUrl(key: string, expiresIn: number = 3600): Promise<string> {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    })

    const signedUrl = await getSignedUrl(r2Client, command, { expiresIn })
    return signedUrl
  } catch (error) {
    console.error('Failed to generate download URL:', error)
    throw new Error('Failed to generate download URL')
  }
}

export function getPublicUrl(key: string): string {
  // 如果你有配置自定义域名，请在这里替换
  // return `https://your-custom-domain.com/${key}`
  
  // 如果启用了 R2.dev 公开访问，格式应该是：
  // return `https://pub-c5644b395a7110c8c52917968c1d0e2a.r2.dev/${key}`
  
  // 目前使用预签名 URL 作为备选方案
  throw new Error('Public URL not configured. Use getDownloadUrl instead.')
}