import { RouteModal } from '@/components/ui/route-modal'
import { TaskDetail } from '@/features/tasks/components/task-detail'
import { getTask } from '@/features/tasks/queries'

type TaskModalProps = {
  params: Promise<{ projectId: string; taskId: string }>
}

// Shown when a card is opened from inside the project: the task appears in a
// dialog over the current page. Loading the same URL directly renders
// ../../tasks/[taskId]/page.tsx instead.
export default async function TaskModal({ params }: TaskModalProps) {
  const { projectId, taskId } = await params
  const task = await getTask(projectId, taskId)

  return (
    <RouteModal title={task.title}>
      <TaskDetail projectId={projectId} taskId={taskId} presentation="modal" />
    </RouteModal>
  )
}
