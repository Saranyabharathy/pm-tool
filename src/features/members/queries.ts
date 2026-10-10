import { asc, eq } from 'drizzle-orm'
import { db } from '@/db'
import { projectMembers, user } from '@/db/schema'
import { requireProjectAccess } from '@/lib/permissions'

export async function listMembers(projectId: string) {
  await requireProjectAccess(projectId)

  return db
    .select({
      userId: user.id,
      name: user.name,
      email: user.email,
      role: projectMembers.role,
    })
    .from(projectMembers)
    .innerJoin(user, eq(user.id, projectMembers.userId))
    .where(eq(projectMembers.projectId, projectId))
    .orderBy(asc(projectMembers.createdAt))
}

export type Member = Awaited<ReturnType<typeof listMembers>>[number]
