'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Textarea } from '@/components/ui/textarea'
import { UserAvatar } from '@/components/ui/user-avatar'
import { formatDateTime } from '@/lib/format'
import { addComment, deleteComment } from '../actions'
import type { CommentItem } from '../queries'

type CommentThreadProps = {
  projectId: string
  taskId: string
  currentUser: { id: string; name: string }
  comments: CommentItem[]
}

export function CommentThread({ projectId, taskId, currentUser, comments }: CommentThreadProps) {
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
    startTransition(async () => {
      const result = await deleteComment(projectId, commentId)
      if (result.ok) toast.success('Comment deleted')
      else toast.error(result.error)
    })
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="flex gap-2.5">
        <UserAvatar id={currentUser.id} name={currentUser.name} size="lg" />
        <div className="min-w-0 flex-1 space-y-2">
          <label htmlFor="comment-body" className="sr-only">
            Write a comment
          </label>
          <Textarea
            id="comment-body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            onKeyDown={(e) => {
              // Ctrl or Cmd + Enter posts.
              if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) e.currentTarget.form?.requestSubmit()
            }}
            placeholder="Write a comment"
            rows={2}
            maxLength={2000}
            required
            aria-invalid={Boolean(error)}
            className="min-h-0 bg-card"
          />
          {error && <p className="text-xs text-destructive">{error}</p>}
          {body.trim() && (
            <Button type="submit" disabled={pending}>
              {pending && <Spinner />}
              Comment
            </Button>
          )}
        </div>
      </form>

      {comments.length === 0 ? (
        <p className="pl-[42px] text-[13px] text-muted-foreground">No comments yet. Start the conversation.</p>
      ) : (
        // Newest first, next to the box the reader types in.
        <ul className="space-y-4">
          {comments.toReversed().map((comment) => (
            <li key={comment.id} className="flex gap-2.5 animate-in fade-in duration-300">
              <UserAvatar id={comment.authorId} name={comment.authorName} size="lg" />
              <div className="min-w-0 flex-1">
                <p className="flex flex-wrap items-baseline gap-x-2 text-[13px]">
                  <span className="font-semibold">{comment.authorName}</span>
                  <time
                    dateTime={comment.createdAt.toISOString()}
                    className="text-xs text-muted-foreground"
                    suppressHydrationWarning
                  >
                    {formatDateTime(comment.createdAt)}
                  </time>
                </p>
                <p className="mt-1 rounded-lg bg-card px-3 py-2 text-sm whitespace-pre-wrap shadow-card wrap-anywhere">
                  {comment.body}
                </p>
                {comment.authorId === currentUser.id && (
                  <button
                    type="button"
                    onClick={() => handleDelete(comment.id)}
                    disabled={pending}
                    className="mt-1 rounded text-xs text-muted-foreground underline underline-offset-2 outline-none hover:text-destructive focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
                  >
                    Delete
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
