'use client'

import { UserPlus } from 'lucide-react'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { UserAvatar } from '@/components/ui/user-avatar'
import { addMember, removeMember } from '../actions'
import type { Member } from '../queries'

type MemberListProps = {
  projectId: string
  members: Member[]
  canManage: boolean
}

export function MemberList({ projectId, members, canManage }: MemberListProps) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [removing, setRemoving] = useState<Member | null>(null)
  const [adding, startAdd] = useTransition()
  const [removePending, startRemove] = useTransition()

  function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    startAdd(async () => {
      const result = await addMember(projectId, { email })
      if (result.ok) {
        setEmail('')
        toast.success('Member added')
      } else {
        setError(result.fieldErrors?.email?.[0] ?? result.error)
      }
    })
  }

  function handleRemove(member: Member) {
    startRemove(async () => {
      const result = await removeMember(projectId, member.userId)
      setRemoving(null)
      if (result.ok) toast.success(`${member.name} was removed`)
      else toast.error(result.error)
    })
  }

  return (
    <div className="space-y-4">
      {canManage && (
        <form onSubmit={handleAdd} className="space-y-1.5">
          <label htmlFor="member-email" className="block text-xs font-medium text-muted-foreground">
            Add a member by email
          </label>
          <div className="flex gap-2">
            <Input
              id="member-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="teammate@example.com"
              required
              aria-invalid={Boolean(error)}
              aria-describedby="member-email-help"
              className="bg-card"
            />
            <Button type="submit" disabled={adding} className="shrink-0">
              {adding ? <Spinner /> : <UserPlus aria-hidden />}
              Add
            </Button>
          </div>
          <p id="member-email-help" className={error ? 'text-xs text-destructive' : 'text-xs text-muted-foreground'}>
            {error || 'They need an account already. No invitation email is sent.'}
          </p>
        </form>
      )}

      <ul className="divide-y rounded-lg border">
        {members.map((member) => (
          <li key={member.userId} className="flex items-center gap-3 px-3 py-2.5">
            <UserAvatar id={member.userId} name={member.name} size="lg" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{member.name}</p>
              <p className="truncate text-xs text-muted-foreground">{member.email}</p>
            </div>
            <Badge tone={member.role === 'owner' ? 'blue' : 'grey'}>
              {member.role === 'owner' ? 'Owner' : 'Member'}
            </Badge>
            {canManage && member.role !== 'owner' && (
              <Button variant="ghost" size="sm" onClick={() => setRemoving(member)}>
                Remove
              </Button>
            )}
          </li>
        ))}
      </ul>

      <ConfirmDialog
        open={removing !== null}
        onOpenChange={(open) => {
          if (!open) setRemoving(null)
        }}
        title={removing ? `Remove ${removing.name}?` : ''}
        description="They lose access to this project, and tasks assigned to them become unassigned."
        confirmLabel="Remove member"
        pending={removePending}
        onConfirm={() => removing && handleRemove(removing)}
      />
    </div>
  )
}
