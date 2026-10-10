import { date, index, integer, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { user } from './auth'
import { projects } from './projects'

export const taskStatus = pgEnum('task_status', ['todo', 'in_progress', 'done'])
export const taskPriority = pgEnum('task_priority', ['low', 'medium', 'high'])

export const tasks = pgTable(
  'tasks',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    projectId: uuid('project_id')
      .notNull()
      .references(() => projects.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    description: text('description').notNull().default(''),
    status: taskStatus('status').notNull().default('todo'),
    priority: taskPriority('priority').notNull().default('medium'),
    dueDate: date('due_date'),
    assigneeId: text('assignee_id').references(() => user.id, { onDelete: 'set null' }),
    // Zero-based order of the task inside its status column.
    position: integer('position').notNull(),
    createdBy: text('created_by')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [index('tasks_board_idx').on(table.projectId, table.status, table.position)],
)

export type Task = typeof tasks.$inferSelect
export type TaskStatus = (typeof taskStatus.enumValues)[number]
export type TaskPriority = (typeof taskPriority.enumValues)[number]
