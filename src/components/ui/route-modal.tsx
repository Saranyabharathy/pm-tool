'use client'

import { useRouter } from 'next/navigation'
import type { ReactNode } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'

// A dialog whose open state is the URL: it is open while its route is active,
// and closing it goes back to the page underneath.
export function RouteModal({ title, children }: { title: string; children: ReactNode }) {
  const router = useRouter()

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) router.back()
      }}
    >
      <DialogContent className="top-[5vh] max-h-[90vh] translate-y-0 overflow-y-auto bg-background pt-10 sm:max-w-3xl">
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <DialogDescription className="sr-only">Edit the task and read its comments.</DialogDescription>
        {children}
      </DialogContent>
    </Dialog>
  )
}
