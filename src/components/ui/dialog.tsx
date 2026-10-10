'use client'

import { useEffect, useRef, type ReactNode } from 'react'

type DialogProps = {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

// Thin wrapper over the native <dialog>, which handles focus trapping and Escape.
export function Dialog({ open, onClose, title, children }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(event) => {
        // A click on the backdrop lands on the dialog element itself.
        if (event.target === ref.current) onClose()
      }}
      className="m-auto w-full max-w-lg rounded-2xl border border-white/10 bg-slate-900 p-0 text-slate-100 shadow-2xl backdrop:bg-black/60 backdrop:backdrop-blur-sm"
    >
      {open && (
        <div className="p-6">
          <h2 className="mb-4 text-lg font-semibold text-white">{title}</h2>
          {children}
        </div>
      )}
    </dialog>
  )
}
