import { PageContainer } from '@/components/shell/page-container'
import { Skeleton } from '@/components/ui/skeleton'

// Shaped like the projects page, the first screen after signing in.
export default function Loading() {
  return (
    <PageContainer className="space-y-6" >
      <div role="status" aria-label="Loading" className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="h-36 rounded-xl" />
          ))}
        </div>
      </div>
    </PageContainer>
  )
}
