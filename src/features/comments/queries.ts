import { and, asc, eq } from 'drizzle-orm'
import { db } from '@/db'
import { comments, tasks, user } from '@/db/schema'
import { requireProjectAccess } from '@/lib/permissions'

export async function listComments(projectId: string, taskId: string) {
  await requireProjectAccess(projectId)

  return db
    .select({
      id: comments.id,
      body: comments.body,
      createdAt: comments.createdAt,
      authorId: comments.authorId,
      authorName: user.name,
    })
    .from(comments)
    .innerJoin(tasks, eq(tasks.id, comments.taskId))
    .innerJoin(user, eq(user.id, comments.authorId))
    // The join on project id stops a member of one project reading another's comments.
    .where(and(eq(comments.taskId, taskId), eq(tasks.projectId, projectId)))
    .orderBy(asc(comments.createdAt))
}

export type CommentItem = Awaited<ReturnType<typeof listComments>>[number]
