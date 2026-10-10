'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth-client'

export function SignOutButton() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSignOut() {
    setLoading(true)
    await authClient.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <Button variant="secondary" size="sm" onClick={handleSignOut} disabled={loading}>
      {loading ? 'Signing out...' : 'Sign out'}
    </Button>
  )
}
