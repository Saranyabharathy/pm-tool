import type { Metadata } from 'next'
import { MemberList } from '@/features/members/components/member-list'
import { listMembers } from '@/features/members/queries'
import { DeleteProjectButton, ProjectSettings } from '@/features/projects/components/project-settings'
import { getProject } from '@/features/projects/queries'

export const metadata: Metadata = { title: 'Project settings' }

type SettingsPageProps = {
  params: Promise<{ projectId: string }>
}

export default async function SettingsPage({ params }: SettingsPageProps) {
  const { projectId } = await params
  const [{ project, role }, members] = await Promise.all([getProject(projectId), listMembers(projectId)])
  const isOwner = role === 'owner'

  return (
    <div className="max-w-2xl space-y-6">
      <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="mb-1 text-lg font-semibold text-white">Details</h2>
        {!isOwner && <p className="mb-4 text-sm text-slate-400">Only the project owner can change these.</p>}
        <div className="mt-4">
          <ProjectSettings
            projectId={project.id}
            initial={{ name: project.name, description: project.description }}
            canEdit={isOwner}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="mb-4 text-lg font-semibold text-white">Members</h2>
        <MemberList projectId={project.id} members={members} canManage={isOwner} />
      </section>

      {isOwner && (
        <section className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-6">
          <h2 className="mb-1 text-lg font-semibold text-white">Delete project</h2>
          <p className="mb-4 text-sm text-slate-400">
            Permanently removes the project with all of its tasks and comments.
          </p>
          <DeleteProjectButton projectId={project.id} projectName={project.name} />
        </section>
      )}
    </div>
  )
}
