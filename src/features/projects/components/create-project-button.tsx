'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { createProject } from '../actions'
import { ProjectForm } from './project-form'

export function CreateProjectButton() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  return (
    <>
      <Button onClick={() => setOpen(true)}>New project</Button>
      <Dialog open={open} onClose={() => setOpen(false)} title="New project">
        <ProjectForm
          submitLabel="Create project"
          onCancel={() => setOpen(false)}
          onSubmit={async (input) => {
            const result = await createProject(input)
            if (result.ok) router.push(`/projects/${result.data.id}`)
            return result
          }}
        />
      </Dialog>
    </>
  )
}
