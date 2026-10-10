'use server'

import { and, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { db } from '@/db'
import { comments, tasks } from '@/db/schema'
import { AppError, runAction } from '@/lib/action'
import { requireProjectMember } from '@/lib/permissions'
import { commentInput, type CommentInput } from './schemas'

export async function addComment(projectId: string, taskId: string, input: CommentInput) {
  return runAction(async () => {
    const { user } = await requireProjectMember(projectId)
    const { body } = commentInput.parse(input)

    const [task] = z.uuid().safeParse(taskId).success
      ? await db
          .select({ id: tasks.id })
          .from(tasks)
          .where(and(eq(tasks.id, taskId), eq(tasks.projectId, projectId)))
      : []
    if (!task) throw new AppError('NOT_FOUND', 'Task not found.')

    await db.insert(comments).values({ taskId, authorId: user.id, body })

    revalidatePath(`/projects/${projectId}/tasks/${taskId}`)
  })
}

export async function deleteComment(projectId: string, commentId: string) {
  return runAction(async () => {
    const { user } = await requireProjectMember(projectId)

    const [comment] = z.uuid().safeParse(commentId).success
      ? await db
          .select({ id: comments.id, authorId: comments.authorId, taskId: comments.taskId })
          .from(comments)
          .innerJoin(tasks, eq(tasks.id, comments.taskId))
          .where(and(eq(comments.id, commentId), eq(tasks.projectId, projectId)))
      : []
    if (!comment) throw new AppError('NOT_FOUND', 'Comment not found.')
    if (comment.authorId !== user.id) {
      throw new AppError('FORBIDDEN', 'You can only delete your own comments.')
    }

    await db.delete(comments).where(eq(comments.id, commentId))

    revalidatePath(`/projects/${projectId}/tasks/${comment.taskId}`)
  })
}
