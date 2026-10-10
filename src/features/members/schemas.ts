import { z } from 'zod'

export const addMemberInput = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email('Enter a valid email address.')),
})

export type AddMemberInput = z.input<typeof addMemberInput>
