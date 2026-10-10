import { beforeAll, describe, expect, it } from 'vitest'
import { addComment, deleteComment } from '@/features/comments/actions'
import { listComments } from '@/features/comments/queries'
import { addMember, removeMember } from '@/features/members/actions'
import { listMembers } from '@/features/members/queries'
import { createProject, deleteProject, updateProject } from '@/features/projects/actions'
import { getProject, listProjects } from '@/features/projects/queries'
import { createTask, deleteTask, moveTask, updateTask } from '@/features/tasks/actions'
import { getTask, listTasks } from '@/features/tasks/queries'
import { expectError, expectOk } from '../helpers/result'
import { createUser, signInAs } from '../helpers/session'

type TestUser = Awaited<ReturnType<typeof createUser>>

// What notFound() throws; Next.js turns it into the 404 page.
const NOT_FOUND = /NEXT_HTTP_ERROR_FALLBACK;404/

let owner: TestUser
let member: TestUser
let outsider: TestUser
let projectId: string
let taskId: string

beforeAll(async () => {
  owner = await createUser('Owner')
  member = await createUser('Member')
  outsider = await createUser('Outsider')

  signInAs(owner)
  projectId = expectOk(await createProject({ name: 'Apollo' })).id
  expectOk(await addMember(projectId, { email: member.email }))
  taskId = expectOk(await createTask(projectId, { title: 'First task' })).id
})

describe('someone who is not a member', () => {
  it('does not see the project in their list', async () => {
    signInAs(outsider)
    expect(await listProjects()).toEqual([])
  })

  it('gets a 404 from every read', async () => {
    signInAs(outsider)
    await expect(getProject(projectId)).rejects.toThrow(NOT_FOUND)
    await expect(listTasks(projectId)).rejects.toThrow(NOT_FOUND)
    await expect(getTask(projectId, taskId)).rejects.toThrow(NOT_FOUND)
    await expect(listMembers(projectId)).rejects.toThrow(NOT_FOUND)
    await expect(listComments(projectId, taskId)).rejects.toThrow(NOT_FOUND)
  })

  it('cannot change anything', async () => {
    signInAs(outsider)
    const notFound = /Project not found/
    expectError(await updateProject(projectId, { name: 'Hacked' }), notFound)
    expectError(await deleteProject(projectId), notFound)
    expectError(await addMember(projectId, { email: outsider.email }), notFound)
    expectError(await removeMember(projectId, member.id), notFound)
    expectError(await createTask(projectId, { title: 'Sneaky' }), notFound)
    expectError(await updateTask(projectId, taskId, { title: 'Sneaky' }), notFound)
    expectError(await moveTask(projectId, { taskId, status: 'done', index: 0 }), notFound)
    expectError(await deleteTask(projectId, taskId), notFound)
    expectError(await addComment(projectId, taskId, { body: 'Hi' }), notFound)

    signInAs(owner)
    expect((await getProject(projectId)).project.name).toBe('Apollo')
    expect(await listTasks(projectId)).toHaveLength(1)
  })

  it('cannot reach a task through a project of their own', async () => {
    signInAs(outsider)
    const ownProjectId = expectOk(await createProject({ name: 'Decoy' })).id

    await expect(getTask(ownProjectId, taskId)).rejects.toThrow(NOT_FOUND)
    expect(await listComments(ownProjectId, taskId)).toEqual([])
    expectError(await updateTask(ownProjectId, taskId, { title: 'Sneaky' }), /Task not found/)
    expectError(await moveTask(ownProjectId, { taskId, status: 'done', index: 0 }), /Task not found/)
    expectError(await deleteTask(ownProjectId, taskId), /Task not found/)
    expectError(await addComment(ownProjectId, taskId, { body: 'Hi' }), /Task not found/)
  })

  it('gets a 404 rather than a crash for a malformed id', async () => {
    signInAs(owner)
    await expect(getProject('not-a-uuid')).rejects.toThrow(NOT_FOUND)
    await expect(getTask(projectId, 'not-a-uuid')).rejects.toThrow(NOT_FOUND)
  })
})

describe('a member who is not the owner', () => {
  it('can read the project and work with tasks', async () => {
    signInAs(member)
    expect((await getProject(projectId)).role).toBe('member')

    const id = expectOk(await createTask(projectId, { title: 'Member task', assigneeId: member.id })).id
    expectOk(await updateTask(projectId, id, { title: 'Member task, edited', priority: 'high' }))
    expect((await getTask(projectId, id)).priority).toBe('high')
    expectOk(await deleteTask(projectId, id))
  })

  it('cannot manage the project or its members', async () => {
    signInAs(member)
    const ownerOnly = /Only the project owner/
    expectError(await updateProject(projectId, { name: 'Renamed' }), ownerOnly)
    expectError(await deleteProject(projectId), ownerOnly)
    expectError(await addMember(projectId, { email: outsider.email }), ownerOnly)
    expectError(await removeMember(projectId, owner.id), ownerOnly)
  })

  it("cannot delete someone else's comment", async () => {
    signInAs(owner)
    expectOk(await addComment(projectId, taskId, { body: 'From the owner' }))
    const [comment] = await listComments(projectId, taskId)

    signInAs(member)
    expectError(await deleteComment(projectId, comment.id), /only delete your own/)

    signInAs(owner)
    expectOk(await deleteComment(projectId, comment.id))
    expect(await listComments(projectId, taskId)).toEqual([])
  })
})

describe('the owner managing members', () => {
  it('cannot add an unknown email or the same person twice', async () => {
    signInAs(owner)
    expectError(await addMember(projectId, { email: 'nobody@example.com' }), /No account uses that email/)
    expectError(await addMember(projectId, { email: member.email.toUpperCase() }), /already a member/)
  })

  it('cannot remove the owner', async () => {
    signInAs(owner)
    expectError(await removeMember(projectId, owner.id), /cannot be removed/)
  })

  it('cannot assign a task to someone outside the project', async () => {
    signInAs(owner)
    expectError(await createTask(projectId, { title: 'T', assigneeId: outsider.id }), /must be a member/)
  })

  it('unassigns a removed member from their tasks', async () => {
    signInAs(owner)
    const id = expectOk(await createTask(projectId, { title: 'Assigned', assigneeId: member.id })).id

    expectOk(await removeMember(projectId, member.id))

    expect((await getTask(projectId, id)).assigneeId).toBeNull()
    expect((await listMembers(projectId)).map((m) => m.userId)).toEqual([owner.id])
    signInAs(member)
    await expect(getProject(projectId)).rejects.toThrow(NOT_FOUND)
  })
})
