import { user } from '@/db/schema'
import { testDb } from './db'

type TestUser = { id: string; name: string; email: string }

let signedIn: TestUser | null = null

export function currentUser() {
  return signedIn
}

export function signInAs(testUser: TestUser | null) {
  signedIn = testUser
}

export async function createUser(name: string): Promise<TestUser> {
  const id = crypto.randomUUID()
  const email = `${name.toLowerCase()}-${id.slice(0, 8)}@example.com`
  await testDb.insert(user).values({ id, name, email })
  return { id, name, email }
}
