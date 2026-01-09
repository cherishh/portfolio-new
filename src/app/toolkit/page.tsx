'use client'

import { useRouter } from 'next/navigation'
import { Clipboard, Files, QrCode, Lock, ArrowUpRight } from 'lucide-react'

const tools = [
  {
    id: 'clip',
    title: 'Clipboard',
    description: 'Share text across devices',
    icon: Clipboard,
    href: '/clip',
  },
  {
    id: 'files',
    title: 'Files',
    description: 'Cloud storage & management',
    icon: Files,
    href: '/files',
    private: true,
  },
  {
    id: 'mamma',
    title: 'Mamma mia 🤌',
    icon: QrCode,
    href: '/fetch-server',
    private: true,
  },
]

export default function ToolkitPage() {
  const router = useRouter()

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      {/* Header */}
      <div className="mb-10">
        <h1 className="font-mono text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Toolkit
        </h1>
        <p className="mt-1 font-mono text-sm text-zinc-500">
          {tools.length} tools
        </p>
      </div>

      {/* Tools Grid */}
      <div className="grid gap-3 sm:grid-cols-3">
        {tools.map((tool) => {
          const Icon = tool.icon
          return (
            <button
              key={tool.id}
              onClick={() => router.push(tool.href)}
              className="group relative flex flex-col items-center gap-4 rounded-xl border border-zinc-200 bg-white p-6 text-center transition-all hover:border-zinc-300 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
            >
              {/* Private badge */}
              {tool.private && (
                <div className="absolute right-3 top-3">
                  <Lock className="h-3.5 w-3.5 text-amber-500" />
                </div>
              )}

              {/* Arrow on hover */}
              <div className="absolute right-3 top-3 opacity-0 transition-opacity group-hover:opacity-100">
                {!tool.private && <ArrowUpRight className="h-4 w-4 text-zinc-400" />}
              </div>

              {/* Icon */}
              <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 transition-colors group-hover:border-zinc-300 group-hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:group-hover:border-zinc-600 dark:group-hover:bg-zinc-700">
                <Icon className="h-5 w-5 text-zinc-600 dark:text-zinc-300" />
              </div>

              {/* Text */}
              <div className="space-y-1">
                <h2 className="font-mono text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  {tool.title}
                </h2>
                {'description' in tool && (
                  <p className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
                    {tool.description}
                  </p>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {/* Footer hint */}
      <p className="mt-8 text-center font-mono text-xs text-zinc-400">
        <Lock className="mr-1 inline-block h-3 w-3 text-amber-500" />
        requires password
      </p>
    </div>
  )
}
