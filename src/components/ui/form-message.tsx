import { CircleAlert, CircleCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

const tones = {
  error: 'bg-label-red text-label-red-foreground',
  success: 'bg-label-green text-label-green-foreground',
}

export function FormMessage({ tone = 'error', children }: { tone?: keyof typeof tones; children?: string | null }) {
  if (!children) return null
  const Icon = tone === 'error' ? CircleAlert : CircleCheck
  return (
    <p
      role={tone === 'error' ? 'alert' : 'status'}
      className={cn('flex items-start gap-2 rounded-lg px-3 py-2 text-[13px]', tones[tone])}
    >
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden />
      {children}
    </p>
  )
}
