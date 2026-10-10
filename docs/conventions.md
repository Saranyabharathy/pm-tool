# Conventions

How code in this repository is organised and written. Read [architecture.md](architecture.md) first.

## Adding a feature

Using "labels on tasks" as the example:

1. **Schema.** Add `src/db/schema/labels.ts`, export it from `src/db/schema/index.ts`, then generate and apply a migration ([database.md](database.md#changing-the-schema)).
2. **Input validation.** Add `src/features/labels/schemas.ts` with a Zod schema per form or action, and export its input type with `z.input<typeof schema>`.
3. **Reads.** Add `queries.ts`. Each function starts with `requireProjectAccess(projectId)` and selects only the columns the UI needs.
4. **Writes.** Add `actions.ts` with `'use server'` at the top. Each action wraps its body in `runAction`, starts with `requireProjectMember` or `requireProjectOwner`, parses its input with the Zod schema, and ends with `revalidatePath` for the pages that show the data.
5. **UI.** Put components in `src/features/labels/components/`. Add or extend a page in `src/app/(app)/`.
6. **Tests.** Cover the permission rules and any ordering or calculation logic in `tests/`.

## Server and client components

Components are Server Components unless they need state, effects or event handlers. Keep `'use client'` on the smallest piece that needs it: the page fetches data on the server and passes it as props to a client component for the interactive part, as `projects/[projectId]/page.tsx` does with `Board`.

A client component must not import from `queries.ts`, `src/db` or `src/lib/auth.ts`. It may import types from them with `import type`.

## Validation

- All input to a Server Action is parsed with Zod on the server, whatever the form already checked in the browser. HTML attributes such as `required` and `maxLength` are a convenience for the user only.
- Ids that arrive from a URL are checked to be UUIDs before they reach a query, because PostgreSQL raises an error on a malformed UUID.
- Schemas trim strings and supply defaults, so actions work with clean values.

## Errors

- For a failure the user can understand and act on, throw `new AppError(code, message)`. The message is shown as written, so phrase it for the user.
- Do not catch errors inside an action just to return them; `runAction` does that.
- In a query, call `notFound()` for a missing or inaccessible record.
- Never include database error text, ids of other users' records or stack traces in a message.

## Database access

- Only `queries.ts`, `actions.ts`, `src/lib` and `scripts/` import `db`.
- Any write that touches more than one row or table goes in `db.transaction`.
- Always filter child records by their project id as well as their own id.
- Use Drizzle's query builder. For raw fragments use the `sql` template tag, which parameterises values; never build SQL with string concatenation.

## Naming and style

- Files and folders: `kebab-case`. React components: `PascalCase`. Functions and variables: `camelCase`. Database tables and columns: `snake_case`.
- Queries are named `listX` and `getX`; actions are verbs such as `createTask` and `removeMember`.
- Import across folders with the `@/` alias and within a feature with relative paths.
- TypeScript is in strict mode. Avoid `any`; derive types from the schema (`typeof tasks.$inferSelect`) or from a query (`Awaited<ReturnType<typeof listTasks>>[number]`) so they follow the database.
- Style with Tailwind classes. Reuse `src/components/ui` before adding a new primitive.
- Comments explain why, not what.

## Tests

`npm test` runs Vitest. Tests live in `tests/`:

| Folder | Contents |
|---|---|
| `tests/unit` | Pure logic: Zod schemas, `moveItem` |
| `tests/integration` | Queries and actions against a real PostgreSQL engine (PGlite, in-process) |
| `tests/helpers` | Test database, sign-in helper, result assertions |

`tests/setup.ts` replaces three modules: `@/db` with the PGlite database, `@/lib/session` with a stand-in controlled by `signInAs(user)`, and `next/cache`. Everything else, including the permission guards and SQL, runs for real.

An integration test reads like a user story:

```ts
signInAs(owner)
const projectId = expectOk(await createProject({ name: 'Apollo' })).id

signInAs(outsider)
expectError(await deleteProject(projectId), /Project not found/)
```

When you add an action, add a test that someone who is not a member, and where relevant a member who is not the owner, cannot use it.

Not covered by automated tests: the sign-in forms, page rendering and drag and drop in the browser. Check those by hand after changing them.

## Before committing

```bash
npm run lint
npm run typecheck
npm test
```

Commit migrations together with the schema change that produced them. Never commit `.env.local`.
