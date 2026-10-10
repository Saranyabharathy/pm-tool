'use client'

import { AlignLeft, MessageSquare, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useTransition, type ReactNode } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { FormMessage } from '@/components/ui/form-message'
import { Spinner } from '@/components/ui/spinner'
import { Textarea } from '@/components/ui/textarea'
import type { Member } from '@/features/members/queries'
import type { FieldErrors } from '@/lib/action'
import { deleteTask, updateTask } from '../actions'
import type { TaskInput } from '../schemas'
import { TaskPropertyFields, useTaskFields } from './task-form'

type TaskEditorProps = {
  projectId: string
  taskId: string
  initial: TaskInput
  members: Member[]
  // Decides where to go once the task is deleted.
  presentation: 'page' | 'modal'
  // The comment thread, rendered under the description.
  children: ReactNode
}

// The card view: title, description and comments on the left, properties on the right.
export function TaskEditor({ projectId, taskId, initial, members, presentation, children }: TaskEditorProps) {
  const router = useRouter()
  const fields = useTaskFields(initial)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [saving, startSave] = useTransition()
  const [deleting, startDelete] = useTransition()

  // After a save the server sends the new values back as `initial`.
  const dirty = (Object.keys(fields.input) as (keyof TaskInput)[]).some(
    (key) => (fields.input[key] ?? '') !== (initial[key] ?? ''),
  )

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setFieldErrors({})

    startSave(async () => {
      const result = await updateTask(projectId, taskId, fields.input)
      if (result.ok) {
        toast.success('Task saved')
      } else {
        setError(result.fieldErrors ? '' : result.error)
        setFieldErrors(result.fieldErrors ?? {})
      }
    })
  }

  function handleDelete() {
    startDelete(async () => {
      const result = await deleteTask(projectId, taskId)
      if (result.ok) {
        toast.success('Task deleted')
        // The dialog sits on top of the page it was opened from; the full page has nothing behind it.
        if (presentation === 'modal') router.back()
        else router.push(`/projects/${projectId}`)
      } else {
        setConfirmOpen(false)
        toast.error(result.error)
      }
    })
  }

  return (
    <div className="grid gap-6 sm:grid-cols-[minmax(0,1fr)_200px]">
      <div className="min-w-0 space-y-6">
        <form id="task-editor" onSubmit={handleSave} className="space-y-4">
          <div>
            <label htmlFor="task-title" className="sr-only">
              Title
            </label>
            <Textarea
              id="task-title"
              value={fields.title}
              onChange={(e) => fields.setTitle(e.target.value.replace(/\n/g, ''))}
              onKeyDown={(e) => {
                if (e.key === 'Enter') e.preventDefault()
              }}
              rows={1}
              required
              maxLength={200}
              aria-invalid={Boolean(fieldErrors.title)}
              className="min-h-0 resize-none border-transparent bg-transparent px-2 py-1 text-xl font-semibold shadow-none hover:border-input md:text-xl dark:bg-transparent"
            />
            {fieldErrors.title?.map((message) => (
              <p key={message} className="mt-1 px-2 text-xs text-destructive">
                {message}
              </p>
            ))}
          </div>

          <section aria-labelledby="task-description-heading" className="space-y-2">
            <h3 id="task-description-heading" className="flex items-center gap-2 text-sm font-semibold">
              <AlignLeft className="size-4 text-muted-foreground" aria-hidden />
              <label htmlFor="task-description">Description</label>
            </h3>
            <Textarea
              id="task-description"
              value={fields.description}
              onChange={(e) => fields.setDescription(e.target.value)}
              placeholder="Add a more detailed description"
              rows={4}
              maxLength={5000}
              className="bg-card"
            />
            {fieldErrors.description?.map((message) => (
              <p key={message} className="text-xs text-destructive">
                {message}
              </p>
            ))}
          </section>

          <FormMessage>{error}</FormMessage>
        </form>

        <section aria-labelledby="task-comments-heading" className="space-y-3">
          <h3 id="task-comments-heading" className="flex items-center gap-2 text-sm font-semibold">
            <MessageSquare className="size-4 text-muted-foreground" aria-hidden />
            Comments
          </h3>
          {children}
        </section>
      </div>

      <aside className="space-y-4" aria-label="Task properties">
        <TaskPropertyFields fields={fields} members={members} fieldErrors={fieldErrors} />

        <div className="space-y-2 border-t pt-4">
          <Button
            type="submit"
            form="task-editor"
            variant={dirty ? "default" : "outline"}
            className="w-full"
            disabled={saving || !dirty}
          >
            {saving && <Spinner />}
            {dirty ? 'Save changes' : 'Saved'}
          </Button>
          <Button variant="destructive" className="w-full" onClick={() => setConfirmOpen(true)}>
            <Trash2 aria-hidden />
            Delete task
          </Button>
        </div>
      </aside>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete this task?"
        description="Its comments are deleted with it. This cannot be undone."
        confirmLabel="Delete task"
        pending={deleting}
        onConfirm={handleDelete}
      />
    </div>
  )
}
