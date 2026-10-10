import { ProjectTabs } from '@/features/projects/components/project-tabs'
import { getProject } from '@/features/projects/queries'

type ProjectLayoutProps = {
  children: React.ReactNode
  params: Promise<{ projectId: string }>
}

export default async function ProjectLayout({ children, params }: ProjectLayoutProps) {
  const { projectId } = await params
  const { project } = await getProject(projectId)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white wrap-anywhere">{project.name}</h1>
        {project.description && <p className="mt-1 text-sm text-slate-400">{project.description}</p>}
      </div>
      <ProjectTabs projectId={project.id} />
      {children}
    </div>
  )
}
