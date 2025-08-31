'use client'

import { useState, useEffect, useCallback } from 'react'
import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/button'
import { ClipboardIcon, TrashIcon } from 'lucide-react'
import { toast } from 'sonner'

interface ClipboardData {
  content: string
  lastModified: number
  version: number
}

export default function ClipPage() {
  const [content, setContent] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [lastModified, setLastModified] = useState<number>(0)
  const [version, setVersion] = useState(0)
  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null)

  // 获取剪切板内容
  const fetchClipboard = useCallback(async () => {
    try {
      const response = await fetch('/api/clip')
      if (!response.ok) throw new Error('Failed to fetch')

      const data: ClipboardData = await response.json()
      setContent(data.content)
      setLastModified(data.lastModified)
      setVersion(data.version)
    } catch (error) {
      toast.error('获取剪切板内容失败')
      console.error('Error fetching clipboard:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // 保存剪切板内容
  const saveClipboard = useCallback(
    async (newContent: string) => {
      setIsSaving(true)
      try {
        const response = await fetch('/api/clip', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: newContent,
            expectedVersion: version,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          if (response.status === 409) {
            toast.error('内容已被其他用户修改，请刷新页面')
            return
          }
          throw new Error(errorData.error || 'Failed to save')
        }

        const data: ClipboardData = await response.json()
        setLastModified(data.lastModified)
        setVersion(data.version)
        toast.success('保存成功')
      } catch (error) {
        toast.error('保存失败')
        console.error('Error saving clipboard:', error)
      } finally {
        setIsSaving(false)
      }
    },
    [version],
  )

  // 防抖自动保存
  const debouncedSave = useCallback(
    (newContent: string) => {
      if (saveTimeout) {
        clearTimeout(saveTimeout)
      }

      const timeout = setTimeout(() => {
        saveClipboard(newContent)
      }, 2000) // 2秒延迟

      setSaveTimeout(timeout)
    },
    [saveTimeout, saveClipboard],
  )

  // 处理内容变化
  const handleContentChange = (newContent: string) => {
    setContent(newContent)
    debouncedSave(newContent)
  }

  // 复制到剪切板
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(content)
      toast.success('已复制到剪切板')
    } catch (error) {
      toast.error('复制失败')
      console.error('Error copying to clipboard:', error)
    }
  }

  // 清空内容
  const clearContent = async () => {
    if (!confirm('确定要清空所有内容吗？')) return

    try {
      const response = await fetch('/api/clip', { method: 'DELETE' })
      if (!response.ok) throw new Error('Failed to clear')

      const data: ClipboardData = await response.json()
      setContent('')
      setLastModified(data.lastModified)
      setVersion(data.version)
      toast.success('内容已清空')
    } catch (error) {
      toast.error('清空失败')
      console.error('Error clearing clipboard:', error)
    }
  }

  // 页面加载时获取内容
  useEffect(() => {
    fetchClipboard()
  }, [fetchClipboard])

  // 键盘快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        saveClipboard(content)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [content, saveClipboard])

  // 格式化时间显示
  const formatTime = (timestamp: number) => {
    if (!timestamp) return ''
    return new Date(timestamp).toLocaleString('zh-CN')
  }

  if (isLoading) {
    return (
      <Container className="mt-9">
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
            <p className="mt-2 text-muted-foreground">加载中...</p>
          </div>
        </div>
      </Container>
    )
  }

  return (
    <Container className="mt-9">
      <div className="mx-auto max-w-4xl">
        {/* 标题部分 */}
        <div className="mb-6">
          <h1 className="mb-2 text-3xl font-bold">网络剪切板</h1>
        </div>

        {/* 操作按钮 */}
        <div className="mb-4 flex flex-wrap gap-2">
          <Button
            onClick={copyToClipboard}
            disabled={!content}
            className="flex items-center gap-2"
          >
            <ClipboardIcon className="h-4 w-4" />
            复制内容
          </Button>

          <Button
            onClick={clearContent}
            variant="outline"
            disabled={!content}
            className="flex items-center gap-2"
          >
            <TrashIcon className="h-4 w-4" />
            清空内容
          </Button>

          <Button
            onClick={() => saveClipboard(content)}
            disabled={isSaving}
            variant="outline"
          >
            {isSaving ? '保存中...' : '保存'}
          </Button>
        </div>

        {/* 状态信息 */}
        <div className="mb-4 space-y-1 text-sm text-muted-foreground">
          <div className="flex flex-wrap gap-4">
            <span>字符数: {content.length}</span>
            <span>行数: {content.split('\n').length}</span>
            {lastModified > 0 && (
              <span>最后更新: {formatTime(lastModified)}</span>
            )}
          </div>
          <p className="text-xs">
            提示: 内容会自动保存，也可以使用 Ctrl+S 手动保存
          </p>
        </div>

        {/* 主要输入区域 */}
        <div className="relative">
          <textarea
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            placeholder="在这里输入或粘贴内容，支持保持换行、空格、制表符等格式..."
            className="min-h-[500px] w-full resize-y rounded-lg border border-border bg-background p-4 font-mono text-sm text-foreground outline-none focus:border-transparent focus:ring-2 focus:ring-ring"
            style={{
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word',
              tabSize: 4,
            }}
          />

          {isSaving && (
            <div className="absolute bottom-4 right-4 rounded bg-background/80 px-2 py-1 text-xs text-muted-foreground backdrop-blur-sm">
              保存中...
            </div>
          )}
        </div>

        {/* 使用说明 */}
        <div className="mt-6 rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground">
          <h3 className="mb-2 font-semibold">使用说明:</h3>
          <ul className="list-inside list-disc space-y-1">
            <li>支持跨设备同步，在任何设备上访问 /clip 都能看到相同内容</li>
            <li>自动保持文本格式（换行、空格、制表符等）</li>
            <li>内容会在停止输入 2 秒后自动保存</li>
            <li>支持 Ctrl+S (Windows) 或 Cmd+S (Mac) 快捷键手动保存</li>
          </ul>
        </div>
      </div>
    </Container>
  )
}
