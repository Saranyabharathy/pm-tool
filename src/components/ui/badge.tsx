import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

const tones = {
  neutral: 'bg-slate-500/10 border-slate-500/20 text-slate-300',
  blue: 'bg-blue-500/10 border-blue-500/20 text-blue-300',
  amber: 'bg-amber-500/10 border-amber-500/20 text-amber-300',
  rose: 'bg-rose-500/10 border-rose-500/20 text-rose-300',
  emerald: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300',
}

export type BadgeTone = keyof typeof tones

export function Badge({ tone = 'neutral', children }: { tone?: BadgeTone; children: ReactNode }) {
  return (
    <span className={cn('inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium', tones[tone])}>
      {children}
    </span>
  )
}
