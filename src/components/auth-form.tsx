'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Field, Input } from '@/components/ui/field'
import { FormMessage } from '@/components/ui/form-message'
import { authClient } from '@/lib/auth-client'

const copy = {
  login: {
    title: 'Welcome Back',
    subtitle: 'Sign in to access your projects',
    submit: 'Log In',
    pending: 'Logging in...',
    switchText: 'New here?',
    switchLabel: 'Create an account',
    switchHref: '/signup',
  },
  signup: {
    title: 'Create an Account',
    subtitle: 'Enter your details to get started',
    submit: 'Create Account',
    pending: 'Creating Account...',
    switchText: 'Already have an account?',
    switchLabel: 'Log in',
    switchHref: '/login',
  },
}

export function AuthForm({ mode }: { mode: keyof typeof copy }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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
    <div className="w-full max-w-md bg-white/5 border border-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl">
      <h1 className="text-2xl font-bold text-white mb-2 text-center">{text.title}</h1>
      <p className="text-slate-400 text-sm mb-6 text-center">{text.subtitle}</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'signup' && (
          <Field label="Name" htmlFor="name">
            <Input
              id="name"
              autoComplete="name"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={80}
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
          />
        </Field>

        <Field label="Password" htmlFor="password">
          <Input
            id="password"
            type="password"
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />
        </Field>

        <Button type="submit" disabled={loading} className="w-full py-3">
          {loading ? text.pending : text.submit}
        </Button>

        <FormMessage>{message}</FormMessage>
      </form>

      <p className="mt-6 text-sm text-center text-slate-400">
        {text.switchText}{' '}
        <Link href={text.switchHref} className="text-blue-400 hover:text-blue-300">
          {text.switchLabel}
        </Link>
      </p>
    </div>
  )
}
