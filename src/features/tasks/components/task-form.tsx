'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Field, Input, Select, Textarea } from '@/components/ui/field'
import { FormMessage } from '@/components/ui/form-message'
import type { TaskPriority, TaskStatus } from '@/db/schema'
import type { Member } from '@/features/members/queries'
import type { ActionResult, FieldErrors } from '@/lib/action'
import { PRIORITY_LABELS, STATUS_LABELS, TASK_PRIORITIES, TASK_STATUSES } from '../constants'
import type { TaskInput } from '../schemas'

type TaskFormProps = {
  members: Member[]
  initial?: TaskInput
  submitLabel: string
  onSubmit: (input: TaskInput) => Promise<ActionResult<unknown>>
  onSuccess?: () => void
  onCancel?: () => void
}

export function TaskForm({ members, initial, submitLabel, onSubmit, onSuccess, onCancel }: TaskFormProps) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [status, setStatus] = useState<TaskStatus>(initial?.status ?? 'todo')
  const [priority, setPriority] = useState<TaskPriority>(initial?.priority ?? 'medium')
  const [dueDate, setDueDate] = useState(initial?.dueDate ?? '')
  const [assigneeId, setAssigneeId] = useState(initial?.assigneeId ?? '')
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [pending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSaved(false)
    setFieldErrors({})

    startTransition(async () => {
      const result = await onSubmit({
        title,
        description,
        status,
        priority,
        dueDate: dueDate || null,
        assigneeId: assigneeId || null,
      })
      if (result.ok) {
        setSaved(true)
        onSuccess?.()
      } else {
        setError(result.error)
        setFieldErrors(result.fieldErrors ?? {})
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field label="Title" htmlFor="task-title" errors={fieldErrors.title}>
        <Input
          id="task-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          required
          maxLength={200}
        />
      </Field>

      <Field label="Description" htmlFor="task-description" errors={fieldErrors.description}>
        <Textarea
          id="task-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add more detail"
          rows={4}
          maxLength={5000}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Status" htmlFor="task-status" errors={fieldErrors.status}>
          <Select id="task-status" value={status} onChange={(e) => setStatus(e.target.value as TaskStatus)}>
            {TASK_STATUSES.map((value) => (
              <option key={value} value={value}>
                {STATUS_LABELS[value]}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Priority" htmlFor="task-priority" errors={fieldErrors.priority}>
          <Select id="task-priority" value={priority} onChange={(e) => setPriority(e.target.value as TaskPriority)}>
            {TASK_PRIORITIES.map((value) => (
              <option key={value} value={value}>
                {PRIORITY_LABELS[value]}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Due date" htmlFor="task-due-date" errors={fieldErrors.dueDate}>
          <Input
            id="task-due-date"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="scheme-dark"
          />
        </Field>

        <Field label="Assignee" htmlFor="task-assignee" errors={fieldErrors.assigneeId}>
          <Select id="task-assignee" value={assigneeId} onChange={(e) => setAssigneeId(e.target.value)}>
            <option value="">Unassigned</option>
            {members.map((member) => (
              <option key={member.userId} value={member.userId}>
                {member.name}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <FormMessage>{error}</FormMessage>
      {!onSuccess && saved && <FormMessage tone="success">Saved.</FormMessage>}

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button variant="ghost" onClick={onCancel} disabled={pending}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={pending}>
          {pending ? 'Saving...' : submitLabel}
        </Button>
      </div>
    </form>
  )
}
