import { unstable_rethrow } from 'next/navigation'
import { z } from 'zod'

export type FieldErrors = Record<string, string[] | undefined>

export type ActionResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string; fieldErrors?: FieldErrors }

export type AppErrorCode = 'NOT_FOUND' | 'FORBIDDEN' | 'CONFLICT' | 'INVALID'

// An expected failure whose message is safe to show to the user.
export class AppError extends Error {
  constructor(
    public code: AppErrorCode,
    message: string,
  ) {
    super(message)
    this.name = 'AppError'
  }
}

// Wraps the body of a server action so callers always get an ActionResult.
export async function runAction<T>(fn: () => Promise<T>): Promise<ActionResult<T>> {
  try {
    return { ok: true, data: await fn() }
  } catch (error) {
    // Let redirect() and notFound() propagate to Next.js.
    unstable_rethrow(error)

    if (error instanceof AppError) {
      return { ok: false, error: error.message }
    }
    if (error instanceof z.ZodError) {
      return {
        ok: false,
        error: 'Please check the highlighted fields.',
        fieldErrors: z.flattenError(error).fieldErrors,
      }
    }
    console.error(error)
    return { ok: false, error: 'Something went wrong. Please try again.' }
  }
}
