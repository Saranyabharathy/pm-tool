'use server'

import { and, asc, eq, sql } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { db, type Tx } from '@/db'
import { tasks, type TaskStatus } from '@/db/schema'
import { AppError, runAction } from '@/lib/action'
import { getProjectRole, requireProjectMember } from '@/lib/permissions'
import { moveItem, type Columns } from './position'
import { moveTaskInput, taskInput, type MoveTaskInput, type TaskInput } from './schemas'

type Slot = { id: string; status: TaskStatus; position: number }

// Reads every task of the project in board order and locks the rows, so two
// concurrent moves cannot interleave.
async function loadColumns(tx: Tx, projectId: string): Promise<Columns<Slot>> {
  const rows = await tx
    .select({ id: tasks.id, status: tasks.status, position: tasks.position })
    .from(tasks)
    .where(eq(tasks.projectId, projectId))
    .orderBy(asc(tasks.position))
    .for('update')

  const columns: Columns<Slot> = { todo: [], in_progress: [], done: [] }
  for (const row of rows) columns[row.status].push(row)
  return columns
}

// Writes back only the rows whose column or index changed, leaving positions
// contiguous from zero in every column.
async function saveColumns(tx: Tx, columns: Columns<Slot>) {
  for (const status of Object.keys(columns) as TaskStatus[]) {
    for (const [position, slot] of columns[status].entries()) {
      if (slot.status === status && slot.position === position) continue
      await tx.update(tasks).set({ status, position }).where(eq(tasks.id, slot.id))
    }
  }
}

function findSlot(columns: Columns<Slot>, taskId: string) {
  const slot = Object.values(columns)
    .flat()
    .find((item) => item.id === taskId)
  if (!slot) throw new AppError('NOT_FOUND', 'Task not found.')
  return slot
}

async function assertAssignable(projectId: string, assigneeId: string | null) {
  if (assigneeId && !(await getProjectRole(projectId, assigneeId))) {
    throw new AppError('INVALID', 'The assignee must be a member of this project.')
  }
}

function revalidateProject(projectId: string) {
  revalidatePath(`/projects/${projectId}`, 'layout')
  revalidatePath('/projects')
}

export async function createTask(projectId: string, input: TaskInput) {
  return runAction(async () => {
    const { user } = await requireProjectMember(projectId)
    const data = taskInput.parse(input)
    await assertAssignable(projectId, data.assigneeId)

    const [task] = await db
      .insert(tasks)
      .values({
        ...data,
        projectId,
        createdBy: user.id,
        // Append to the end of its column.
        position: sql`(select coalesce(max(${tasks.position}), -1) + 1 from ${tasks} where ${tasks.projectId} = ${projectId} and ${tasks.status} = ${data.status})`,
      })
      .returning({ id: tasks.id })

    revalidateProject(projectId)
    return task
  })
}

export async function updateTask(projectId: string, taskId: string, input: TaskInput) {
  return runAction(async () => {
    await requireProjectMember(projectId)
    const { status, ...fields } = taskInput.parse(input)
    await assertAssignable(projectId, fields.assigneeId)

    await db.transaction(async (tx) => {
      const columns = await loadColumns(tx, projectId)
      const slot = findSlot(columns, taskId)

      await tx.update(tasks).set(fields).where(eq(tasks.id, taskId))

      if (slot.status !== status) {
        await saveColumns(tx, moveItem(columns, taskId, status, columns[status].length))
      }
    })

    revalidateProject(projectId)
  })
}

export async function moveTask(projectId: string, input: MoveTaskInput) {
  return runAction(async () => {
    await requireProjectMember(projectId)
    const { taskId, status, index } = moveTaskInput.parse(input)

    await db.transaction(async (tx) => {
      const columns = await loadColumns(tx, projectId)
      findSlot(columns, taskId)
      await saveColumns(tx, moveItem(columns, taskId, status, index))
    })

    revalidateProject(projectId)
  })
}

export async function deleteTask(projectId: string, taskId: string) {
  return runAction(async () => {
    await requireProjectMember(projectId)

    await db.transaction(async (tx) => {
      const columns = await loadColumns(tx, projectId)
      const slot = findSlot(columns, taskId)

      await tx.delete(tasks).where(and(eq(tasks.id, taskId), eq(tasks.projectId, projectId)))

      columns[slot.status] = columns[slot.status].filter((item) => item.id !== taskId)
      await saveColumns(tx, columns)
    })

    revalidateProject(projectId)
  })
}
