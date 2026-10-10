import type { TaskPriority, TaskStatus } from '@/db/schema'

export const TASK_STATUSES = ['todo', 'in_progress', 'done'] as const satisfies readonly TaskStatus[]
export const TASK_PRIORITIES = ['low', 'medium', 'high'] as const satisfies readonly TaskPriority[]

export const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: 'To do',
  in_progress: 'In progress',
  done: 'Done',
}

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
}
