import type { Metadata } from 'next'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { CreateProjectButton } from '@/features/projects/components/create-project-button'
import { listProjects } from '@/features/projects/queries'

export const metadata: Metadata = { title: 'Projects' }

export default async function ProjectsPage() {
  const projects = await listProjects()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-white">Projects</h1>
        <CreateProjectButton />
      </div>

      {projects.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 p-12 text-center">
          <p className="text-slate-300">You have no projects yet.</p>
          <p className="mt-1 text-sm text-slate-500">Create one to start adding tasks.</p>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <li key={project.id}>
              <Link
                href={`/projects/${project.id}`}
                className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-blue-500/40 hover:bg-white/10"
              >
                <div className="flex items-start justify-between gap-3">
                  <h2 className="font-semibold text-white wrap-anywhere">{project.name}</h2>
                  {project.role === 'owner' && <Badge tone="blue">Owner</Badge>}
                </div>
                <p className="mt-2 line-clamp-2 flex-1 text-sm text-slate-400">
                  {project.description || 'No description.'}
                </p>
                <p className="mt-4 text-xs text-slate-500">
                  {project.openTaskCount} open · {project.taskCount} total
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
