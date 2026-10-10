'use client'

import { List, Settings, SquareKanban } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

export function ProjectTabs({ projectId }: { projectId: string }) {
  const pathname = usePathname()
  const base = `/projects/${projectId}`

  const tabs = [
    // A card opened on its own page still belongs to the board.
    { href: base, label: 'Board', icon: SquareKanban, active: pathname === base || pathname.startsWith(`${base}/tasks`) },
    { href: `${base}/list`, label: 'List', icon: List, active: pathname.startsWith(`${base}/list`) },
    { href: `${base}/settings`, label: 'Settings', icon: Settings, active: pathname.startsWith(`${base}/settings`) },
  ]

  return (
    <nav className="flex gap-1" aria-label="Project sections">
      {tabs.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          aria-current={tab.active ? 'page' : undefined}
          className={cn(
            '-mb-px flex h-9 items-center gap-1.5 border-b-2 px-2.5 text-[13px] font-medium outline-none transition-colors focus-visible:bg-muted',
            tab.active
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground',
          )}
        >
          <tab.icon className="size-4" aria-hidden />
          {tab.label}
        </Link>
      ))}
    </nav>
  )
}
