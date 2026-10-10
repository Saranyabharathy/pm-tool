'use client'

import { Plus, X } from 'lucide-react'
import { useRef, useState, useTransition } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import type { TaskStatus } from '@/db/schema'
import { createTask } from '../actions'
import { STATUS_LABELS } from '../constants'

// "Add a card" at the bottom of a list: type a title, Enter adds it and keeps
// the composer open for the next one.
export function CardComposer({ projectId, status }: { projectId: string; status: TaskStatus }) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [pending, startTransition] = useTransition()
  const inputRef = useRef<HTMLTextAreaElement>(null)

  function close() {
    setOpen(false)
    setTitle('')
  }

  function submit() {
    const value = title.trim()
    if (!value || pending) return

    startTransition(async () => {
      const result = await createTask(projectId, { title: value, status })
      if (result.ok) {
        setTitle('')
        inputRef.current?.focus()
      } else {
        toast.error(result.fieldErrors?.title?.[0] ?? result.error)
      }
    })
  }

  if (!open) {
    return (
      <Button
        variant="ghost"
        className="w-full justify-start text-muted-foreground hover:bg-foreground/10 hover:text-foreground"
        onClick={() => setOpen(true)}
      >
        <Plus aria-hidden />
        Add a card
      </Button>
    )
  }

  return (
    <form
      className="space-y-2"
      onSubmit={(e) => {
        e.preventDefault()
        submit()
      }}
      onBlur={(e) => {
        // Close when focus leaves the composer with nothing typed.
        if (!e.currentTarget.contains(e.relatedTarget) && !title.trim() && !pending) close()
      }}
    >
      <textarea
        ref={inputRef}
        autoFocus
        rows={2}
        maxLength={200}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            submit()
          }
          if (e.key === 'Escape') close()
        }}
        placeholder="Enter a title for this card"
        aria-label={`Title of the new card in ${STATUS_LABELS[status]}`}
        className="block w-full resize-none rounded-lg bg-card px-3 py-2 text-sm shadow-card outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
      />
      <div className="flex items-center gap-1">
        <Button type="submit" disabled={pending || !title.trim()}>
          {pending && <Spinner />}
          Add card
        </Button>
        <Button variant="ghost" size="icon" aria-label="Cancel" onClick={close} disabled={pending}>
          <X aria-hidden />
        </Button>
      </div>
    </form>
  )
}
