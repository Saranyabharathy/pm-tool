'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Field, Input, Textarea } from '@/components/ui/field'
import { FormMessage } from '@/components/ui/form-message'
import type { ActionResult, FieldErrors } from '@/lib/action'
import type { ProjectInput } from '../schemas'

type ProjectFormProps = {
  initial?: ProjectInput
  submitLabel: string
  disabled?: boolean
  onSubmit: (input: ProjectInput) => Promise<ActionResult<unknown>>
  onSuccess?: () => void
  onCancel?: () => void
}

export function ProjectForm({ initial, submitLabel, disabled, onSubmit, onSuccess, onCancel }: ProjectFormProps) {
  const [name, setName] = useState(initial?.name ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
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
      const result = await onSubmit({ name, description })
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
      <Field label="Name" htmlFor="project-name" errors={fieldErrors.name}>
        <Input
          id="project-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Website redesign"
          required
          maxLength={80}
          disabled={disabled}
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
        />
      </Field>

      <FormMessage>{error}</FormMessage>
      {!onSuccess && saved && <FormMessage tone="success">Saved.</FormMessage>}

      {!disabled && (
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
      )}
    </form>
  )
}
