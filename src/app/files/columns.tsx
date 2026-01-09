'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, FileIcon, ImageIcon, FileTextIcon, ArchiveIcon } from 'lucide-react'
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
  
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) {
    return <ImageIcon className="h-4 w-4 text-green-500" />
  }
  
  if (['txt', 'md', 'csv', 'json', 'xml'].includes(ext)) {
    return <FileTextIcon className="h-4 w-4 text-blue-500" />
  }
  
  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) {
    return <ArchiveIcon className="h-4 w-4 text-purple-500" />
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