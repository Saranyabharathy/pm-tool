import { cache } from 'react'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'

// Cached per request, so layouts, pages and queries can all call it freely.
export const getSession = cache(async () => {
  return auth.api.getSession({ headers: await headers() })
})

export async function requireUser() {
  const session = await getSession()
  if (!session) redirect('/login')
  return session.user
}
