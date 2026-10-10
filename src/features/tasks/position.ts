import type { TaskStatus } from '@/db/schema'

export type Columns<T> = Record<TaskStatus, T[]>

// Moves one item to `index` of the `status` column and returns new columns.
// Used by the board for the optimistic update and by the server to persist,
// so both always agree on the resulting order.
export function moveItem<T extends { id: string }>(
  columns: Columns<T>,
  id: string,
  status: TaskStatus,
  index: number,
): Columns<T> {
  let moved: T | undefined
  const next = {} as Columns<T>

  for (const key of Object.keys(columns) as TaskStatus[]) {
    next[key] = columns[key].filter((item) => {
      if (item.id !== id) return true
      moved = item
      return false
    })
  }
  if (!moved) return columns

  const target = next[status]
  const clamped = Math.max(0, Math.min(index, target.length))
  next[status] = [...target.slice(0, clamped), moved, ...target.slice(clamped)]
  return next
}
