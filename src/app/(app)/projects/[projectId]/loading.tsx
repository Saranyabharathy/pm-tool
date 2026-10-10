import { Skeleton } from '@/components/ui/skeleton'

// Shaped like the board: three lists with a few cards each.
export default function Loading() {
  return (
    <div role="status" aria-label="Loading" className="flex items-start gap-3 p-3 sm:p-4">
      {[3, 2, 1].map((cards, list) => (
        <div key={list} className="w-[272px] shrink-0 space-y-2 rounded-xl bg-list p-2">
          <Skeleton className="mx-2 my-2 h-4 w-24 bg-foreground/10" />
          {Array.from({ length: cards }, (_, index) => (
            <Skeleton key={index} className="h-[72px] rounded-lg bg-card" />
          ))}
        </div>
      ))}
    </div>
  )
}
