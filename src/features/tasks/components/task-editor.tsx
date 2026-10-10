'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { FormMessage } from '@/components/ui/form-message'
import type { Member } from '@/features/members/queries'
import { deleteTask, updateTask } from '../actions'
import type { TaskInput } from '../schemas'
import { TaskForm } from './task-form'

type TaskEditorProps = {
  projectId: string
  taskId: string
  initial: TaskInput
  members: Member[]
}

export function TaskEditor({ projectId, taskId, initial, members }: TaskEditorProps) {
  const [error, setError] = useState('')
  const [deleting, startDelete] = useTransition()
  const router = useRouter()

  function handleDelete() {
    if (!window.confirm('Delete this task and its comments? This cannot be undone.')) return
    setError('')
    startDelete(async () => {
      const result = await deleteTask(projectId, taskId)
      if (result.ok) router.push(`/projects/${projectId}`)
      else setError(result.error)
    })
  }

  return (
    <div className="space-y-4">
      <TaskForm
        members={members}
        initial={initial}
        submitLabel="Save changes"
        onSubmit={(input) => updateTask(projectId, taskId, input)}
      />
      <div className="flex items-center justify-between gap-3 border-t border-white/10 pt-4">
        <Button variant="danger" size="sm" onClick={handleDelete} disabled={deleting}>
          {deleting ? 'Deleting...' : 'Delete task'}
        </Button>
        <FormMessage>{error}</FormMessage>
      </div>
    </div>
  )
}
