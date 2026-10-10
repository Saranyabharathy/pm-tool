import { Compass } from 'lucide-react'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { cn } from '@/lib/utils'

export default function NotFound() {
  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <EmptyState
        icon={Compass}
        title="Page not found"
        description="It does not exist, or you do not have access to it."
        className="border-none"
        action={
          <Link href="/projects" className={cn(buttonVariants({ variant: 'outline' }))}>
            Back to projects
          </Link>
        }
      />
    </div>
  )
}
