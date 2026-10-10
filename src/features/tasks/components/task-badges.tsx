import { Clock } from 'lucide-react'
import { Badge, type BadgeTone } from '@/components/ui/badge'
import type { TaskPriority, TaskStatus } from '@/db/schema'
import { formatShortDate } from '@/lib/format'
import { cn } from '@/lib/utils'
import { PRIORITY_LABELS, STATUS_LABELS } from '../constants'

const priorityTones: Record<TaskPriority, BadgeTone> = { low: 'grey', medium: 'amber', high: 'red' }
const statusTones: Record<TaskStatus, BadgeTone> = { todo: 'grey', in_progress: 'blue', done: 'green' }

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  return <Badge tone={priorityTones[priority]}>{PRIORITY_LABELS[priority]}</Badge>
}

export function StatusBadge({ status }: { status: TaskStatus }) {
  return <Badge tone={statusTones[status]}>{STATUS_LABELS[status]}</Badge>
}

type DueChipProps = {
  dueDate: string
  status: TaskStatus
  // Today as 'YYYY-MM-DD', passed in so server and client render the same.
  today: string
}

export function DueChip({ dueDate, status, today }: DueChipProps) {
  const done = status === 'done'
  const overdue = !done && dueDate < today

  return (
    <span
      className={cn(
        'inline-flex h-5 items-center gap-1 rounded-md text-xs whitespace-nowrap',
        done && 'bg-label-green px-1.5 text-label-green-foreground',
        overdue && 'bg-label-red px-1.5 text-label-red-foreground',
        !done && !overdue && 'text-muted-foreground',
      )}
    >
      <Clock className="size-3.5" aria-hidden />
      {overdue && <span className="sr-only">Overdue, </span>}
      {done && <span className="sr-only">Completed, </span>}
      <span className="sr-only">due </span>
      {formatShortDate(dueDate, today)}
    </span>
  )
}
