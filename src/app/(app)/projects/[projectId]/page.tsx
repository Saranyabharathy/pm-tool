import { listMembers } from '@/features/members/queries'
import { Board } from '@/features/tasks/components/board'
import { CreateTaskButton } from '@/features/tasks/components/create-task-button'
import { listTasks } from '@/features/tasks/queries'
import { todayIso } from '@/lib/format'

type BoardPageProps = {
  params: Promise<{ projectId: string }>
}

export default async function BoardPage({ params }: BoardPageProps) {
  const { projectId } = await params
  const [tasks, members] = await Promise.all([listTasks(projectId), listMembers(projectId)])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-slate-400">Drag cards to reorder them or change their status.</p>
        <CreateTaskButton projectId={projectId} members={members} />
      </div>
      <Board projectId={projectId} tasks={tasks} today={todayIso()} />
    </div>
  )
}
