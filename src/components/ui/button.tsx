import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

const variants = {
  primary:
    'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/20',
  secondary: 'bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200',
  danger: 'bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300',
  ghost: 'hover:bg-white/10 text-slate-300',
}

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2.5 text-sm',
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants
  size?: keyof typeof sizes
}

export function buttonClass(variant: keyof typeof variants = 'primary', size: keyof typeof sizes = 'md') {
  return cn(
    'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition duration-200',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50',
    'disabled:opacity-50 disabled:pointer-events-none',
    variants[variant],
    sizes[size],
  )
}

export function Button({ variant, size, className, type = 'button', ...props }: ButtonProps) {
  return <button type={type} className={cn(buttonClass(variant, size), className)} {...props} />
}
