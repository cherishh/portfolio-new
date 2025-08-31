'use client'

import { useState, useEffect, useCallback } from 'react'
import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Upload, Plus, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import { DataTable } from './data-table'
import { createColumns } from './columns'
import type {
  FileItem,
  ListFilesResponse,
  DeleteResponse,
  DownloadResponse,
} from '@/types/files'

export default function FilesPage() {
  const [files, setFiles] = useState<FileItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')

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

  // 上传文件
  const handleFileUpload = async (files: FileList) => {
    if (!files.length) return

    setIsUploading(true)
    const uploadPromises = Array.from(files).map(async (file) => {
      const formData = new FormData()
      formData.append('file', file)

      try {
        const response = await fetch('/api/r2/upload', {
          method: 'POST',
          body: formData,
        })

        const result = await response.json()

        if (result.success && result.file) {
          setFiles((prevFiles) => [...prevFiles, result.file])
          return { success: true, fileName: file.name }
        } else {
          return { success: false, fileName: file.name, error: result.error }
        }
      } catch (error) {
        return { success: false, fileName: file.name, error: 'Upload failed' }
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
        toast.error(`Failed to upload ${failed.length} file(s)`)
      }
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
      <Container className="mt-9">
        <div className="mx-auto max-w-md">
          <div className="rounded-lg border bg-card p-8 shadow-lg">
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-bold">Access Required</h1>
              <p className="mt-2 text-muted-foreground">
                Please enter the password to access file management.
              </p>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                  disabled={isLoading}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || !password.trim()}
              >
                {isLoading ? 'Verifying...' : 'Access'}
              </Button>
            </form>
          </div>
        </div>
      </Container>
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
            button to regenerate after expiry
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
        </div>

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
