import Link from 'next/link'
import { buttonClass } from '@/components/ui/button'
import { Select } from '@/components/ui/field'
import type { TaskStatus } from '@/db/schema'
import { listMembers } from '@/features/members/queries'
import { CreateTaskButton } from '@/features/tasks/components/create-task-button'
import { DueDate, PriorityBadge, StatusBadge } from '@/features/tasks/components/task-badges'
import { STATUS_LABELS, TASK_STATUSES } from '@/features/tasks/constants'
import { listTasks, UNASSIGNED } from '@/features/tasks/queries'
import { todayIso } from '@/lib/format'

type ListPageProps = {
  params: Promise<{ projectId: string }>
  searchParams: Promise<{ status?: string; assignee?: string }>
}

export default async function ListPage({ params, searchParams }: ListPageProps) {
  const { projectId } = await params
  const filters = await searchParams
  const status = TASK_STATUSES.find((value) => value === filters.status) as TaskStatus | undefined
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
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <form className="flex flex-wrap items-end gap-3">
          <label className="text-xs font-medium text-slate-300">
            Status
            <Select name="status" defaultValue={status ?? ''} className="mt-1 py-2">
              <option value="">All</option>
              {TASK_STATUSES.map((value) => (
                <option key={value} value={value}>
                  {STATUS_LABELS[value]}
                </option>
              ))}
            </Select>
          </label>
          <label className="text-xs font-medium text-slate-300">
            Assignee
            <Select name="assignee" defaultValue={assigneeId ?? ''} className="mt-1 py-2">
              <option value="">Anyone</option>
              <option value={UNASSIGNED}>Unassigned</option>
              {members.map((member) => (
                <option key={member.userId} value={member.userId}>
                  {member.name}
                </option>
              ))}
            </Select>
          </label>
          <button type="submit" className={buttonClass('secondary')}>
            Apply
          </button>
          {filtered && (
            <Link href={`/projects/${projectId}/list`} className={buttonClass('ghost')}>
              Clear
            </Link>
          )}
        </form>
        <CreateTaskButton projectId={projectId} members={members} />
      </div>

      {tasks.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 p-12 text-center text-sm text-slate-400">
          {filtered ? 'No tasks match these filters.' : 'No tasks yet. Create the first one.'}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-4 py-3 font-medium">Task</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Priority</th>
                <th className="px-4 py-3 font-medium">Assignee</th>
                <th className="px-4 py-3 font-medium">Due</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {tasks.map((task) => (
                <tr key={task.id} className="hover:bg-white/5">
                  <td className="px-4 py-3">
                    <Link
                      href={`/projects/${projectId}/tasks/${task.id}`}
                      className="font-medium text-slate-100 wrap-anywhere hover:text-blue-300"
                    >
                      {task.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <StatusBadge status={task.status} />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <PriorityBadge priority={task.priority} />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-slate-300">{task.assigneeName ?? 'Unassigned'}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {task.dueDate ? (
                      <DueDate dueDate={task.dueDate} status={task.status} today={today} />
                    ) : (
                      <span className="text-xs text-slate-500">None</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
