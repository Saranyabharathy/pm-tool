'use client'

import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { UserAvatar } from '@/components/ui/user-avatar'
import { authClient } from '@/lib/auth-client'

export type ShellUser = { id: string; name: string; email: string }

export function UserMenu({ user }: { user: ShellUser }) {
  const [signingOut, setSigningOut] = useState(false)
  const router = useRouter()

  async function handleSignOut() {
    setSigningOut(true)
    const { error } = await authClient.signOut()
    if (error) {
      setSigningOut(false)
      toast.error('Could not sign out. Please try again.')
      return
    }
    router.push('/login')
    router.refresh()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Account menu"
        className="rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <UserAvatar id={user.id} name={user.name} size="lg" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex items-center gap-2.5 py-2">
            <UserAvatar id={user.id} name={user.name} size="lg" />
            <span className="min-w-0">
              <span className="block truncate text-sm font-medium text-foreground">{user.name}</span>
              <span className="block truncate text-xs font-normal text-muted-foreground">{user.email}</span>
            </span>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} disabled={signingOut} closeOnClick={false}>
          <LogOut aria-hidden />
          {signingOut ? 'Signing out...' : 'Sign out'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
