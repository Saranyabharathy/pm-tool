'use client'

import { TriangleAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <EmptyState
        icon={TriangleAlert}
        title="Something went wrong"
        description="The page could not be loaded. Your data is safe; please try again."
        className="border-none"
        action={
          <Button variant="outline" onClick={reset}>
            Try again
          </Button>
        }
      />
    </div>
  )
}
