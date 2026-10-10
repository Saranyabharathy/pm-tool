'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/field'
import { FormMessage } from '@/components/ui/form-message'
import { formatDateTime } from '@/lib/format'
import { addComment, deleteComment } from '../actions'
import type { CommentItem } from '../queries'

type CommentThreadProps = {
  projectId: string
  taskId: string
  currentUserId: string
  comments: CommentItem[]
}

export function CommentThread({ projectId, taskId, currentUserId, comments }: CommentThreadProps) {
  const [body, setBody] = useState('')
  const [error, setError] = useState('')
  const [pending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    startTransition(async () => {
      const result = await addComment(projectId, taskId, { body })
      if (result.ok) setBody('')
      else setError(result.fieldErrors?.body?.[0] ?? result.error)
    })
  }

  function handleDelete(commentId: string) {
    setError('')
    startTransition(async () => {
      const result = await deleteComment(projectId, commentId)
      if (!result.ok) setError(result.error)
    })
  }

  return (
    <div className="space-y-4">
      {comments.length === 0 ? (
        <p className="text-sm text-slate-500">No comments yet.</p>
      ) : (
        <ul className="space-y-3">
          {comments.map((comment) => (
            <li key={comment.id} className="rounded-xl border border-white/10 bg-white/5 p-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs text-slate-400">
                  <span className="font-medium text-slate-200">{comment.authorName}</span>
                  {' · '}
                  <time dateTime={comment.createdAt.toISOString()} suppressHydrationWarning>
                    {formatDateTime(comment.createdAt)}
                  </time>
                </p>
                {comment.authorId === currentUserId && (
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(comment.id)} disabled={pending}>
                    Delete
                  </Button>
                )}
              </div>
              <p className="mt-1 whitespace-pre-wrap text-sm text-slate-200 wrap-anywhere">{comment.body}</p>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <label htmlFor="comment-body" className="sr-only">
          Add a comment
        </label>
        <Textarea
          id="comment-body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Add a comment"
          rows={3}
          maxLength={2000}
          required
        />
        <FormMessage>{error}</FormMessage>
        <div className="flex justify-end">
          <Button type="submit" disabled={pending}>
            {pending ? 'Posting...' : 'Comment'}
          </Button>
        </div>
      </form>
    </div>
  )
}
