import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

const controlClass =
  'w-full px-4 py-2.5 bg-slate-900/60 border border-slate-700/60 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition disabled:opacity-60'

type FieldProps = {
  label: string
  htmlFor: string
  errors?: string[]
  children: ReactNode
}

export function Field({ label, htmlFor, errors, children }: FieldProps) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-xs font-medium text-slate-300 mb-1">
        {label}
      </label>
      {children}
      {errors?.map((error) => (
        <p key={error} className="mt-1 text-xs text-rose-400">
          {error}
        </p>
      ))}
    </div>
  )
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(controlClass, className)} {...props} />
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(controlClass, 'resize-y', className)} {...props} />
}

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cn(controlClass, 'scheme-dark', className)} {...props} />
}
