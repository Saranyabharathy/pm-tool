'use client'

import {
  closestCorners,
  DndContext,
  DragOverlay,
  KeyboardCode,
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
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useId, useRef, useState, useTransition } from 'react'
import { toast } from 'sonner'
import type { TaskStatus } from '@/db/schema'
import { cn } from '@/lib/utils'
import { moveTask } from '../actions'
import { STATUS_LABELS, TASK_STATUSES } from '../constants'
import { moveItem, type Columns } from '../position'
import type { TaskSummary } from '../queries'
import { CardComposer } from './card-composer'
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

// A drop target is either a card or, for an empty area, the list itself.
function findStatus(columns: Columns<TaskSummary>, id: string) {
  if (isStatus(id)) return id
  return TASK_STATUSES.find((status) => columns[status].some((task) => task.id === id))
}

export function Board({ projectId, tasks, today }: BoardProps) {
  const [columns, setColumns] = useState(() => groupByStatus(tasks))
  const [syncedTasks, setSyncedTasks] = useState(tasks)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [, startTransition] = useTransition()
  const beforeDrag = useRef<Columns<TaskSummary> | null>(null)
  const dndId = useId()

  // Adopt fresh server data, but never in the middle of a drag.
  if (tasks !== syncedTasks && !activeId) {
    setSyncedTasks(tasks)
    setColumns(groupByStatus(tasks))
  }

  const sensors = useSensors(
    // The distance lets a plain click through to open the card.
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    // Space picks up and drops; Enter is left free to open the card.
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
      keyboardCodes: { start: [KeyboardCode.Space], cancel: [KeyboardCode.Esc], end: [KeyboardCode.Space] },
    }),
  )

  function handleDragStart({ active }: DragStartEvent) {
    beforeDrag.current = columns
    setActiveId(String(active.id))
  }

  // Moves the card into another list as soon as it is dragged over it.
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
        toast.error(`The card was moved back. ${result.error}`)
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
    <DndContext
      id={dndId}
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="flex h-full items-start gap-3 p-3 sm:p-4">
        {TASK_STATUSES.map((status) => (
          <BoardList key={status} status={status} tasks={columns[status]} projectId={projectId} today={today} />
        ))}
        {/* Keeps the end padding when the board scrolls sideways. */}
        <div className="w-px shrink-0" aria-hidden />
      </div>
      <DragOverlay>
        {activeTask && activeStatus && (
          <TaskCard
            task={activeTask}
            status={activeStatus}
            today={today}
            className="rotate-3 cursor-grabbing shadow-overlay"
          />
        )}
      </DragOverlay>
    </DndContext>
  )
}

type BoardListProps = {
  status: TaskStatus
  tasks: TaskSummary[]
  projectId: string
  today: string
}

function BoardList({ status, tasks, projectId, today }: BoardListProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status })
  const headingId = useId()

  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        'flex max-h-full w-[272px] shrink-0 flex-col rounded-xl bg-list outline-2 -outline-offset-2 transition-[outline-color]',
        isOver ? 'outline-primary' : 'outline-transparent',
      )}
    >
      <h2 id={headingId} className="flex items-center justify-between px-4 pt-3 pb-2 text-sm font-semibold">
        {STATUS_LABELS[status]}
        <span className="text-xs font-normal text-muted-foreground tabular-nums">
          {tasks.length}
          <span className="sr-only">{tasks.length === 1 ? ' card' : ' cards'}</span>
        </span>
      </h2>
      <SortableContext items={tasks.map((task) => task.id)} strategy={verticalListSortingStrategy}>
        <div ref={setNodeRef} className="scroll-thin flex min-h-2 flex-1 flex-col gap-2 overflow-y-auto px-2 py-0.5">
          {tasks.map((task) => (
            <SortableCard key={task.id} task={task} status={status} projectId={projectId} today={today} />
          ))}
        </div>
      </SortableContext>
      <div className="p-2">
        <CardComposer projectId={projectId} status={status} />
      </div>
    </section>
  )
}

type SortableCardProps = {
  task: TaskSummary
  status: TaskStatus
  projectId: string
  today: string
}

function SortableCard({ task, status, projectId, today }: SortableCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id })
  const router = useRouter()
  const href = `/projects/${projectId}/tasks/${task.id}`

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      {...attributes}
      {...listeners}
      aria-roledescription="draggable card"
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          router.push(href)
          return
        }
        listeners?.onKeyDown?.(event)
      }}
      className={cn(
        'group/card shrink-0 cursor-pointer touch-none rounded-lg outline-none',
        'focus-visible:ring-2 focus-visible:ring-ring',
        // The slot the card was picked up from stays as a placeholder.
        isDragging && 'bg-foreground/10 *:invisible',
      )}
    >
      {/* The wrapper is the keyboard target, so the link stays out of the tab order. */}
      <Link href={href} draggable={false} tabIndex={-1} className="block rounded-lg">
        <TaskCard
          task={task}
          status={status}
          today={today}
          className="ring-ring transition-shadow group-hover/card:ring-2"
        />
      </Link>
    </div>
  )
}
