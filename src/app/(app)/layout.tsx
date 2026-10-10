import { AppShell } from '@/components/shell/app-shell'
import { listProjects } from '@/features/projects/queries'
import { requireUser } from '@/lib/session'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const [user, projects] = await Promise.all([requireUser(), listProjects()])

  return (
    <AppShell
      user={{ id: user.id, name: user.name, email: user.email }}
      projects={projects.map((project) => ({ id: project.id, name: project.name }))}
    >
      {children}
    </AppShell>
  )
}
