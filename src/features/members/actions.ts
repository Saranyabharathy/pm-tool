'use server'

import { and, eq, sql } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { db } from '@/db'
import { projectMembers, tasks, user } from '@/db/schema'
import { AppError, runAction } from '@/lib/action'
import { requireProjectOwner } from '@/lib/permissions'
import { addMemberInput, type AddMemberInput } from './schemas'

export async function addMember(projectId: string, input: AddMemberInput) {
  return runAction(async () => {
    await requireProjectOwner(projectId)
    const { email } = addMemberInput.parse(input)

    const [found] = await db
      .select({ id: user.id })
      .from(user)
      .where(eq(sql`lower(${user.email})`, email))
    if (!found) {
      throw new AppError('NOT_FOUND', 'No account uses that email. Ask them to sign up first.')
    }

    const inserted = await db
      .insert(projectMembers)
      .values({ projectId, userId: found.id, role: 'member' })
      .onConflictDoNothing()
      .returning({ userId: projectMembers.userId })
    if (inserted.length === 0) {
      throw new AppError('CONFLICT', 'That person is already a member of this project.')
    }

    revalidatePath(`/projects/${projectId}`, 'layout')
  })
}

export async function removeMember(projectId: string, userId: string) {
  return runAction(async () => {
    await requireProjectOwner(projectId)

    await db.transaction(async (tx) => {
      const removed = await tx
        .delete(projectMembers)
        .where(
          and(
            eq(projectMembers.projectId, projectId),
            eq(projectMembers.userId, userId),
            eq(projectMembers.role, 'member'),
          ),
        )
        .returning({ userId: projectMembers.userId })
      if (removed.length === 0) {
        throw new AppError('INVALID', 'That person cannot be removed from this project.')
      }

      // Their tasks stay in the project, unassigned.
      await tx
        .update(tasks)
        .set({ assigneeId: null })
        .where(and(eq(tasks.projectId, projectId), eq(tasks.assigneeId, userId)))
    })

    revalidatePath(`/projects/${projectId}`, 'layout')
  })
}
