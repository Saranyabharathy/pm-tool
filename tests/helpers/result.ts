import { expect } from 'vitest'
import type { ActionResult } from '@/lib/action'

// Unwraps a successful action result, failing the test with its error otherwise.
export function expectOk<T>(result: ActionResult<T>): T {
  if (!result.ok) throw new Error(`Expected the action to succeed, got: ${result.error}`)
  return result.data
}

export function expectError(result: ActionResult<unknown>, message: RegExp) {
  expect(result.ok).toBe(false)
  if (!result.ok) expect(result.error).toMatch(message)
}
