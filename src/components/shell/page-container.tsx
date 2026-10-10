import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

// Centres ordinary pages. The board does not use it; it fills the whole area.
export function PageContainer({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn('mx-auto w-full max-w-[1120px] px-4 py-6 sm:px-6', className)}>{children}</div>
}
