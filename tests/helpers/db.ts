import { PGlite } from '@electric-sql/pglite'
import { drizzle } from 'drizzle-orm/pglite'
import { migrate } from 'drizzle-orm/pglite/migrator'
import * as schema from '@/db/schema'

// PostgreSQL running in-process, fresh for every test file and built from the
// same migrations as the real database.
const client = new PGlite()

export const testDb = drizzle(client, { schema })

await migrate(testDb, { migrationsFolder: './drizzle' })
