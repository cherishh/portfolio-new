'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import {
  MoreHorizontal,
  FileIcon,
  ImageIcon,
  FileTextIcon,
  ArchiveIcon,
  VideoIcon,
  MusicIcon,
  FileCodeIcon,
  FileSpreadsheetIcon,
  PresentationIcon,
  FileTypeIcon,
  PackageIcon,
  Database
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Checkbox } from '@/components/ui/checkbox'
import type { FileItem } from '@/types/files'

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

function formatDate(date: Date): string {
  return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
    Math.floor((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
    'day'
  )
}

function getFileIcon(fileName: string) {
  const ext = fileName.split('.').pop()?.toLowerCase()

  if (!ext) return <FileIcon className="h-4 w-4" />

  // 图片
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'ico', 'bmp', 'tiff', 'avif', 'heic'].includes(ext)) {
    return <ImageIcon className="h-4 w-4 text-green-500" />
  }

  // 视频
  if (['mp4', 'mov', 'avi', 'mkv', 'webm', 'flv', 'wmv', 'm4v'].includes(ext)) {
    return <VideoIcon className="h-4 w-4 text-red-500" />
  }

  // 音频
  if (['mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a', 'wma', 'opus'].includes(ext)) {
    return <MusicIcon className="h-4 w-4 text-pink-500" />
  }

  // 代码
  if (['js', 'ts', 'jsx', 'tsx', 'py', 'java', 'go', 'rs', 'c', 'cpp', 'h', 'hpp', 'cs', 'rb', 'php', 'swift', 'kt', 'scala', 'vue', 'svelte'].includes(ext)) {
    return <FileCodeIcon className="h-4 w-4 text-yellow-500" />
  }

  // Web
  if (['html', 'css', 'scss', 'sass', 'less'].includes(ext)) {
    return <FileCodeIcon className="h-4 w-4 text-orange-500" />
  }

  // 文本/数据
  if (['txt', 'md', 'csv', 'json', 'xml', 'yaml', 'yml', 'toml', 'ini', 'conf', 'log'].includes(ext)) {
    return <FileTextIcon className="h-4 w-4 text-blue-500" />
  }

  // 电子表格
  if (['xls', 'xlsx', 'numbers'].includes(ext)) {
    return <FileSpreadsheetIcon className="h-4 w-4 text-emerald-500" />
  }

  // 演示文稿
  if (['ppt', 'pptx', 'key'].includes(ext)) {
    return <PresentationIcon className="h-4 w-4 text-amber-500" />
  }

  // PDF/文档
  if (['pdf', 'doc', 'docx', 'rtf', 'odt', 'pages'].includes(ext)) {
    return <FileTypeIcon className="h-4 w-4 text-red-600" />
  }

  // 字体
  if (['ttf', 'otf', 'woff', 'woff2', 'eot'].includes(ext)) {
    return <FileTypeIcon className="h-4 w-4 text-indigo-500" />
  }

  // 压缩包
  if (['zip', 'rar', '7z', 'tar', 'gz', 'bz2', 'xz', 'tgz'].includes(ext)) {
    return <ArchiveIcon className="h-4 w-4 text-purple-500" />
  }

  // 安装包
  if (['exe', 'dmg', 'app', 'apk', 'deb', 'rpm', 'msi', 'pkg'].includes(ext)) {
    return <PackageIcon className="h-4 w-4 text-slate-500" />
  }

  // 数据库
  if (['sql', 'db', 'sqlite', 'sqlite3'].includes(ext)) {
    return <Database className="h-4 w-4 text-cyan-500" />
  }

  return <FileIcon className="h-4 w-4" />
}

interface ColumnsProps {
  onDownload: (file: FileItem) => void
  onDelete: (file: FileItem) => void
}

export const createColumns = ({ onDownload, onDelete }: ColumnsProps): ColumnDef<FileItem>[] => [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => {
      const file = row.original
      return (
        <div className="flex items-center gap-2">
          {getFileIcon(file.name)}
          <span className="font-medium truncate max-w-[200px]" title={file.name}>
            {file.name}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'url',
    header: 'Route',
    cell: ({ row }) => {
      const file = row.original
      return (
        <span className="text-sm text-muted-foreground truncate max-w-[250px]">
          {file.key}
        </span>
      )
    },
  },
  {
    accessorKey: 'size',
    header: 'Size',
    cell: ({ row }) => {
      const size = row.getValue('size') as number
      return <span className="text-sm">{formatFileSize(size)}</span>
    },
  },
  {
    accessorKey: 'lastModified',
    header: 'Uploaded',
    cell: ({ row }) => {
      const date = row.getValue('lastModified') as Date
      const dateObj = typeof date === 'string' ? new Date(date) : date
      return (
        <div className="text-sm">
          <div>{dateObj.toLocaleDateString('en-US')}</div>
          <div className="text-xs text-muted-foreground">
            {formatDate(dateObj)}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      return (
        <span className="text-sm">
          {status === 'uploaded' ? 'Uploaded' : 'Processing'}
        </span>
      )
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const file = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => {
              const publicUrl = `https://pub-ce42191b7e6f487fa1077cb938dc35a3.r2.dev/${file.key}`
              navigator.clipboard.writeText(publicUrl)
            }}>
              Copy Public URL
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(file.url)}>
              Copy Presigned URL
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onDownload(file)}>
              Download
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(file)}
              className="text-red-600"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]