'use client'

import { useReducedMotion } from 'motion/react'
import Link from 'next/link'
import CountUp from '@/components/reactbits/count-up'
import SpotlightCard from '@/components/reactbits/spotlight-card'
import { Badge } from '@/components/ui/badge'
import { hueBackground } from '@/lib/color'
import { cn } from '@/lib/utils'
import type { ProjectSummary } from '../queries'

type ProjectTileProps = {
  project: Pick<ProjectSummary, 'id' | 'name' | 'description' | 'role' | 'taskCount' | 'openTaskCount'>
  // Position in the grid, used to stagger the entry animation.
  index: number
}

// A number that counts up once on first view. Screen readers and reduced
// motion get the final value straight away.
function Count({ value }: { value: number }) {
  const reduceMotion = useReducedMotion()

  return (
    <span className="font-semibold text-foreground">
      {reduceMotion ? (
        value
      ) : (
        <>
          <span className="sr-only">{value}</span>
          <span aria-hidden>
            <CountUp to={value} duration={0.6} />
          </span>
        </>
      )}
    </span>
  )
}

export function ProjectTile({ project, index }: ProjectTileProps) {
  return (
    <SpotlightCard
      theme="light"
      spotlightColor="var(--primary)"
      spotlightSize={260}
      intensity={0.1}
      borderGlow={0.5}
      flare={false}
      className="h-full rounded-xl animate-in fade-in slide-in-from-bottom-2 fill-mode-both duration-300"
      style={
        {
          '--spotlight-card-surface': 'var(--card)',
          '--spotlight-card-border': 'var(--border)',
          '--spotlight-card-shadow': 'none',
          animationDelay: `${Math.min(index, 8) * 40}ms`,
        } as React.CSSProperties
      }
    >
      <Link
        href={`/projects/${project.id}`}
        className="flex h-full min-h-36 flex-col rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <span className={cn('h-12 shrink-0', hueBackground(project.id))} aria-hidden />
        <span className="flex flex-1 flex-col p-3">
          <span className="flex items-start justify-between gap-2">
            <span className="line-clamp-2 text-sm font-semibold">{project.name}</span>
            {project.role === 'owner' && <Badge tone="blue">Owner</Badge>}
          </span>
          <span className="mt-1 line-clamp-2 flex-1 text-[13px] text-muted-foreground">
            {project.description || 'No description'}
          </span>
          <span className="mt-3 flex items-center gap-3 text-xs text-muted-foreground tabular-nums">
            <span>
              <Count value={project.openTaskCount} /> open
            </span>
            <span>
              <Count value={project.taskCount} /> total
            </span>
          </span>
        </span>
      </Link>
    </SpotlightCard>
  )
}
