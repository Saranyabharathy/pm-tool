import { Badge, type BadgeTone } from '@/components/ui/badge'
import type { TaskPriority, TaskStatus } from '@/db/schema'
import { cn } from '@/lib/cn'
import { formatDate } from '@/lib/format'
import { PRIORITY_LABELS, STATUS_LABELS } from '../constants'

const priorityTones: Record<TaskPriority, BadgeTone> = { low: 'neutral', medium: 'amber', high: 'rose' }
const statusTones: Record<TaskStatus, BadgeTone> = { todo: 'neutral', in_progress: 'blue', done: 'emerald' }

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  return <Badge tone={priorityTones[priority]}>{PRIORITY_LABELS[priority]}</Badge>
}

export function StatusBadge({ status }: { status: TaskStatus }) {
  return <Badge tone={statusTones[status]}>{STATUS_LABELS[status]}</Badge>
}

type DueDateProps = {
  dueDate: string
  status: TaskStatus
  // Today as 'YYYY-MM-DD', passed in so server and client render the same.
  today: string
}

export function DueDate({ dueDate, status, today }: DueDateProps) {
  const overdue = status !== 'done' && dueDate < today
  return (
    <span className={cn('text-xs', overdue ? 'text-rose-400' : 'text-slate-400')}>
      {overdue ? 'Overdue · ' : 'Due '}
      {formatDate(dueDate)}
    </span>
  )
}
