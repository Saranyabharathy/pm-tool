import type { ReactNode, SelectHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type FieldProps = {
  label: string
  htmlFor: string
  errors?: string[]
  hint?: string
  children: ReactNode
}

export function Field({ label, htmlFor, errors, hint, children }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="block text-xs font-medium text-muted-foreground">
        {label}
      </label>
      {children}
      {hint && !errors?.length && <p className="text-xs text-muted-foreground">{hint}</p>}
      {errors?.map((error) => (
        <p key={error} className="text-xs text-destructive">
          {error}
        </p>
      ))}
    </div>
  )
}

// A native select styled like Input: best keyboard and mobile behaviour for
// short option lists.
export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        'h-8 w-full min-w-0 rounded-lg border border-input bg-card px-2 text-sm text-foreground outline-none transition-colors',
        'focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
}
