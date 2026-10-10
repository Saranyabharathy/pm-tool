import type { Metadata } from 'next'
import { PageContainer } from '@/components/shell/page-container'
import { MemberList } from '@/features/members/components/member-list'
import { listMembers } from '@/features/members/queries'
import { DeleteProjectButton, ProjectSettings } from '@/features/projects/components/project-settings'
import { getProject } from '@/features/projects/queries'

export const metadata: Metadata = { title: 'Settings' }

type SettingsPageProps = {
  params: Promise<{ projectId: string }>
}

function Section({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border bg-card p-5">
      <h2 className="text-base font-semibold">{title}</h2>
      <p className="mt-0.5 mb-4 text-[13px] text-muted-foreground">{description}</p>
      {children}
    </section>
  )
}

export default async function SettingsPage({ params }: SettingsPageProps) {
  const { projectId } = await params
  const [{ project, role }, members] = await Promise.all([getProject(projectId), listMembers(projectId)])
  const isOwner = role === 'owner'

  return (
    <PageContainer className="max-w-[672px] space-y-6">
      <Section
        title="Details"
        description={
          isOwner ? 'The name and description everyone in the project sees.' : 'Only the project owner can change these.'
        }
      >
        <ProjectSettings
          projectId={project.id}
          initial={{ name: project.name, description: project.description }}
          canEdit={isOwner}
        />
      </Section>

      <Section
        title="Members"
        description={`${members.length} ${members.length === 1 ? 'person has' : 'people have'} access to this project.`}
      >
        <MemberList projectId={project.id} members={members} canManage={isOwner} />
      </Section>

      {isOwner && (
        <section className="rounded-xl border border-destructive/40 bg-card p-5">
          <h2 className="text-base font-semibold">Delete project</h2>
          <p className="mt-0.5 mb-4 text-[13px] text-muted-foreground">
            Permanently removes the project with all of its tasks and comments.
          </p>
          <DeleteProjectButton projectId={project.id} projectName={project.name} />
        </section>
      )}
    </PageContainer>
  )
}
