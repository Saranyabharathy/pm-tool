'use client'

import { Plus } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import type { Member } from '@/features/members/queries'
import { createTask } from '../actions'
import { TaskForm } from './task-form'

export function CreateTaskButton({ projectId, members }: { projectId: string; members: Member[] }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus aria-hidden />
        New task
      </Button>
      <Modal open={open} onOpenChange={setOpen} title="New task">
        <TaskForm
          members={members}
          submitLabel="Create task"
          successMessage="Task created"
          onCancel={() => setOpen(false)}
          onSuccess={() => setOpen(false)}
          onSubmit={(input) => createTask(projectId, input)}
        />
      </Modal>
    </>
  )
}
