import { vi } from 'vitest'

// Swap the real pg pool for an in-process Postgres (see helpers/db.ts).
vi.mock('@/db', async () => {
  const { testDb } = await import('./helpers/db')
  return { db: testDb }
})

// Stand in for the Better Auth session; tests pick the user with signInAs().
vi.mock('@/lib/session', async () => {
  const { currentUser } = await import('./helpers/session')
  return {
    getSession: async () => {
      const user = currentUser()
      return user ? { user } : null
    },
    requireUser: async () => {
      const user = currentUser()
      if (!user) throw new Error('Test is not signed in. Call signInAs() first.')
      return user
    },
  }
})

// revalidatePath only works inside a Next.js request.
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }))
