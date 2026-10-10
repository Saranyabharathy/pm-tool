export default function Loading() {
  return (
    <div className="space-y-4" role="status" aria-label="Loading">
      <div className="h-8 w-48 animate-pulse rounded-lg bg-white/10" />
      <div className="grid gap-4 md:grid-cols-3">
        <div className="h-40 animate-pulse rounded-2xl bg-white/5" />
        <div className="h-40 animate-pulse rounded-2xl bg-white/5" />
        <div className="h-40 animate-pulse rounded-2xl bg-white/5" />
      </div>
    </div>
  )
}
