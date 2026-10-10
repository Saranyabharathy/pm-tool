'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/cn'

export function ProjectTabs({ projectId }: { projectId: string }) {
  const pathname = usePathname()
  const base = `/projects/${projectId}`

  const tabs = [
    { href: base, label: 'Board', active: pathname === base },
    { href: `${base}/list`, label: 'List', active: pathname.startsWith(`${base}/list`) },
    { href: `${base}/settings`, label: 'Settings', active: pathname.startsWith(`${base}/settings`) },
  ]

  return (
    <nav className="flex gap-1 border-b border-white/10" aria-label="Project sections">
      {tabs.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          aria-current={tab.active ? 'page' : undefined}
          className={cn(
            '-mb-px border-b-2 px-4 py-2 text-sm font-medium transition',
            tab.active
              ? 'border-blue-500 text-white'
              : 'border-transparent text-slate-400 hover:text-slate-200',
          )}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  )
}
