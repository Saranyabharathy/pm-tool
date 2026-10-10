import { and, asc, eq, isNull, sql, type SQL } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import { z } from 'zod'
import { db } from '@/db'
import { comments, tasks, user, type TaskStatus } from '@/db/schema'
import { requireProjectAccess } from '@/lib/permissions'

export const UNASSIGNED = 'none'

type TaskFilters = {
  status?: TaskStatus
  // A user id, or UNASSIGNED for tasks nobody is assigned to.
  assigneeId?: string
}

export async function listTasks(projectId: string, filters: TaskFilters = {}) {
  await requireProjectAccess(projectId)

  const conditions: SQL[] = [eq(tasks.projectId, projectId)]
  if (filters.status) conditions.push(eq(tasks.status, filters.status))
  if (filters.assigneeId === UNASSIGNED) conditions.push(isNull(tasks.assigneeId))
  else if (filters.assigneeId) conditions.push(eq(tasks.assigneeId, filters.assigneeId))

  return db
    .select({
      id: tasks.id,
      title: tasks.title,
      status: tasks.status,
      priority: tasks.priority,
      dueDate: tasks.dueDate,
      assigneeId: tasks.assigneeId,
      assigneeName: user.name,
      commentCount: sql<number>`(select count(*)::int from ${comments} where ${comments.taskId} = ${tasks.id})`,
    })
    .from(tasks)
    .leftJoin(user, eq(user.id, tasks.assigneeId))
    .where(and(...conditions))
    .orderBy(asc(tasks.status), asc(tasks.position))
}

export type TaskSummary = Awaited<ReturnType<typeof listTasks>>[number]

export async function getTask(projectId: string, taskId: string) {
  await requireProjectAccess(projectId)
  if (!z.uuid().safeParse(taskId).success) notFound()

  const [task] = await db
    .select()
    .from(tasks)
    .where(and(eq(tasks.id, taskId), eq(tasks.projectId, projectId)))
  if (!task) notFound()

  return task
}
