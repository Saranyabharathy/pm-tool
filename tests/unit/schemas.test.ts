import { describe, expect, it } from 'vitest'
import { commentInput } from '@/features/comments/schemas'
import { addMemberInput } from '@/features/members/schemas'
import { projectInput } from '@/features/projects/schemas'
import { moveTaskInput, taskInput } from '@/features/tasks/schemas'

describe('projectInput', () => {
  it('trims the name and defaults the description', () => {
    expect(projectInput.parse({ name: '  Launch  ' })).toEqual({ name: 'Launch', description: '' })
  })

  it('rejects a blank name', () => {
    expect(projectInput.safeParse({ name: '   ' }).success).toBe(false)
  })

  it('rejects a name over 80 characters', () => {
    expect(projectInput.safeParse({ name: 'x'.repeat(81) }).success).toBe(false)
  })
})

describe('taskInput', () => {
  it('fills in defaults', () => {
    expect(taskInput.parse({ title: 'Write docs' })).toEqual({
      title: 'Write docs',
      description: '',
      status: 'todo',
      priority: 'medium',
      dueDate: null,
      assigneeId: null,
    })
  })

  it('accepts a calendar date and rejects anything else', () => {
    expect(taskInput.safeParse({ title: 't', dueDate: '2026-12-31' }).success).toBe(true)
    expect(taskInput.safeParse({ title: 't', dueDate: '31/12/2026' }).success).toBe(false)
    expect(taskInput.safeParse({ title: 't', dueDate: '2026-02-30' }).success).toBe(false)
  })

  it('rejects unknown status and priority values', () => {
    expect(taskInput.safeParse({ title: 't', status: 'blocked' }).success).toBe(false)
    expect(taskInput.safeParse({ title: 't', priority: 'urgent' }).success).toBe(false)
  })
})

describe('moveTaskInput', () => {
  const taskId = '3f2b6c0e-8a51-4c0e-9d57-2a1f4c9b7e10'

  it('rejects a negative or fractional index', () => {
    expect(moveTaskInput.safeParse({ taskId, status: 'done', index: -1 }).success).toBe(false)
    expect(moveTaskInput.safeParse({ taskId, status: 'done', index: 1.5 }).success).toBe(false)
  })

  it('rejects a task id that is not a uuid', () => {
    expect(moveTaskInput.safeParse({ taskId: 'abc', status: 'done', index: 0 }).success).toBe(false)
  })
})

describe('addMemberInput', () => {
  it('trims and lower-cases the email', () => {
    expect(addMemberInput.parse({ email: '  Sam@Example.COM ' })).toEqual({ email: 'sam@example.com' })
  })

  it('rejects a malformed email', () => {
    expect(addMemberInput.safeParse({ email: 'not-an-email' }).success).toBe(false)
  })
})

describe('commentInput', () => {
  it('rejects an empty comment', () => {
    expect(commentInput.safeParse({ body: '  \n ' }).success).toBe(false)
  })
})
