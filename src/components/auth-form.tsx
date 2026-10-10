'use client'

import { Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { FormMessage } from '@/components/ui/form-message'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { authClient } from '@/lib/auth-client'

const copy = {
  login: {
    title: 'Log in',
    subtitle: 'Welcome back. Enter your details to continue.',
    submit: 'Log in',
    switchText: 'New here?',
    switchLabel: 'Create an account',
    switchHref: '/signup',
  },
  signup: {
    title: 'Create your account',
    subtitle: 'Start planning your first project in a minute.',
    submit: 'Create account',
    switchText: 'Already have an account?',
    switchLabel: 'Log in',
    switchHref: '/login',
  },
}

export function AuthForm({ mode }: { mode: keyof typeof copy }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const text = copy[mode]

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const { error } =
      mode === 'login'
        ? await authClient.signIn.email({ email, password })
        : await authClient.signUp.email({ name: name.trim(), email, password })

    if (error) {
      setLoading(false)
      setMessage(error.message ?? 'Something went wrong. Please try again.')
    } else {
      router.push('/projects')
      router.refresh()
    }
  }

  return (
    <div className="w-full max-w-[360px]">
      <h1 className="text-2xl font-semibold tracking-tight">{text.title}</h1>
      <p className="mt-1.5 text-muted-foreground">{text.subtitle}</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        {mode === 'signup' && (
          <Field label="Name" htmlFor="name">
            <Input
              id="name"
              autoComplete="name"
              placeholder="Alex Morgan"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={80}
              className="h-9"
            />
          </Field>
        )}

        <Field label="Email" htmlFor="email">
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-9"
          />
        </Field>

        <Field
          label="Password"
          htmlFor="password"
          hint={mode === 'signup' ? 'At least 8 characters.' : undefined}
        >
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="h-9 pr-9"
            />
            <button
              type="button"
              onClick={() => setShowPassword((shown) => !shown)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              aria-pressed={showPassword}
              className="absolute inset-y-0 right-0 flex w-9 items-center justify-center rounded-r-lg text-muted-foreground outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {showPassword ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
            </button>
          </div>
        </Field>

        <FormMessage>{message}</FormMessage>

        <Button type="submit" size="lg" disabled={loading} className="w-full">
          {loading && <Spinner />}
          {text.submit}
        </Button>
      </form>

      <p className="mt-6 text-[13px] text-muted-foreground">
        {text.switchText}{' '}
        <Link href={text.switchHref} className="font-medium text-primary underline-offset-4 hover:underline">
          {text.switchLabel}
        </Link>
      </p>
    </div>
  )
}
