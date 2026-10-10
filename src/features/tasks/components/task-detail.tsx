import { CommentThread } from '@/features/comments/components/comment-thread'
import { listComments } from '@/features/comments/queries'
import { listMembers } from '@/features/members/queries'
import { requireUser } from '@/lib/session'
import { getTask } from '../queries'
import { TaskEditor } from './task-editor'

type TaskDetailProps = {
  projectId: string
  taskId: string
  presentation: 'page' | 'modal'
}

// Loads one card with its comments. Rendered by the full task page and by the
// dialog that opens over the board.
export async function TaskDetail({ projectId, taskId, presentation }: TaskDetailProps) {
  const [user, task, members, comments] = await Promise.all([
    requireUser(),
    getTask(projectId, taskId),
    listMembers(projectId),
    listComments(projectId, taskId),
  ])

  return (
    <TaskEditor
      projectId={projectId}
      taskId={task.id}
      members={members}
      presentation={presentation}
      initial={{
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate,
        assigneeId: task.assigneeId,
      }}
    >
      <CommentThread
        projectId={projectId}
        taskId={task.id}
        currentUser={{ id: user.id, name: user.name }}
        comments={comments}
      />
    </TaskEditor>
  )
}
