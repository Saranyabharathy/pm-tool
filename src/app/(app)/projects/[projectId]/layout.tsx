import { UserAvatar } from '@/components/ui/user-avatar'
import { listMembers } from '@/features/members/queries'
import { ProjectTabs } from '@/features/projects/components/project-tabs'
import { getProject } from '@/features/projects/queries'
import { CreateTaskButton } from '@/features/tasks/components/create-task-button'
import { RefreshOnCardClose } from '@/features/tasks/components/refresh-on-card-close'
import { hueBackground } from '@/lib/color'
import { cn } from '@/lib/utils'

type ProjectLayoutProps = {
  children: React.ReactNode
  modal: React.ReactNode
  params: Promise<{ projectId: string }>
}

const MAX_AVATARS = 5

export default async function ProjectLayout({ children, modal, params }: ProjectLayoutProps) {
  const { projectId } = await params
  const [{ project }, members] = await Promise.all([getProject(projectId), listMembers(projectId)])
  const hiddenMembers = members.length - MAX_AVATARS

  return (
    <div className="flex h-full flex-col">
      <header className="shrink-0 border-b bg-card px-4 pt-3 sm:px-6">
        <div className="flex items-center gap-3">
          <span className={cn('size-6 shrink-0 rounded-md', hueBackground(project.id))} aria-hidden />
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-base font-semibold">{project.name}</h1>
          </div>
          <ul className="hidden items-center gap-1 sm:flex" aria-label="Project members">
            {members.slice(0, MAX_AVATARS).map((member) => (
              <li key={member.userId} className="flex">
                <UserAvatar id={member.userId} name={member.name} size="md" />
              </li>
            ))}
            {hiddenMembers > 0 && (
              <li className="flex size-6 items-center justify-center rounded-full bg-muted text-[11px] font-medium">
                +{hiddenMembers}
                <span className="sr-only"> more</span>
              </li>
            )}
          </ul>
          <CreateTaskButton projectId={project.id} members={members} />
        </div>
        <div className="mt-2">
          <ProjectTabs projectId={project.id} />
        </div>
      </header>
      <div className="min-h-0 flex-1 overflow-auto">{children}</div>
      {modal}
      <RefreshOnCardClose />
    </div>
  )
}
