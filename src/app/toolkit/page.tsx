'use client'

import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Clipboard, Files, ExternalLink } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function ToolkitPage() {
  const router = useRouter()

  const tools = [
    {
      title: 'Web Clipboard',
      description:
        'Share text content across devices with cloud synchronization',
      icon: Clipboard,
      href: '/clip',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      title: 'File Management',
      description: 'Cloud file storage and management with drag & drop upload',
      icon: Files,
      href: '/files',
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      private: true,
    },
  ]

  const handleToolClick = (href: string) => {
    router.push(href)
  }

  return (
    <Container className="mt-9">
      <div className="mx-auto max-w-4xl">
        {/* 页面头部 */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">Toolkit</h1>
          <p className="mt-2 text-muted-foreground">My little tools</p>
        </div>

        {/* 工具卡片网格 */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          {tools.map((tool) => {
            const IconComponent = tool.icon
            return (
              <Card
                key={tool.title}
                className="group cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
                onClick={() => handleToolClick(tool.href)}
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`rounded-lg p-2 ${tool.bgColor}`}>
                      <IconComponent className={`h-6 w-6 ${tool.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-xl">{tool.title}</CardTitle>
                        {tool.private && (
                          <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs text-orange-800 dark:bg-orange-900/20 dark:text-orange-300">
                            Private
                          </span>
                        )}
                      </div>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {tool.description}
                  </CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </Container>
  )
}
