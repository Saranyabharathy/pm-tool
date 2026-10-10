import { and, eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import { z } from 'zod'
import { db } from '@/db'
import { projectMembers, type MemberRole } from '@/db/schema'
import { AppError } from '@/lib/action'
import { requireUser } from '@/lib/session'

export async function getProjectRole(projectId: string, userId: string): Promise<MemberRole | null> {
  // Ids come from the URL; a malformed one would make Postgres throw.
  if (!z.uuid().safeParse(projectId).success) return null

  const [membership] = await db
    .select({ role: projectMembers.role })
    .from(projectMembers)
    .where(and(eq(projectMembers.projectId, projectId), eq(projectMembers.userId, userId)))

  return membership?.role ?? null
}

// For server actions. Non-members get the same answer as for a missing
// project, so project ids cannot be probed.
export async function requireProjectMember(projectId: string) {
  const user = await requireUser()
  const role = await getProjectRole(projectId, user.id)
  if (!role) throw new AppError('NOT_FOUND', 'Project not found.')
  return { user, role }
}

export async function requireProjectOwner(projectId: string) {
  const access = await requireProjectMember(projectId)
  if (access.role !== 'owner') {
    throw new AppError('FORBIDDEN', 'Only the project owner can do this.')
  }
  return access
}

// For queries called while rendering a page: renders the 404 page instead.
export async function requireProjectAccess(projectId: string) {
  const user = await requireUser()
  const role = await getProjectRole(projectId, user.id)
  if (!role) notFound()
  return { user, role }
}
