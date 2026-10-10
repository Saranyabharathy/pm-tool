'use client'

import { useState, useTransition } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/field'
import { FormMessage } from '@/components/ui/form-message'
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
  const [pending, startTransition] = useTransition()

  function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    startTransition(async () => {
      const result = await addMember(projectId, { email })
      if (result.ok) setEmail('')
      else setError(result.fieldErrors?.email?.[0] ?? result.error)
    })
  }

  function handleRemove(member: Member) {
    if (!window.confirm(`Remove ${member.name} from this project? Their tasks will become unassigned.`)) return
    setError('')
    startTransition(async () => {
      const result = await removeMember(projectId, member.userId)
      if (!result.ok) setError(result.error)
    })
  }

  return (
    <div className="space-y-4">
      <ul className="divide-y divide-white/10 rounded-xl border border-white/10">
        {members.map((member) => (
          <li key={member.userId} className="flex items-center justify-between gap-3 px-4 py-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-100">{member.name}</p>
              <p className="truncate text-xs text-slate-400">{member.email}</p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Badge tone={member.role === 'owner' ? 'blue' : 'neutral'}>
                {member.role === 'owner' ? 'Owner' : 'Member'}
              </Badge>
              {canManage && member.role !== 'owner' && (
                <Button variant="ghost" size="sm" onClick={() => handleRemove(member)} disabled={pending}>
                  Remove
                </Button>
              )}
            </div>
          </li>
        ))}
      </ul>

      {canManage && (
        <form onSubmit={handleAdd} className="flex flex-col gap-3 sm:flex-row">
          <label htmlFor="member-email" className="sr-only">
            Email of the person to add
          </label>
          <Input
            id="member-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="teammate@example.com"
            required
          />
          <Button type="submit" disabled={pending} className="shrink-0">
            {pending ? 'Working...' : 'Add member'}
          </Button>
        </form>
      )}

      <FormMessage>{error}</FormMessage>
      {canManage && (
        <p className="text-xs text-slate-500">The person needs an account already. No invitation email is sent.</p>
      )}
    </div>
  )
}
