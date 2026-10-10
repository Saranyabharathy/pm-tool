import { FolderKanban } from 'lucide-react'
import type { Metadata } from 'next'
import { PageContainer } from '@/components/shell/page-container'
import { EmptyState } from '@/components/ui/empty-state'
import { CreateProjectButton } from '@/features/projects/components/create-project-button'
import { ProjectTile } from '@/features/projects/components/project-tile'
import { listProjects } from '@/features/projects/queries'

export const metadata: Metadata = { title: 'Projects' }

export default async function ProjectsPage() {
  const projects = await listProjects()

  return (
    <PageContainer className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">Projects</h1>
          <p className="mt-0.5 text-[13px] text-muted-foreground">
            {projects.length === 0
              ? 'Projects you own or are a member of appear here.'
              : `${projects.length} ${projects.length === 1 ? 'project' : 'projects'} you own or are a member of`}
          </p>
        </div>
        {projects.length > 0 && <CreateProjectButton />}
      </div>

      {projects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="No projects yet"
          description="Create your first project to get a board, add tasks and invite your team."
          action={<CreateProjectButton />}
        />
      ) : (
        <ul className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
          {projects.map((project, index) => (
            <li key={project.id}>
              <ProjectTile
                index={index}
                project={{
                  id: project.id,
                  name: project.name,
                  description: project.description,
                  role: project.role,
                  taskCount: project.taskCount,
                  openTaskCount: project.openTaskCount,
                }}
              />
            </li>
          ))}
          <li>
            <CreateProjectButton trigger="tile" />
          </li>
        </ul>
      )}
    </PageContainer>
  )
}
