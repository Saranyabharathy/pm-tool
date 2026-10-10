'use client'

import { LayoutGrid } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CreateProjectButton } from '@/features/projects/components/create-project-button'
import { hueBackground } from '@/lib/color'
import { cn } from '@/lib/utils'

export type ShellProject = { id: string; name: string }

type SidebarNavProps = {
  projects: ShellProject[]
  // Called after a link is followed, so the mobile drawer can close.
  onNavigate?: () => void
}

const itemClass =
  'flex h-8 items-center gap-2.5 rounded-md px-2 text-sm text-sidebar-foreground outline-none transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50'
const activeClass = 'bg-sidebar-accent font-medium text-sidebar-accent-foreground hover:bg-sidebar-accent'

export function SidebarNav({ projects, onNavigate }: SidebarNavProps) {
  const pathname = usePathname()

  return (
    <nav aria-label="Main" className="flex h-full flex-col gap-4 p-3">
      <Link
        href="/projects"
        onClick={onNavigate}
        aria-current={pathname === '/projects' ? 'page' : undefined}
        className={cn(itemClass, pathname === '/projects' && activeClass)}
      >
        <LayoutGrid className="size-4" aria-hidden />
        All projects
      </Link>

      <div className="flex min-h-0 flex-1 flex-col">
        <p className="px-2 pb-1.5 text-xs font-medium text-muted-foreground">Your projects</p>
        <ul className="scroll-thin -mx-1 min-h-0 flex-1 space-y-0.5 overflow-y-auto px-1">
          {projects.map((project) => {
            const href = `/projects/${project.id}`
            const active = pathname === href || pathname.startsWith(`${href}/`)
            return (
              <li key={project.id}>
                <Link
                  href={href}
                  onClick={onNavigate}
                  aria-current={active ? 'page' : undefined}
                  className={cn(itemClass, active && activeClass)}
                >
                  <span className={cn('size-4 shrink-0 rounded-sm', hueBackground(project.id))} aria-hidden />
                  <span className="truncate">{project.name}</span>
                </Link>
              </li>
            )
          })}
          {projects.length === 0 && <li className="px-2 py-1 text-[13px] text-muted-foreground">None yet</li>}
        </ul>
      </div>

      <CreateProjectButton trigger="sidebar" />
    </nav>
  )
}
