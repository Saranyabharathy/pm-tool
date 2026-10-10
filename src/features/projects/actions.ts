'use server'

import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { db } from '@/db'
import { projectMembers, projects } from '@/db/schema'
import { runAction } from '@/lib/action'
import { requireProjectOwner } from '@/lib/permissions'
import { requireUser } from '@/lib/session'
import { projectInput, type ProjectInput } from './schemas'

export async function createProject(input: ProjectInput) {
  return runAction(async () => {
    const user = await requireUser()
    const data = projectInput.parse(input)

    const project = await db.transaction(async (tx) => {
      const [created] = await tx
        .insert(projects)
        .values({ ...data, ownerId: user.id })
        .returning({ id: projects.id })
      await tx.insert(projectMembers).values({ projectId: created.id, userId: user.id, role: 'owner' })
      return created
    })

    revalidatePath('/projects')
    return project
  })
}

export async function updateProject(projectId: string, input: ProjectInput) {
  return runAction(async () => {
    await requireProjectOwner(projectId)
    const data = projectInput.parse(input)

    await db.update(projects).set(data).where(eq(projects.id, projectId))

    revalidatePath('/projects')
    revalidatePath(`/projects/${projectId}`, 'layout')
  })
}

export async function deleteProject(projectId: string) {
  return runAction(async () => {
    await requireProjectOwner(projectId)

    await db.delete(projects).where(eq(projects.id, projectId))

    revalidatePath('/projects')
  })
}
