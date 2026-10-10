import { MessageSquare } from 'lucide-react'
import { UserAvatar } from '@/components/ui/user-avatar'
import type { TaskStatus } from '@/db/schema'
import { cn } from '@/lib/utils'
import type { TaskSummary } from '../queries'
import { DueChip, PriorityBadge } from './task-badges'

type TaskCardProps = {
  task: TaskSummary
  // The list the card is shown in, which leads task.status while a move is in flight.
  status: TaskStatus
  today: string
  className?: string
}

// The face of a card. Board lists and the drag overlay both render it.
export function TaskCard({ task, status, today, className }: TaskCardProps) {
  const hasMeta = task.dueDate || task.commentCount > 0 || task.assigneeId

  return (
    <div className={cn('rounded-lg bg-card px-3 py-2 shadow-card', className)}>
      <PriorityBadge priority={task.priority} />
      <p className="mt-1.5 line-clamp-3 text-sm wrap-anywhere">{task.title}</p>
      {hasMeta && (
        <div className="mt-2 flex items-center gap-2.5">
          {task.dueDate && <DueChip dueDate={task.dueDate} status={status} today={today} />}
          {task.commentCount > 0 && (
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground tabular-nums">
              <MessageSquare className="size-3.5" aria-hidden />
              {task.commentCount}
              <span className="sr-only">{task.commentCount === 1 ? ' comment' : ' comments'}</span>
            </span>
          )}
          {task.assigneeId && task.assigneeName && (
            <UserAvatar id={task.assigneeId} name={task.assigneeName} size="md" className="ml-auto" />
          )}
        </div>
      )}
    </div>
  )
}
