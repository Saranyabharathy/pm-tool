import { ListChecks, SearchX } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { PageContainer } from '@/components/shell/page-container'
import { EmptyState } from '@/components/ui/empty-state'
import { UserAvatar } from '@/components/ui/user-avatar'
import { listMembers } from '@/features/members/queries'
import { DueChip, PriorityBadge, StatusBadge } from '@/features/tasks/components/task-badges'
import { TaskFilters } from '@/features/tasks/components/task-filters'
import { TASK_STATUSES } from '@/features/tasks/constants'
import { listTasks, UNASSIGNED } from '@/features/tasks/queries'
import { todayIso } from '@/lib/format'

export const metadata: Metadata = { title: 'List' }

type ListPageProps = {
  params: Promise<{ projectId: string }>
  searchParams: Promise<{ status?: string; assignee?: string }>
}

const headClass = 'sticky top-0 z-10 bg-card px-4 py-2.5 text-left text-xs font-medium text-muted-foreground'

export default async function ListPage({ params, searchParams }: ListPageProps) {
  const { projectId } = await params
  const filters = await searchParams
  const status = TASK_STATUSES.find((value) => value === filters.status)
  const members = await listMembers(projectId)
  // Ignore assignee values that are not members, rather than showing an empty list.
  const assigneeId =
    filters.assignee === UNASSIGNED || members.some((member) => member.userId === filters.assignee)
      ? filters.assignee
      : undefined

  const tasks = await listTasks(projectId, { status, assigneeId })
  const today = todayIso()
  const filtered = Boolean(status || assigneeId)

  return (
    <PageContainer className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <TaskFilters
          members={members}
          status={status ?? ''}
          assignee={assigneeId ?? ''}
          unassignedValue={UNASSIGNED}
        />
        <p className="text-[13px] text-muted-foreground tabular-nums" aria-live="polite">
          {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
        </p>
      </div>

      {tasks.length === 0 ? (
        filtered ? (
          <EmptyState
            icon={SearchX}
            title="No tasks match these filters"
            description="Try a different status or assignee, or clear the filters."
          />
        ) : (
          <EmptyState
            icon={ListChecks}
            title="No tasks yet"
            description='Use "New task" above to add the first one to this project.'
          />
        )
      ) : (
        <div className="overflow-x-auto rounded-xl border bg-card">
          {/* The minimum width keeps titles readable on phones; the table scrolls sideways instead. */}
          <table className="w-full min-w-[640px] border-collapse text-[13px]">
            <thead>
              <tr className="border-b">
                <th scope="col" className={headClass}>
                  Task
                </th>
                <th scope="col" className={headClass}>
                  Status
                </th>
                <th scope="col" className={headClass}>
                  Priority
                </th>
                <th scope="col" className={headClass}>
                  Assignee
                </th>
                <th scope="col" className={headClass}>
                  Due
                </th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                // The title link is stretched over the row, so the whole row is clickable.
                <tr key={task.id} className="relative border-b transition-colors last:border-b-0 hover:bg-muted">
                  <td className="h-10 max-w-0 w-full px-4">
                    <Link
                      href={`/projects/${projectId}/tasks/${task.id}`}
                      className="block truncate text-sm font-medium outline-none after:absolute after:inset-0 focus-visible:after:ring-2 focus-visible:after:ring-ring focus-visible:after:ring-inset"
                    >
                      {task.title}
                    </Link>
                  </td>
                  <td className="px-4 whitespace-nowrap">
                    <StatusBadge status={task.status} />
                  </td>
                  <td className="px-4 whitespace-nowrap">
                    <PriorityBadge priority={task.priority} />
                  </td>
                  <td className="px-4 whitespace-nowrap">
                    {task.assigneeId && task.assigneeName ? (
                      <span className="flex items-center gap-2">
                        <UserAvatar id={task.assigneeId} name={task.assigneeName} size="md" />
                        {task.assigneeName}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">Unassigned</span>
                    )}
                  </td>
                  <td className="px-4 whitespace-nowrap">
                    {task.dueDate ? (
                      <DueChip dueDate={task.dueDate} status={task.status} today={today} />
                    ) : (
                      <span className="text-muted-foreground">No date</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </PageContainer>
  )
}
