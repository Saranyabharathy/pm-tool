import { z } from 'zod'
import { TASK_PRIORITIES, TASK_STATUSES } from './constants'

export const taskInput = z.object({
  title: z.string().trim().min(1, 'Title is required.').max(200, 'Keep the title under 200 characters.'),
  description: z.string().trim().max(5000, 'Keep the description under 5000 characters.').default(''),
  status: z.enum(TASK_STATUSES).default('todo'),
  priority: z.enum(TASK_PRIORITIES).default('medium'),
  dueDate: z.iso.date('Enter a valid date.').nullable().default(null),
  assigneeId: z.string().min(1).nullable().default(null),
})

export type TaskInput = z.input<typeof taskInput>

export const moveTaskInput = z.object({
  taskId: z.uuid(),
  status: z.enum(TASK_STATUSES),
  index: z.number().int().min(0),
})

export type MoveTaskInput = z.input<typeof moveTaskInput>
