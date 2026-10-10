import type { Metadata } from 'next'
import { getProject } from '@/features/projects/queries'
import { Board } from '@/features/tasks/components/board'
import { listTasks } from '@/features/tasks/queries'
import { hueVariable } from '@/lib/color'
import { todayIso } from '@/lib/format'

type BoardPageProps = {
  params: Promise<{ projectId: string }>
}

export async function generateMetadata({ params }: BoardPageProps): Promise<Metadata> {
  const { projectId } = await params
  const { project } = await getProject(projectId)
  return { title: project.name }
}

export default async function BoardPage({ params }: BoardPageProps) {
  const { projectId } = await params
  const tasks = await listTasks(projectId)

  return (
    // The backdrop is the project hue; --board-tint softens it in dark theme.
    // "relative" keeps visually hidden text inside the cards from widening the page.
    <div
      className="scroll-thin relative h-full overflow-x-auto"
      style={{ background: `color-mix(in oklab, ${hueVariable(projectId)} var(--board-tint), var(--background))` }}
    >
      <Board projectId={projectId} tasks={tasks} today={todayIso()} />
    </div>
  )
}
