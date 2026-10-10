import { desc, eq, sql } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import { db } from '@/db'
import { projectMembers, projects, tasks } from '@/db/schema'
import { requireProjectAccess } from '@/lib/permissions'
import { requireUser } from '@/lib/session'

export async function listProjects() {
  const user = await requireUser()

  return db
    .select({
      id: projects.id,
      name: projects.name,
      description: projects.description,
      role: projectMembers.role,
      updatedAt: projects.updatedAt,
      taskCount: sql<number>`(select count(*)::int from ${tasks} where ${tasks.projectId} = ${projects.id})`,
      openTaskCount: sql<number>`(select count(*)::int from ${tasks} where ${tasks.projectId} = ${projects.id} and ${tasks.status} <> 'done')`,
    })
    .from(projectMembers)
    .innerJoin(projects, eq(projects.id, projectMembers.projectId))
    .where(eq(projectMembers.userId, user.id))
    .orderBy(desc(projects.updatedAt))
}

export type ProjectSummary = Awaited<ReturnType<typeof listProjects>>[number]

export async function getProject(projectId: string) {
  const { user, role } = await requireProjectAccess(projectId)

  const [project] = await db.select().from(projects).where(eq(projects.id, projectId))
  if (!project) notFound()

  return { project, role, user }
}
