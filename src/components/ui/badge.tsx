import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

const tones = {
  grey: 'bg-label-grey text-label-grey-foreground',
  blue: 'bg-label-blue text-label-blue-foreground',
  amber: 'bg-label-amber text-label-amber-foreground',
  red: 'bg-label-red text-label-red-foreground',
  green: 'bg-label-green text-label-green-foreground',
}

export type BadgeTone = keyof typeof tones

type BadgeProps = {
  tone?: BadgeTone
  className?: string
  children: ReactNode
}

export function Badge({ tone = 'grey', className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex h-5 items-center gap-1 rounded-md px-1.5 text-xs font-medium whitespace-nowrap',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}
