import { cn } from '@/lib/cn'

const tones = {
  error: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
  success: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
}

export function FormMessage({ tone = 'error', children }: { tone?: keyof typeof tones; children?: string | null }) {
  if (!children) return null
  return (
    <p role={tone === 'error' ? 'alert' : 'status'} className={cn('text-xs border py-2 px-3 rounded-lg', tones[tone])}>
      {children}
    </p>
  )
}
