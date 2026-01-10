'use client'

import { useState, useEffect, useCallback } from 'react'
import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/button'
import { ClipboardIcon, HistoryIcon, EyeIcon, XIcon, Save } from 'lucide-react'
import { toast } from 'sonner'

interface ClipboardData {
  content: string
  lastModified: number
}

interface HistoryItem {
  id: string
  content: string
  timestamp: number
  preview: string
}

export default function ClipPage() {
  const [content, setContent] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [lastModified, setLastModified] = useState<number>(0)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [editBaseContent, setEditBaseContent] = useState('') // 跟踪用户开始编辑时的基准内容
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)

  // 获取剪切板内容
  const fetchClipboard = useCallback(async () => {
    try {
      const response = await fetch('/api/clip')
      if (!response.ok) throw new Error('Failed to fetch')

      const data: ClipboardData = await response.json()
      setContent(data.content)
      setEditBaseContent(data.content) // 设置编辑基准内容
      setLastModified(data.lastModified)
      setHasUnsavedChanges(false) // 获取到新内容时重置未保存状态
    } catch (error) {
      toast.error('获取剪切板内容失败')
      console.error('Error fetching clipboard:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // 获取历史记录
  const fetchHistory = useCallback(async () => {
    setIsLoadingHistory(true)
    try {
      const response = await fetch('/api/clip/history')
      if (!response.ok) throw new Error('Failed to fetch history')
      
      const historyData: HistoryItem[] = await response.json()
      setHistory(historyData)
    } catch (error) {
      toast.error('获取历史记录失败')
      console.error('Error fetching history:', error)
    } finally {
      setIsLoadingHistory(false)
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
        setEditBaseContent(newContent) // 更新编辑基准内容
        setLastModified(data.lastModified)
        setHasUnsavedChanges(false) // 保存成功后重置未保存状态
        
        // 刷新历史记录
        if (showHistory) {
          fetchHistory()
        }
        
        toast.success('保存成功')
      } catch (error) {
        toast.error('保存失败')
        console.error('Error saving clipboard:', error)
      } finally {
        setIsSaving(false)
      }
    },
    [showHistory, fetchHistory],
  )

  // 处理内容变化
  const handleContentChange = (newContent: string) => {
    setContent(newContent)
    // 只有当内容与编辑基准内容不同时，才标记为有未保存更改
    setHasUnsavedChanges(newContent !== editBaseContent)
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
      setEditBaseContent('') // 更新编辑基准内容为空
      setLastModified(data.lastModified)
      setHasUnsavedChanges(false) // 清空后重置未保存状态
      toast.success('内容已清空')
    } catch (error) {
      toast.error('清空失败')
      console.error('Error clearing clipboard:', error)
    }
  }

  // 查看历史记录内容
  const viewHistoryItem = (historyItem: HistoryItem) => {
    if (hasUnsavedChanges) {
      if (!confirm('当前有未保存的更改，确定要切换到这个历史记录吗？')) {
        return
      }
    }
    
    setContent(historyItem.content)
    // 切换到历史记录时，将其设为新的编辑基准，重置未保存状态
    setEditBaseContent(historyItem.content)
    setHasUnsavedChanges(false)
    toast.success('已切换到历史记录内容')
  }

  // 清空历史记录
  const clearHistory = async () => {
    if (!confirm('确定要清空所有历史记录吗？此操作不可恢复。')) return

    try {
      const response = await fetch('/api/clip/history', { method: 'DELETE' })
      if (!response.ok) throw new Error('Failed to clear history')

      setHistory([])
      toast.success('历史记录已清空')
    } catch (error) {
      toast.error('清空历史记录失败')
      console.error('Error clearing history:', error)
    }
  }

  // 删除特定历史记录
  const deleteHistoryItem = async (itemId: string, timestamp: number, e: React.MouseEvent) => {
    e.stopPropagation() // 防止触发查看操作
    
    const timeStr = formatRelativeTime(timestamp)
    if (!confirm(`确定要删除这条历史记录（${timeStr}）吗？此操作不可恢复。`)) return

    try {
      const response = await fetch(`/api/clip/history/${itemId}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Failed to delete history item')

      // 从本地状态中移除这条记录
      setHistory(prevHistory => prevHistory.filter(item => item.id !== itemId))
      toast.success('已删除历史记录')
    } catch (error) {
      toast.error('删除失败')
      console.error('Error deleting history item:', error)
    }
  }

  // 切换历史记录显示
  const toggleHistory = () => {
    const newShowHistory = !showHistory
    setShowHistory(newShowHistory)
    
    if (newShowHistory && history.length === 0) {
      fetchHistory()
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

  // 格式化相对时间显示
  const formatRelativeTime = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return '刚刚'
    if (minutes < 60) return `${minutes}分钟前`
    if (hours < 24) return `${hours}小时前`
    if (days < 7) return `${days}天前`
    return formatTime(timestamp)
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
      <div className="mx-auto max-w-7xl">
        <div className="flex gap-6">
          {/* 主内容区域 */}
          <div className="flex-1">
            {/* 标题部分 */}
            <div className="mb-6">
              <h1 className="mb-2 text-3xl font-bold">网络剪切板</h1>
              <p className="text-sm text-muted-foreground">
                简单快速地跨设备传输一段文字，任何人都可以随意使用。
              </p>
              <p className="text-sm text-muted-foreground">
              若内容被覆盖可以点击「显示历史」找回。
              </p>
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
                onClick={() => saveClipboard(content)}
                disabled={isSaving}
                variant={hasUnsavedChanges ? "default" : "outline"}
                className={`flex items-center gap-2 ${hasUnsavedChanges ? "bg-primary" : ""}`}
              >
                <Save className="h-4 w-4" />
                {isSaving ? '保存中...' : hasUnsavedChanges ? '保存 *' : '保存'}
              </Button>

              <Button
                onClick={toggleHistory}
                variant="outline"
                className="flex items-center gap-2"
              >
                <HistoryIcon className="h-4 w-4" />
                {showHistory ? '隐藏历史' : '显示历史'}
              </Button>
            </div>

            {/* 状态信息 */}
            <div className="mb-4 space-y-1 text-sm text-muted-foreground">
              <div className="flex flex-wrap gap-4 items-center">
                <span>字符数: {content.length}</span>
                <span>行数: {content.split('\n').length}</span>
                {lastModified > 0 && (
                  <span>最后保存: {formatTime(lastModified)}</span>
                )}
                {hasUnsavedChanges && (
                  <span className="text-amber-600 dark:text-amber-400 font-medium">
                    • 有未保存的更改
                  </span>
                )}
              </div>
              <p className="text-xs">
                提示: 使用保存按钮或 Ctrl+S (Windows) / Cmd+S (Mac) 保存内容到历史记录
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
                <li>手动保存机制：只有主动保存才会加入历史记录</li>
                <li>支持 Ctrl+S (Windows) 或 Cmd+S (Mac) 快捷键保存</li>
                <li>历史记录：每次保存都会创建一个新的历史记录</li>
              </ul>
            </div>
          </div>

          {/* 历史记录侧边栏 - PC端 */}
          {showHistory && (
            <div className="hidden lg:block w-80 border-l border-border pl-6">
              <div className="sticky top-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold">历史记录</h2>
                  <Button
                    onClick={clearHistory}
                    variant="ghost"
                    size="sm"
                    disabled={history.length === 0}
                    className="text-red-500 hover:text-red-600"
                  >
                    清空历史
                  </Button>
                </div>

                {isLoadingHistory ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-primary"></div>
                  </div>
                ) : history.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    暂无历史记录
                    <br />
                    保存内容后会在这里显示历史记录
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[600px] overflow-y-auto">
                    {history.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-lg border border-border bg-background/50 p-3 hover:bg-background/80 transition-colors cursor-pointer"
                        onClick={() => viewHistoryItem(item)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">
                              {formatRelativeTime(item.timestamp)}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <EyeIcon className="h-3 w-3 text-muted-foreground" />
                            <button
                              onClick={(e) => deleteHistoryItem(item.id, item.timestamp, e)}
                              className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/20 text-red-500 hover:text-red-600 transition-colors"
                              title="删除此历史记录"
                            >
                              <XIcon className="h-3 w-3" />
                            </button>
                          </div>
                        </div>

                        <div className="text-xs text-muted-foreground font-mono leading-relaxed break-words">
                          {item.preview}
                          {item.content.length > 100 && '...'}
                        </div>

                        <div className="mt-2 text-xs text-muted-foreground">
                          {item.content.length} 字符, {item.content.split('\n').length} 行
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 历史记录底部弹框 - 移动端 */}
      {showHistory && (
        <div className="lg:hidden fixed inset-0 z-50">
          {/* 遮罩层 */}
          <div
            className="absolute inset-0 bg-black/50 transition-opacity"
            onClick={() => setShowHistory(false)}
          />

          {/* 底部弹框 */}
          <div className="absolute bottom-0 left-0 right-0 h-[60vh] bg-background rounded-t-2xl shadow-xl animate-in slide-in-from-bottom duration-300">
            {/* 拖拽指示条 */}
            <div className="flex justify-center py-3">
              <div className="w-10 h-1 bg-muted-foreground/30 rounded-full" />
            </div>

            {/* 头部 */}
            <div className="px-4 pb-3 flex items-center justify-between border-b border-border">
              <h2 className="text-lg font-semibold">历史记录</h2>
              <div className="flex items-center gap-2">
                <Button
                  onClick={clearHistory}
                  variant="ghost"
                  size="sm"
                  disabled={history.length === 0}
                  className="text-red-500 hover:text-red-600"
                >
                  清空
                </Button>
                <button
                  onClick={() => setShowHistory(false)}
                  className="p-2 rounded-full hover:bg-muted transition-colors"
                >
                  <XIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* 内容区域 */}
            <div className="px-4 py-3 overflow-y-auto h-[calc(60vh-80px)]">
              {isLoadingHistory ? (
                <div className="flex items-center justify-center py-8">
                  <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-primary"></div>
                </div>
              ) : history.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  暂无历史记录
                  <br />
                  保存内容后会在这里显示历史记录
                </div>
              ) : (
                <div className="space-y-3">
                  {history.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-lg border border-border bg-background/50 p-3 hover:bg-background/80 transition-colors cursor-pointer active:scale-[0.98]"
                      onClick={() => {
                        viewHistoryItem(item)
                        setShowHistory(false)
                      }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-xs text-muted-foreground">
                          {formatRelativeTime(item.timestamp)}
                        </span>
                        <button
                          onClick={(e) => deleteHistoryItem(item.id, item.timestamp, e)}
                          className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/20 text-red-500 hover:text-red-600 transition-colors"
                          title="删除此历史记录"
                        >
                          <XIcon className="h-3 w-3" />
                        </button>
                      </div>

                      <div className="text-xs text-muted-foreground font-mono leading-relaxed break-words">
                        {item.preview}
                        {item.content.length > 100 && '...'}
                      </div>

                      <div className="mt-2 text-xs text-muted-foreground">
                        {item.content.length} 字符, {item.content.split('\n').length} 行
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Container>
  )
}