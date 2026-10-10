import { SquareKanban } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2 text-sm font-semibold tracking-tight', className)}>
      <span className="inline-flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
        <SquareKanban className="size-4" aria-hidden />
      </span>
      PM Tool
    </span>
  )
}
