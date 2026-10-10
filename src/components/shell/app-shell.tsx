'use client'

import { ChevronRight, PanelLeft } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, type ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { Logo } from './logo'
import { SidebarNav, type ShellProject } from './sidebar-nav'
import { ThemeToggle } from './theme-toggle'
import { UserMenu, type ShellUser } from './user-menu'

type AppShellProps = {
  user: ShellUser
  projects: ShellProject[]
  children: ReactNode
}

export function AppShell({ user, projects, children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const pathname = usePathname()

  const currentProject = projects.find(
    (project) => pathname === `/projects/${project.id}` || pathname.startsWith(`/projects/${project.id}/`),
  )

  return (
    <div className="flex h-dvh flex-col">
      <header className="flex h-12 shrink-0 items-center gap-2 border-b bg-sidebar px-3">
        {/* One button, two behaviours: drawer on small screens, collapse on large. */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Open navigation"
          onClick={() => setDrawerOpen(true)}
        >
          <PanelLeft aria-hidden />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="hidden md:inline-flex"
          aria-label={sidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
          aria-expanded={sidebarOpen}
          onClick={() => setSidebarOpen((open) => !open)}
        >
          <PanelLeft aria-hidden />
        </Button>

        <Link href="/projects" className="rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
          <Logo />
        </Link>

        {currentProject && (
          <nav aria-label="Breadcrumb" className="hidden min-w-0 items-center gap-1 text-[13px] sm:flex">
            <ChevronRight className="size-4 shrink-0 text-muted-foreground" aria-hidden />
            <Link href="/projects" className="text-muted-foreground hover:text-foreground">
              Projects
            </Link>
            <ChevronRight className="size-4 shrink-0 text-muted-foreground" aria-hidden />
            <span className="truncate font-medium" aria-current="page">
              {currentProject.name}
            </span>
          </nav>
        )}

        <div className="ml-auto flex items-center gap-1.5">
          <ThemeToggle />
          <UserMenu user={user} />
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <aside
          className={cn('hidden w-60 shrink-0 border-r bg-sidebar', sidebarOpen && 'md:block')}
          aria-label="Sidebar"
        >
          <SidebarNav projects={projects} />
        </aside>
        <main className="relative min-w-0 flex-1 overflow-y-auto">{children}</main>
      </div>

      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent side="left" className="w-72 gap-0 bg-sidebar p-0">
          <SheetHeader className="flex h-12 justify-center border-b px-4">
            <SheetTitle>
              <Logo />
            </SheetTitle>
            <SheetDescription className="sr-only">Navigate between your projects.</SheetDescription>
          </SheetHeader>
          <SidebarNav projects={projects} onNavigate={() => setDrawerOpen(false)} />
        </SheetContent>
      </Sheet>
    </div>
  )
}
