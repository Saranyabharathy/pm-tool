'use client'

import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { createProject } from '../actions'
import { ProjectForm } from './project-form'

type CreateProjectButtonProps = {
  // Where the trigger sits decides how it looks.
  trigger?: 'button' | 'sidebar' | 'tile'
}

export function CreateProjectButton({ trigger = 'button' }: CreateProjectButtonProps) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  return (
    <>
      {trigger === 'button' && (
        <Button onClick={() => setOpen(true)}>
          <Plus aria-hidden />
          New project
        </Button>
      )}
      {trigger === 'sidebar' && (
        <Button variant="outline" className="w-full justify-start" onClick={() => setOpen(true)}>
          <Plus aria-hidden />
          New project
        </Button>
      )}
      {trigger === 'tile' && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex h-full min-h-36 w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed text-[13px] font-medium text-muted-foreground outline-none transition-colors hover:border-primary hover:bg-accent hover:text-accent-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <Plus className="size-5" aria-hidden />
          Create new project
        </button>
      )}

      <Modal
        open={open}
        onOpenChange={setOpen}
        title="New project"
        description="A project has its own board, tasks and members."
      >
        <ProjectForm
          submitLabel="Create project"
          successMessage="Project created"
          onCancel={() => setOpen(false)}
          onSubmit={async (input) => {
            const result = await createProject(input)
            if (result.ok) {
              setOpen(false)
              router.push(`/projects/${result.data.id}`)
            }
            return result
          }}
        />
      </Modal>
    </>
  )
}
