'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Field, Select } from '@/components/ui/field'
import { FormMessage } from '@/components/ui/form-message'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { Textarea } from '@/components/ui/textarea'
import type { TaskPriority, TaskStatus } from '@/db/schema'
import type { Member } from '@/features/members/queries'
import type { ActionResult, FieldErrors } from '@/lib/action'
import { PRIORITY_LABELS, STATUS_LABELS, TASK_PRIORITIES, TASK_STATUSES } from '../constants'
import type { TaskInput } from '../schemas'

// Form state shared by the create dialog and the card editor.
export function useTaskFields(initial?: TaskInput) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [status, setStatus] = useState<TaskStatus>(initial?.status ?? 'todo')
  const [priority, setPriority] = useState<TaskPriority>(initial?.priority ?? 'medium')
  const [dueDate, setDueDate] = useState(initial?.dueDate ?? '')
  const [assigneeId, setAssigneeId] = useState(initial?.assigneeId ?? '')

  const input: TaskInput = {
    title,
    description,
    status,
    priority,
    dueDate: dueDate || null,
    assigneeId: assigneeId || null,
  }

  return {
    input,
    title,
    setTitle,
    description,
    setDescription,
    status,
    setStatus,
    priority,
    setPriority,
    dueDate,
    setDueDate,
    assigneeId,
    setAssigneeId,
  }
}

type TaskFields = ReturnType<typeof useTaskFields>

type TaskPropertyFieldsProps = {
  fields: TaskFields
  members: Member[]
  fieldErrors: FieldErrors
}

// Status, priority, due date and assignee.
export function TaskPropertyFields({ fields, members, fieldErrors }: TaskPropertyFieldsProps) {
  return (
    <>
      <Field label="Status" htmlFor="task-status" errors={fieldErrors.status}>
        <Select id="task-status" value={fields.status} onChange={(e) => fields.setStatus(e.target.value as TaskStatus)}>
          {TASK_STATUSES.map((value) => (
            <option key={value} value={value}>
              {STATUS_LABELS[value]}
            </option>
          ))}
        </Select>
      </Field>

      <Field label="Priority" htmlFor="task-priority" errors={fieldErrors.priority}>
        <Select
          id="task-priority"
          value={fields.priority}
          onChange={(e) => fields.setPriority(e.target.value as TaskPriority)}
        >
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
          value={fields.dueDate}
          onChange={(e) => fields.setDueDate(e.target.value)}
          className="bg-card"
        />
      </Field>

      <Field label="Assignee" htmlFor="task-assignee" errors={fieldErrors.assigneeId}>
        <Select id="task-assignee" value={fields.assigneeId} onChange={(e) => fields.setAssigneeId(e.target.value)}>
          <option value="">Unassigned</option>
          {members.map((member) => (
            <option key={member.userId} value={member.userId}>
              {member.name}
            </option>
          ))}
        </Select>
      </Field>
    </>
  )
}

type TaskFormProps = {
  members: Member[]
  submitLabel: string
  successMessage: string
  onSubmit: (input: TaskInput) => Promise<ActionResult<unknown>>
  onSuccess?: () => void
  onCancel?: () => void
}

// The full form, used to create a task.
export function TaskForm({ members, submitLabel, successMessage, onSubmit, onSuccess, onCancel }: TaskFormProps) {
  const fields = useTaskFields()
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [pending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setFieldErrors({})

    startTransition(async () => {
      const result = await onSubmit(fields.input)
      if (result.ok) {
        toast.success(successMessage)
        onSuccess?.()
      } else {
        setError(result.fieldErrors ? '' : result.error)
        setFieldErrors(result.fieldErrors ?? {})
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field label="Title" htmlFor="task-title" errors={fieldErrors.title}>
        <Input
          id="task-title"
          value={fields.title}
          onChange={(e) => fields.setTitle(e.target.value)}
          placeholder="What needs to be done?"
          required
          maxLength={200}
          autoFocus
          aria-invalid={Boolean(fieldErrors.title)}
        />
      </Field>

      <Field label="Description" htmlFor="task-description" errors={fieldErrors.description}>
        <Textarea
          id="task-description"
          value={fields.description}
          onChange={(e) => fields.setDescription(e.target.value)}
          placeholder="Add more detail"
          rows={3}
          maxLength={5000}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <TaskPropertyFields fields={fields} members={members} fieldErrors={fieldErrors} />
      </div>

      <FormMessage>{error}</FormMessage>

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button variant="ghost" onClick={onCancel} disabled={pending}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={pending}>
          {pending && <Spinner />}
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}
