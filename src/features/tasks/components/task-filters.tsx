'use client'

import { X } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/field'
import { Spinner } from '@/components/ui/spinner'
import type { Member } from '@/features/members/queries'
import { STATUS_LABELS, TASK_STATUSES } from '../constants'

type TaskFiltersProps = {
  members: Member[]
  status: string
  assignee: string
  // The value that means "nobody is assigned".
  unassignedValue: string
}

// Filters live in the URL, so a filtered list can be linked and reloaded.
export function TaskFilters({ members, status, assignee, unassignedValue }: TaskFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [pending, startTransition] = useTransition()

  function update(name: string, value: string) {
    const params = new URLSearchParams(searchParams)
    if (value) params.set(name, value)
    else params.delete(name)
    const query = params.toString()
    startTransition(() => router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false }))
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select
        aria-label="Filter by status"
        value={status}
        onChange={(e) => update('status', e.target.value)}
        className="w-auto min-w-36"
      >
        <option value="">All statuses</option>
        {TASK_STATUSES.map((value) => (
          <option key={value} value={value}>
            {STATUS_LABELS[value]}
          </option>
        ))}
      </Select>
      <Select
        aria-label="Filter by assignee"
        value={assignee}
        onChange={(e) => update('assignee', e.target.value)}
        className="w-auto min-w-36"
      >
        <option value="">Anyone</option>
        <option value={unassignedValue}>Unassigned</option>
        {members.map((member) => (
          <option key={member.userId} value={member.userId}>
            {member.name}
          </option>
        ))}
      </Select>
      {(status || assignee) && (
        <Button variant="ghost" onClick={() => startTransition(() => router.replace(pathname, { scroll: false }))}>
          <X aria-hidden />
          Clear
        </Button>
      )}
      {pending && <Spinner className="text-muted-foreground" />}
    </div>
  )
}
