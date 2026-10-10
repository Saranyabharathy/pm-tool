import { asc, eq } from 'drizzle-orm'
import { beforeEach, describe, expect, it } from 'vitest'
import { tasks, type TaskStatus } from '@/db/schema'
import { createProject, deleteProject } from '@/features/projects/actions'
import { createTask, deleteTask, moveTask, updateTask } from '@/features/tasks/actions'
import { listTasks } from '@/features/tasks/queries'
import { testDb } from '../helpers/db'
import { expectOk } from '../helpers/result'
import { createUser, signInAs } from '../helpers/session'

let projectId: string

async function addTask(title: string, status: TaskStatus = 'todo') {
  return expectOk(await createTask(projectId, { title, status })).id
}

// The board as stored: titles per column, after checking that positions run 0, 1, 2...
async function board() {
  const rows = await testDb
    .select({ title: tasks.title, status: tasks.status, position: tasks.position })
    .from(tasks)
    .where(eq(tasks.projectId, projectId))
    .orderBy(asc(tasks.position))

  const columns: Record<TaskStatus, string[]> = { todo: [], in_progress: [], done: [] }
  for (const row of rows) {
    expect(row.position, `position of "${row.title}"`).toBe(columns[row.status].length)
    columns[row.status].push(row.title)
  }
  return columns
}

beforeEach(async () => {
  signInAs(await createUser('Owner'))
  projectId = expectOk(await createProject({ name: 'Board' })).id
})

describe('task ordering', () => {
  it('appends new tasks to the end of their column', async () => {
    await addTask('a')
    await addTask('b')
    await addTask('x', 'done')
    await addTask('c')

    expect(await board()).toEqual({ todo: ['a', 'b', 'c'], in_progress: [], done: ['x'] })
  })

  it('reorders within a column', async () => {
    const a = await addTask('a')
    await addTask('b')
    await addTask('c')

    expectOk(await moveTask(projectId, { taskId: a, status: 'todo', index: 2 }))

    expect((await board()).todo).toEqual(['b', 'c', 'a'])
  })

  it('moves a task into the middle of another column', async () => {
    await addTask('a')
    const b = await addTask('b')
    await addTask('c')
    await addTask('x', 'in_progress')
    await addTask('y', 'in_progress')

    expectOk(await moveTask(projectId, { taskId: b, status: 'in_progress', index: 1 }))

    expect(await board()).toEqual({ todo: ['a', 'c'], in_progress: ['x', 'b', 'y'], done: [] })
  })

  it('clamps an index beyond the end of the column', async () => {
    const a = await addTask('a')
    await addTask('x', 'done')

    expectOk(await moveTask(projectId, { taskId: a, status: 'done', index: 50 }))

    expect(await board()).toEqual({ todo: [], in_progress: [], done: ['x', 'a'] })
  })

  it('moves a task to the end of the new column when its status is edited', async () => {
    const a = await addTask('a')
    await addTask('b')
    await addTask('x', 'done')

    expectOk(await updateTask(projectId, a, { title: 'a', status: 'done' }))

    expect(await board()).toEqual({ todo: ['b'], in_progress: [], done: ['x', 'a'] })
  })

  it('keeps its place when edited without a status change', async () => {
    const a = await addTask('a')
    await addTask('b')

    expectOk(await updateTask(projectId, a, { title: 'a2', status: 'todo' }))

    expect((await board()).todo).toEqual(['a2', 'b'])
  })

  it('closes the gap when a task is deleted', async () => {
    await addTask('a')
    const b = await addTask('b')
    await addTask('c')

    expectOk(await deleteTask(projectId, b))

    expect((await board()).todo).toEqual(['a', 'c'])
  })
})

describe('task queries', () => {
  it('filters the list by status and by unassigned', async () => {
    await addTask('a')
    await addTask('x', 'done')

    expect((await listTasks(projectId, { status: 'done' })).map((t) => t.title)).toEqual(['x'])
    expect(await listTasks(projectId, { assigneeId: 'none' })).toHaveLength(2)
  })

  it('removes tasks together with their project', async () => {
    await addTask('a')

    expectOk(await deleteProject(projectId))

    expect(await testDb.select().from(tasks).where(eq(tasks.projectId, projectId))).toEqual([])
  })
})
