'use client'

import {
  closestCorners,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useId, useRef, useState, useTransition } from 'react'
import { FormMessage } from '@/components/ui/form-message'
import type { TaskStatus } from '@/db/schema'
import { cn } from '@/lib/cn'
import { moveTask } from '../actions'
import { STATUS_LABELS, TASK_STATUSES } from '../constants'
import { moveItem, type Columns } from '../position'
import type { TaskSummary } from '../queries'
import { TaskCard } from './task-card'

type BoardProps = {
  projectId: string
  tasks: TaskSummary[]
  today: string
}

function groupByStatus(tasks: TaskSummary[]): Columns<TaskSummary> {
  const columns: Columns<TaskSummary> = { todo: [], in_progress: [], done: [] }
  for (const task of tasks) columns[task.status].push(task)
  return columns
}

function isStatus(id: string): id is TaskStatus {
  return (TASK_STATUSES as readonly string[]).includes(id)
}

// A drop target is either a card or, for an empty area, the column itself.
function findStatus(columns: Columns<TaskSummary>, id: string) {
  if (isStatus(id)) return id
  return TASK_STATUSES.find((status) => columns[status].some((task) => task.id === id))
}

export function Board({ projectId, tasks, today }: BoardProps) {
  const [columns, setColumns] = useState(() => groupByStatus(tasks))
  const [syncedTasks, setSyncedTasks] = useState(tasks)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [, startTransition] = useTransition()
  const beforeDrag = useRef<Columns<TaskSummary> | null>(null)
  const dndId = useId()

  // Adopt fresh server data, but never in the middle of a drag.
  if (tasks !== syncedTasks && !activeId) {
    setSyncedTasks(tasks)
    setColumns(groupByStatus(tasks))
  }

  const sensors = useSensors(
    // The distance lets a plain click through to the card's link.
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  function handleDragStart({ active }: DragStartEvent) {
    beforeDrag.current = columns
    setActiveId(String(active.id))
    setError('')
  }

  // Moves the card into another column as soon as it is dragged over it.
  function handleDragOver({ active, over }: DragOverEvent) {
    if (!over) return
    const taskId = String(active.id)
    const overId = String(over.id)

    setColumns((current) => {
      const from = findStatus(current, taskId)
      const to = findStatus(current, overId)
      if (!from || !to || from === to) return current

      const overIndex = isStatus(overId) ? current[to].length : current[to].findIndex((task) => task.id === overId)
      return moveItem(current, taskId, to, overIndex)
    })
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    const original = beforeDrag.current
    beforeDrag.current = null
    setActiveId(null)
    if (!original) return
    if (!over) {
      setColumns(original)
      return
    }

    const taskId = String(active.id)
    const overId = String(over.id)
    const status = findStatus(columns, taskId)
    if (!status) return

    const currentIndex = columns[status].findIndex((task) => task.id === taskId)
    const overIndex = isStatus(overId) ? currentIndex : columns[status].findIndex((task) => task.id === overId)
    const index = overIndex === -1 ? currentIndex : overIndex
    const next = moveItem(columns, taskId, status, index)

    const originalStatus = findStatus(original, taskId)
    const originalIndex = originalStatus ? original[originalStatus].findIndex((task) => task.id === taskId) : -1
    if (originalStatus === status && originalIndex === index) {
      setColumns(original)
      return
    }

    setColumns(next)
    startTransition(async () => {
      const result = await moveTask(projectId, { taskId, status, index })
      if (!result.ok) {
        setColumns(original)
        setError(result.error)
      }
    })
  }

  function handleDragCancel() {
    if (beforeDrag.current) setColumns(beforeDrag.current)
    beforeDrag.current = null
    setActiveId(null)
  }

  const activeStatus = activeId ? findStatus(columns, activeId) : undefined
  const activeTask = activeStatus ? columns[activeStatus].find((task) => task.id === activeId) : undefined

  return (
    <div className="space-y-3">
      <FormMessage>{error}</FormMessage>
      <DndContext
        id={dndId}
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div className="grid gap-4 md:grid-cols-3">
          {TASK_STATUSES.map((status) => (
            <BoardColumn key={status} status={status} tasks={columns[status]} projectId={projectId} today={today} />
          ))}
        </div>
        <DragOverlay>
          {activeTask && activeStatus && (
            <div className="rotate-2 cursor-grabbing">
              <TaskCard projectId={projectId} task={activeTask} status={activeStatus} today={today} />
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  )
}

type BoardColumnProps = {
  status: TaskStatus
  tasks: TaskSummary[]
  projectId: string
  today: string
}

function BoardColumn({ status, tasks, projectId, today }: BoardColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status })

  return (
    <section
      aria-label={STATUS_LABELS[status]}
      className={cn(
        'flex flex-col rounded-2xl border bg-white/5 p-3 transition',
        isOver ? 'border-blue-500/40' : 'border-white/10',
      )}
    >
      <h2 className="mb-3 flex items-center justify-between px-1 text-sm font-semibold text-slate-200">
        {STATUS_LABELS[status]}
        <span className="text-xs font-normal text-slate-500">{tasks.length}</span>
      </h2>
      <SortableContext items={tasks.map((task) => task.id)} strategy={verticalListSortingStrategy}>
        <div ref={setNodeRef} className="flex min-h-24 flex-1 flex-col gap-2">
          {tasks.map((task) => (
            <SortableTaskCard key={task.id} task={task} status={status} projectId={projectId} today={today} />
          ))}
          {tasks.length === 0 && <p className="px-1 py-6 text-center text-xs text-slate-500">No tasks</p>}
        </div>
      </SortableContext>
    </section>
  )
}

type SortableTaskCardProps = {
  task: TaskSummary
  status: TaskStatus
  projectId: string
  today: string
}

function SortableTaskCard({ task, status, projectId, today }: SortableTaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id })

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn('cursor-grab touch-none rounded-xl', isDragging && 'opacity-40')}
      {...attributes}
      {...listeners}
    >
      <TaskCard projectId={projectId} task={task} status={status} today={today} />
    </div>
  )
}
