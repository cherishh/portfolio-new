import { cn } from '@/lib/utils'

interface ProgressProps {
  value: number
  className?: string
  showPercentage?: boolean
}

export function Progress({ value, className, showPercentage = false }: ProgressProps) {
  const percentage = Math.min(100, Math.max(0, value))
  
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between mb-1">
        {showPercentage && (
          <span className="text-sm text-muted-foreground">{Math.round(percentage)}%</span>
        )}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}