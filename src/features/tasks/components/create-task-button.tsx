'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import type { Member } from '@/features/members/queries'
import { createTask } from '../actions'
import { TaskForm } from './task-form'

export function CreateTaskButton({ projectId, members }: { projectId: string; members: Member[] }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>New task</Button>
      <Dialog open={open} onClose={() => setOpen(false)} title="New task">
        <TaskForm
          members={members}
          submitLabel="Create task"
          onCancel={() => setOpen(false)}
          onSuccess={() => setOpen(false)}
          onSubmit={(input) => createTask(projectId, input)}
        />
      </Dialog>
    </>
  )
}
