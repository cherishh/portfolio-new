export interface FileItem {
  key: string
  name: string
  size: number
  lastModified: Date
  contentType?: string
  url: string
  status: 'uploaded' | 'uploading' | 'error'
}

export interface UploadResponse {
  success: boolean
  file?: FileItem
  error?: string
}

export interface ListFilesResponse {
  success: boolean
  files: FileItem[]
  total: number
  error?: string
}

export interface DeleteResponse {
  success: boolean
  error?: string
}

export interface DownloadResponse {
  success: boolean
  url?: string
  error?: string
}

export interface UploadProgress {
  fileName: string
  progress: number
  status: 'pending' | 'uploading' | 'completed' | 'error'
  error?: string
}