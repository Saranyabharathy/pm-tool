'use client'

import { Button } from '@/components/ui/button'

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-2xl font-bold text-white">Something went wrong</h1>
      <p className="text-sm text-slate-400">The page could not be loaded. Please try again.</p>
      <Button variant="secondary" onClick={reset}>
        Try again
      </Button>
    </div>
  )
}
