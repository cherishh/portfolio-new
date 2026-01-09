'use client'

import { useState, useEffect, useCallback } from 'react'
import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Upload, Plus, RefreshCw, X } from 'lucide-react'
import { toast } from 'sonner'
import { Progress } from '@/components/ui/progress'
import { DataTable } from './data-table'
import { createColumns } from './columns'
import type {
  FileItem,
  ListFilesResponse,
  DeleteResponse,
  DownloadResponse,
  PresignedUploadResponse,
  UploadCompleteResponse,
} from '@/types/files'

export default function FilesPage() {
  const [files, setFiles] = useState<FileItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [uploadProgress, setUploadProgress] = useState<{
    [key: string]: { progress: number; stage: string; error?: string }
  }>({})

  // 获取文件列表
  const fetchFiles = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/r2/files')
      const data: ListFilesResponse = await response.json()

      if (data.success) {
        setFiles(data.files)
      } else {
        toast.error(data.error || 'Failed to fetch file list')
      }
    } catch (error) {
      toast.error('Failed to fetch file list')
      console.error('Error fetching files:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // 验证密码
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === 'tuatara') {
      setIsAuthenticated(true)
    } else {
      toast.error('Invalid password')
      setPassword('')
    }
  }

  // 检查是否已在 sessionStorage 中存储了验证状态
  useEffect(() => {
    const authStatus = sessionStorage.getItem('files-auth')
    if (authStatus === 'true') {
      setIsAuthenticated(true)
    } else {
      setIsLoading(false)
    }
  }, [])

  // 保存验证状态到 sessionStorage 并获取文件列表
  useEffect(() => {
    if (isAuthenticated) {
      sessionStorage.setItem('files-auth', 'true')
      fetchFiles()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated])

  // 刷新文件 URLs
  const refreshUrls = async () => {
    if (files.length === 0) return

    try {
      const keys = files.map((file) => file.key)
      const response = await fetch('/api/r2/refresh-urls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keys }),
      })

      const data = await response.json()

      if (data.success) {
        // 更新文件列表中的 URLs
        const urlMap = new Map(
          data.urls.map((item: any) => [item.key, item.url]),
        )
        setFiles((prevFiles: FileItem[]) =>
          prevFiles.map((file) => ({
            ...file,
            url: (urlMap.get(file.key) as string) ?? file.url,
          })),
        )
        toast.success('Download links refreshed')
      } else {
        toast.error(data.error || 'Failed to refresh links')
      }
    } catch (error) {
      toast.error('Failed to refresh links')
      console.error('Error refreshing URLs:', error)
    }
  }

  // 下载文件
  const handleDownload = async (file: FileItem) => {
    try {
      // 由于桶是公开的，直接使用公开 URL 下载
      const link = document.createElement('a')
      link.href = file.url
      link.download = file.name
      link.target = '_blank'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast.success('Download started')
    } catch (error) {
      toast.error('Download failed')
      console.error('Error downloading file:', error)
    }
  }

  // 删除文件
  const handleDelete = async (file: FileItem) => {
    if (
      !confirm(
        `Are you sure you want to delete "${file.name}"? This action cannot be undone.`,
      )
    ) {
      return
    }

    try {
      const response = await fetch(
        `/api/r2/files/${encodeURIComponent(file.key)}`,
        {
          method: 'DELETE',
        },
      )

      const data: DeleteResponse = await response.json()

      if (data.success) {
        setFiles((prevFiles) => prevFiles.filter((f) => f.key !== file.key))
        toast.success('File deleted successfully')
      } else {
        toast.error(data.error || 'Failed to delete file')
      }
    } catch (error) {
      toast.error('Failed to delete file')
      console.error('Error deleting file:', error)
    }
  }

  // 批量删除文件
  const handleDeleteSelected = async (selectedFiles: FileItem[]) => {
    if (selectedFiles.length === 0) return

    if (
      !confirm(
        `Are you sure you want to delete ${selectedFiles.length} selected file(s)? This action cannot be undone.`,
      )
    ) {
      return
    }

    try {
      const deletePromises = selectedFiles.map((file) =>
        fetch(`/api/r2/files/${encodeURIComponent(file.key)}`, {
          method: 'DELETE',
        }),
      )

      const responses = await Promise.all(deletePromises)
      const results = await Promise.all(
        responses.map((response) => response.json()),
      )

      const successful = results.filter((result) => result.success)
      const failed = results.filter((result) => !result.success)

      if (successful.length > 0) {
        const deletedKeys = selectedFiles
          .slice(0, successful.length)
          .map((f) => f.key)
        setFiles((prevFiles) =>
          prevFiles.filter((f) => !deletedKeys.includes(f.key)),
        )
        toast.success(`Successfully deleted ${successful.length} file(s)`)
      }

      if (failed.length > 0) {
        toast.error(`Failed to delete ${failed.length} file(s)`)
      }
    } catch (error) {
      toast.error('Batch delete failed')
      console.error('Error batch deleting files:', error)
    }
  }

  // 上传文件 (使用预签名URL)
  const handleFileUpload = async (files: FileList) => {
    if (!files.length) return

    setIsUploading(true)
    setUploadProgress({})

    const uploadPromises = Array.from(files).map(async (file) => {
      const fileName = file.name

      try {
        // 初始化进度
        setUploadProgress((prev) => ({
          ...prev,
          [fileName]: { progress: 0, stage: 'Preparing...' },
        }))

        // 第一步：获取预签名URL
        setUploadProgress((prev) => ({
          ...prev,
          [fileName]: { progress: 10, stage: 'Getting upload URL...' },
        }))

        const presignedResponse = await fetch('/api/r2/presigned-url', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileName,
            contentType: file.type,
            fileSize: file.size,
          }),
        })

        const presignedData: PresignedUploadResponse =
          await presignedResponse.json()

        if (!presignedData.success || !presignedData.presignedUrl) {
          throw new Error(presignedData.error || 'Failed to get upload URL')
        }

        // 第二步：直接上传到R2
        setUploadProgress((prev) => ({
          ...prev,
          [fileName]: { progress: 15, stage: 'Starting upload...' },
        }))

        const uploadPromise = new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest()

          xhr.upload.addEventListener('progress', (e) => {
            if (e.lengthComputable) {
              // 15% 到 90% 为实际上传进度
              const progress = 15 + Math.round((e.loaded / e.total) * 75)
              setUploadProgress((prev) => ({
                ...prev,
                [fileName]: { progress, stage: 'Uploading to R2...' },
              }))
            }
          })

          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              setUploadProgress((prev) => ({
                ...prev,
                [fileName]: { progress: 90, stage: 'Upload complete...' },
              }))
              resolve()
            } else {
              reject(
                new Error(`Upload failed: ${xhr.status} ${xhr.statusText}`),
              )
            }
          }

          xhr.onerror = () => reject(new Error('Network error during upload'))
          xhr.ontimeout = () => reject(new Error('Upload timeout'))

          xhr.open('PUT', presignedData.presignedUrl!)
          xhr.timeout = 300000 // 5分钟超时
          if (file.type) {
            xhr.setRequestHeader('Content-Type', file.type)
          }
          xhr.send(file)
        })

        await uploadPromise

        // 第三步：通知服务端完成上传
        setUploadProgress((prev) => ({
          ...prev,
          [fileName]: { progress: 95, stage: 'Finalizing...' },
        }))

        const completeResponse = await fetch('/api/r2/upload-complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileName,
            fileSize: file.size,
            contentType: file.type,
          }),
        })

        const completeData: UploadCompleteResponse =
          await completeResponse.json()

        if (completeData.success && completeData.file) {
          setFiles((prevFiles) => [...prevFiles, completeData.file!])
          setUploadProgress((prev) => ({
            ...prev,
            [fileName]: { progress: 100, stage: 'Complete' },
          }))
          return { success: true, fileName }
        } else {
          throw new Error(completeData.error || 'Failed to finalize upload')
        }
      } catch (error) {
        const errorMsg =
          error instanceof Error ? error.message : 'Upload failed'
        setUploadProgress((prev) => ({
          ...prev,
          [fileName]: { progress: 0, stage: 'Failed', error: errorMsg },
        }))
        return { success: false, fileName, error: errorMsg }
      }
    })

    try {
      const results = await Promise.all(uploadPromises)
      const successful = results.filter((r) => r.success)
      const failed = results.filter((r) => !r.success)

      if (successful.length > 0) {
        toast.success(`Successfully uploaded ${successful.length} file(s)`)
      }

      if (failed.length > 0) {
        // 显示详细错误信息
        failed.forEach((failedFile) => {
          toast.error(`${failedFile.fileName}: ${failedFile.error}`)
        })
      }

      // 3秒后清除进度显示
      setTimeout(() => {
        setUploadProgress({})
      }, 3000)
    } catch (error) {
      toast.error('Error during upload process')
    } finally {
      setIsUploading(false)
    }
  }

  // 文件拖拽处理
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileUpload(files)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  // 页面加载时不自动获取文件列表，等待密码验证

  const columns = createColumns({
    onDownload: handleDownload,
    onDelete: handleDelete,
  })

  // 如果还未验证密码，显示密码输入界面
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <form onSubmit={handlePasswordSubmit} className="w-full max-w-xs space-y-4">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border-2 border-zinc-200 dark:border-zinc-700">
              <svg className="h-5 w-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="font-mono text-lg font-medium text-zinc-900 dark:text-zinc-100">Protected</h1>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoFocus
            className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 font-mono text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-colors focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:border-zinc-500"
          />
          <button
            type="submit"
            disabled={isLoading || !password.trim()}
            className="w-full rounded-lg bg-zinc-900 py-3 font-mono text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {isLoading ? 'Verifying...' : 'Unlock'}
          </button>
        </form>
      </div>
    )
  }

  return (
    <Container className="mt-9">
      <div className="mx-auto max-w-7xl">
        {/* 页面头部 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">File Management</h1>
          <p className="mt-2 text-muted-foreground">
            My files in the Cloudflare R2 storage bucket.
          </p>
          <p className="mt-2 text-muted-foreground">
            Download links have 24-hour expiry, click &quot;Refresh Links&quot;
            button to regenerate after expiry. Now supports large file uploads
            via direct R2 connection.
          </p>
        </div>

        {/* 操作工具栏 */}
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={fetchFiles}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <RefreshCw
                className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}
              />
              Refresh List
            </Button>

            <Button
              variant="outline"
              onClick={refreshUrls}
              disabled={files.length === 0}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh Links
            </Button>
          </div>

          <div className="text-sm text-muted-foreground">
            {files.length} file(s) total
          </div>
        </div>

        {/* 隐藏的文件输入 */}
        <input
          id="file-upload"
          type="file"
          multiple
          onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
          className="hidden"
        />

        {/* 拖拽上传区域 */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => document.getElementById('file-upload')?.click()}
          className="mb-6 cursor-pointer rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/10 p-8 text-center transition-colors hover:border-muted-foreground/50"
        >
          <Upload className="mx-auto h-8 w-8 text-muted-foreground/50" />
          <p className="mt-2 text-sm text-muted-foreground">
            Drag files here to upload, or click this area to select files
          </p>
          <p className="mt-1 text-xs text-green-600">
            ✓ Direct upload to R2 - supports large files up to 5TB
          </p>
        </div>

        {/* 上传进度显示 */}
        {Object.keys(uploadProgress).length > 0 && (
          <div className="mb-6 space-y-3 rounded-lg border bg-card p-4">
            <h3 className="text-sm font-medium">Upload Progress</h3>
            {Object.entries(uploadProgress).map(([fileName, progress]) => (
              <div key={fileName} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="max-w-xs truncate text-sm" title={fileName}>
                    {fileName}
                  </span>
                  <div className="flex items-center gap-2">
                    {progress.error ? (
                      <span className="text-xs text-red-500">Failed</span>
                    ) : progress.progress === 100 ? (
                      <span className="text-xs text-green-500">Complete</span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {progress.progress}%
                        </span>
                        <span className="text-xs text-blue-500">
                          {progress.stage}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <Progress value={progress.progress} className="h-1" />
                {progress.error && (
                  <p className="mt-1 text-xs text-red-500">{progress.error}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* 数据表格 */}
        <DataTable
          columns={columns}
          data={files}
          onDeleteSelected={handleDeleteSelected}
          isLoading={isLoading}
        />
      </div>
    </Container>
  )
}
