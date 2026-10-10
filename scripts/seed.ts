// Fills an empty database with demo data: npm run db:seed
import { eq } from 'drizzle-orm'
import { db, pool } from '@/db'
import { comments, projectMembers, projects, tasks, user } from '@/db/schema'
import { auth } from '@/lib/auth'

const PASSWORD = 'password123'

const people = [
  { name: 'Alex Owner', email: 'alex@example.com' },
  { name: 'Sam Member', email: 'sam@example.com' },
]

async function main() {
  const [existing] = await db.select({ id: user.id }).from(user).where(eq(user.email, people[0].email))
  if (existing) {
    console.log('Demo data is already present. Nothing to do.')
    return
  }

  // Go through Better Auth so passwords are hashed the way sign-in expects.
  const [alex, sam] = await Promise.all(
    people.map(async (person) => {
      const result = await auth.api.signUpEmail({ body: { ...person, password: PASSWORD } })
      return result.user
    }),
  )

  await db.transaction(async (tx) => {
    const [project] = await tx
      .insert(projects)
      .values({
        name: 'Website redesign',
        description: 'New marketing site, launching next quarter.',
        ownerId: alex.id,
      })
      .returning({ id: projects.id })

    await tx.insert(projectMembers).values([
      { projectId: project.id, userId: alex.id, role: 'owner' },
      { projectId: project.id, userId: sam.id, role: 'member' },
    ])

    const base = { projectId: project.id, createdBy: alex.id }
    const created = await tx
      .insert(tasks)
      .values([
        { ...base, title: 'Write the content brief', status: 'done', priority: 'medium', position: 0, assigneeId: alex.id },
        { ...base, title: 'Design the home page', status: 'in_progress', priority: 'high', position: 0, assigneeId: sam.id },
        { ...base, title: 'Set up analytics', status: 'in_progress', priority: 'low', position: 1 },
        { ...base, title: 'Build the pricing page', status: 'todo', priority: 'high', position: 0, assigneeId: sam.id },
        { ...base, title: 'Review accessibility', status: 'todo', priority: 'medium', position: 1 },
        { ...base, title: 'Plan the launch announcement', status: 'todo', priority: 'low', position: 2 },
      ])
      .returning({ id: tasks.id })

    await tx.insert(comments).values([
      { taskId: created[1].id, authorId: alex.id, body: 'First draft looks great. Can we try a lighter hero image?' },
      { taskId: created[1].id, authorId: sam.id, body: 'Sure, I will have a second version tomorrow.' },
    ])
  })

  console.log(`Seeded. Log in as ${people[0].email} or ${people[1].email} with the password "${PASSWORD}".`)
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(() => pool.end())
