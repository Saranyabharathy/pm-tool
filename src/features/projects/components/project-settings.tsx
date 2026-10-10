'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { FormMessage } from '@/components/ui/form-message'
import { deleteProject, updateProject } from '../actions'
import type { ProjectInput } from '../schemas'
import { ProjectForm } from './project-form'

type ProjectSettingsProps = {
  projectId: string
  initial: ProjectInput
  canEdit: boolean
}

export function ProjectSettings({ projectId, initial, canEdit }: ProjectSettingsProps) {
  return (
    <ProjectForm
      initial={initial}
      submitLabel="Save changes"
      disabled={!canEdit}
      onSubmit={(input) => updateProject(projectId, input)}
    />
  )
}

export function DeleteProjectButton({ projectId, projectName }: { projectId: string; projectName: string }) {
  const [error, setError] = useState('')
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  function handleDelete() {
    if (!window.confirm(`Delete "${projectName}" with all of its tasks and comments? This cannot be undone.`)) {
      return
    }
    setError('')
    startTransition(async () => {
      const result = await deleteProject(projectId)
      if (result.ok) router.push('/projects')
      else setError(result.error)
    })
  }

  return (
    <div className="space-y-3">
      <Button variant="danger" onClick={handleDelete} disabled={pending}>
        {pending ? 'Deleting...' : 'Delete project'}
      </Button>
      <FormMessage>{error}</FormMessage>
    </div>
  )
}
