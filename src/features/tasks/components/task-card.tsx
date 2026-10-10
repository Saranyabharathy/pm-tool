import Link from 'next/link'
import type { TaskStatus } from '@/db/schema'
import type { TaskSummary } from '../queries'
import { DueDate, PriorityBadge } from './task-badges'

type TaskCardProps = {
  projectId: string
  task: TaskSummary
  // The column the card is shown in, which leads task.status while a move is in flight.
  status: TaskStatus
  today: string
}

export function TaskCard({ projectId, task, status, today }: TaskCardProps) {
  return (
    <div className="rounded-xl border border-white/10 bg-slate-900 p-3 shadow-sm">
      <Link
        href={`/projects/${projectId}/tasks/${task.id}`}
        draggable={false}
        className="block text-sm font-medium text-slate-100 wrap-anywhere hover:text-blue-300"
      >
        {task.title}
      </Link>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <PriorityBadge priority={task.priority} />
        {task.dueDate && <DueDate dueDate={task.dueDate} status={status} today={today} />}
      </div>
      {task.assigneeName && <p className="mt-2 text-xs text-slate-500">{task.assigneeName}</p>}
    </div>
  )
}
