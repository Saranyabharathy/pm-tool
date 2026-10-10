import { z } from 'zod'

export const commentInput = z.object({
  body: z.string().trim().min(1, 'Write a comment first.').max(2000, 'Keep comments under 2000 characters.'),
})

export type CommentInput = z.input<typeof commentInput>
