'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { FormMessage } from '@/components/ui/form-message'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { Textarea } from '@/components/ui/textarea'
import type { ActionResult, FieldErrors } from '@/lib/action'
import type { ProjectInput } from '../schemas'

type ProjectFormProps = {
  initial?: ProjectInput
  submitLabel: string
  // Shown as a toast when the action succeeds.
  successMessage: string
  disabled?: boolean
  onSubmit: (input: ProjectInput) => Promise<ActionResult<unknown>>
  onCancel?: () => void
}

export function ProjectForm({ initial, submitLabel, successMessage, disabled, onSubmit, onCancel }: ProjectFormProps) {
  const [name, setName] = useState(initial?.name ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [pending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setFieldErrors({})

    startTransition(async () => {
      const result = await onSubmit({ name, description })
      if (result.ok) {
        toast.success(successMessage)
      } else {
        setError(result.fieldErrors ? '' : result.error)
        setFieldErrors(result.fieldErrors ?? {})
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field label="Name" htmlFor="project-name" errors={fieldErrors.name}>
        <Input
          id="project-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Website redesign"
          required
          maxLength={80}
          disabled={disabled}
          aria-invalid={Boolean(fieldErrors.name)}
          autoFocus={!initial}
        />
      </Field>

      <Field label="Description" htmlFor="project-description" errors={fieldErrors.description}>
        <Textarea
          id="project-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What is this project about?"
          rows={3}
          maxLength={500}
          disabled={disabled}
          aria-invalid={Boolean(fieldErrors.description)}
        />
      </Field>

      <FormMessage>{error}</FormMessage>

      {!disabled && (
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
      )}
    </form>
  )
}
