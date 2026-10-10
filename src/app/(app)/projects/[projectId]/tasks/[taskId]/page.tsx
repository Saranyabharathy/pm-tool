import type { Metadata } from 'next'
import Link from 'next/link'
import { CommentThread } from '@/features/comments/components/comment-thread'
import { listComments } from '@/features/comments/queries'
import { listMembers } from '@/features/members/queries'
import { TaskEditor } from '@/features/tasks/components/task-editor'
import { getTask } from '@/features/tasks/queries'
import { requireUser } from '@/lib/session'

type TaskPageProps = {
  params: Promise<{ projectId: string; taskId: string }>
}

export async function generateMetadata({ params }: TaskPageProps): Promise<Metadata> {
  const { projectId, taskId } = await params
  const task = await getTask(projectId, taskId)
  return { title: task.title }
}

export default async function TaskPage({ params }: TaskPageProps) {
  const { projectId, taskId } = await params
  const [user, task, members, comments] = await Promise.all([
    requireUser(),
    getTask(projectId, taskId),
    listMembers(projectId),
    listComments(projectId, taskId),
  ])

  return (
    <div className="space-y-6">
      <Link href={`/projects/${projectId}`} className="text-sm text-slate-400 hover:text-slate-200">
        ← Back to board
      </Link>

      <div className="grid gap-6 lg:grid-cols-5">
        <section className="rounded-2xl border border-white/10 bg-white/5 p-6 lg:col-span-3">
          <h2 className="mb-4 text-lg font-semibold text-white">Task details</h2>
          <TaskEditor
            projectId={projectId}
            taskId={task.id}
            members={members}
            initial={{
              title: task.title,
              description: task.description,
              status: task.status,
              priority: task.priority,
              dueDate: task.dueDate,
              assigneeId: task.assigneeId,
            }}
          />
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-6 lg:col-span-2">
          <h2 className="mb-4 text-lg font-semibold text-white">Comments</h2>
          <CommentThread projectId={projectId} taskId={task.id} currentUserId={user.id} comments={comments} />
        </section>
      </div>
    </div>
  )
}
