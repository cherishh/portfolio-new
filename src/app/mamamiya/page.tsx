'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { QRCodeSVG } from 'qrcode.react'
import { Copy, Check, Loader2, Eye, EyeOff } from 'lucide-react'

interface ServerInfo {
  id: string
  name: string
  type: string
  address: string
  port: string | number
  raw: string
}

// Server card component
function ServerCard({ server }: { server: ServerInfo }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(server.raw)
      setCopied(true)
      toast.success('Copied')
      setTimeout(() => setCopied(false), 1500)
    } catch {
      toast.error('Failed to copy')
    }
  }

  return (
    <div className="group relative flex flex-col items-center gap-3 sm:gap-4 rounded-xl border border-zinc-200 bg-white p-3 sm:p-5 transition-all hover:border-zinc-300 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700">
      {/* Type badge */}
      <span className="absolute right-2 top-2 sm:right-3 sm:top-3 rounded-md bg-zinc-100 px-1.5 sm:px-2 py-0.5 font-mono text-[9px] sm:text-[10px] font-medium uppercase tracking-wider text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
        {server.type}
      </span>

      {/* QR Code */}
      <div className="rounded-lg bg-white p-1.5 sm:p-2">
        <QRCodeSVG value={server.raw} size={90} level="M" className="sm:hidden" />
        <QRCodeSVG value={server.raw} size={120} level="M" className="hidden sm:block" />
      </div>

      {/* Server Info */}
      <div className="w-full space-y-0.5 sm:space-y-1 text-center">
        <h3 className="truncate text-sm sm:text-base font-medium text-zinc-900 dark:text-zinc-100">
          {server.name}
        </h3>
        <p className="truncate font-mono text-[10px] sm:text-xs text-zinc-500 dark:text-zinc-400">
          {server.address}:{server.port}
        </p>
      </div>

      {/* Copy button */}
      <button
        onClick={handleCopy}
        className="flex w-full items-center justify-center gap-1.5 sm:gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-2 sm:px-3 py-1.5 sm:py-2 font-mono text-[10px] sm:text-xs text-zinc-600 transition-all hover:bg-zinc-100 active:scale-95 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
      >
        {copied ? (
          <>
            <Check className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-emerald-500" />
            <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
          </>
        ) : (
          <>
            <Copy className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            <span>Copy</span>
          </>
        )}
      </button>
    </div>
  )
}

export default function MamamiyaPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [servers, setServers] = useState<ServerInfo[]>([])

  useEffect(() => {
    if (sessionStorage.getItem('mamamiya-auth') === 'true') {
      setIsAuthenticated(true)
    }
  }, [])

  // Auto-fetch on authentication
  useEffect(() => {
    if (isAuthenticated) {
      fetchSubscription()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated])

  const [isVerifying, setIsVerifying] = useState(false)

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsVerifying(true)

    try {
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, scope: 'mamamiya' }),
      })

      const data = await response.json()

      if (data.success) {
        setIsAuthenticated(true)
        sessionStorage.setItem('mamamiya-auth', 'true')
      } else {
        toast.error('Invalid password')
        setPassword('')
      }
    } catch {
      toast.error('Verification failed')
    } finally {
      setIsVerifying(false)
    }
  }

  const fetchSubscription = async () => {
    setIsLoading(true)
    setServers([])

    try {
      const response = await fetch('/api/mamamiya/subscription', {
        method: 'POST',
      })

      const data = await response.json()
      if (!data.success) throw new Error(data.error)

      if (data.servers.length === 0) {
        toast.error('No servers found')
      } else {
        setServers(data.servers)
        toast.success(`${data.servers.length} servers loaded`)
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to fetch')
    } finally {
      setIsLoading(false)
    }
  }

  // Password gate
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
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              autoFocus
              className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 pr-10 font-mono text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-colors focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:border-zinc-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <button
            type="submit"
            disabled={isVerifying || !password.trim()}
            className="w-full rounded-lg bg-zinc-900 py-3 font-mono text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {isVerifying ? 'Verifying...' : 'Unlock'}
          </button>
        </form>
      </div>
    )
  }

  // Main content
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:py-12">
      {/* Header */}
      <div className="mb-6 sm:mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-mono text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Servers
          </h1>
          {servers.length > 0 && (
            <p className="mt-1 font-mono text-sm text-zinc-500">{servers.length} nodes</p>
          )}
        </div>
        <button
          onClick={fetchSubscription}
          disabled={isLoading}
          className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-zinc-900 px-5 py-2.5 font-mono text-sm font-medium text-white transition-all hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Loading...</span>
            </>
          ) : (
            <span>Fetch</span>
          )}
        </button>
      </div>

      {/* Server Grid */}
      {servers.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
          {servers.map((server) => (
            <ServerCard key={server.id} server={server} />
          ))}
        </div>
      ) : (
        <div className="flex min-h-[40vh] flex-col items-center justify-center rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800">
          <div className="text-center">
            <div className="mx-auto mb-3 h-10 w-10 rounded-full border-2 border-zinc-200 dark:border-zinc-700" />
            <p className="font-mono text-sm text-zinc-400">
              {isLoading ? 'Fetching servers...' : 'Click Fetch to load servers'}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
