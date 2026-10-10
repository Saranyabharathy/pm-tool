import { z } from 'zod'

const schema = z.object({
  DATABASE_URL: z.url(),
  BETTER_AUTH_SECRET: z.string().min(32),
  BETTER_AUTH_URL: z.url(),
})

const parsed = schema.safeParse(process.env)

if (!parsed.success) {
  const missing = parsed.error.issues.map((issue) => issue.path.join('.')).join(', ')
  throw new Error(`Invalid or missing environment variables: ${missing}. See .env.example.`)
}

export const env = parsed.data
