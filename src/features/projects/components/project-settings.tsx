'use client'

import { Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
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
      successMessage="Project updated"
      disabled={!canEdit}
      onSubmit={(input) => updateProject(projectId, input)}
    />
  )
}

export function DeleteProjectButton({ projectId, projectName }: { projectId: string; projectName: string }) {
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteProject(projectId)
      if (result.ok) {
        toast.success('Project deleted')
        router.push('/projects')
      } else {
        setOpen(false)
        toast.error(result.error)
      }
    })
  }

  return (
    <>
      <Button variant="destructive" onClick={() => setOpen(true)}>
        <Trash2 aria-hidden />
        Delete project
      </Button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title={`Delete "${projectName}"?`}
        description="All of its tasks and comments are deleted with it. This cannot be undone."
        confirmLabel="Delete project"
        pending={pending}
        onConfirm={handleDelete}
      />
    </>
  )
}
