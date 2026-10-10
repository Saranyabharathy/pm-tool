import { ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { PageContainer } from '@/components/shell/page-container'
import { TaskDetail } from '@/features/tasks/components/task-detail'
import { getTask } from '@/features/tasks/queries'

type TaskPageProps = {
  params: Promise<{ projectId: string; taskId: string }>
}

export async function generateMetadata({ params }: TaskPageProps): Promise<Metadata> {
  const { projectId, taskId } = await params
  const task = await getTask(projectId, taskId)
  return { title: task.title }
}

// The task on its own page: reached by opening a card link directly or
// reloading while the card dialog is open.
export default async function TaskPage({ params }: TaskPageProps) {
  const { projectId, taskId } = await params

  return (
    <PageContainer className="max-w-3xl space-y-4">
      <Link
        href={`/projects/${projectId}`}
        className="inline-flex items-center gap-1.5 rounded-md text-[13px] text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Back to board
      </Link>
      <TaskDetail projectId={projectId} taskId={taskId} presentation="page" />
    </PageContainer>
  )
}
