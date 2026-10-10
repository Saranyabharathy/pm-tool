# PM Tool

A small project management app: projects, a kanban board, task details, team members and comments.

## Features

- Email and password accounts
- Projects with an owner and members
- Tasks with status, priority, due date, assignee and description
- Kanban board with drag and drop, plus a filterable list view
- Comments on tasks
- Light and dark themes that follow the system setting

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS 4 with design tokens ([DESIGN.md](DESIGN.md)) |
| UI components | shadcn/ui on Base UI, lucide icons, sonner toasts, a few React Bits effects |
| Database | PostgreSQL 17 |
| ORM and migrations | Drizzle ORM, drizzle-kit |
| Auth | Better Auth (email and password, sessions stored in Postgres) |
| Validation | Zod |
| Drag and drop | dnd-kit |
| Tests | Vitest, PGlite |

## Quick start

You need Node.js 22 or newer and a running PostgreSQL server. [docs/setup.md](docs/setup.md) covers installing PostgreSQL on Windows and creating the database.

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run db:migrate           # create the tables
npm run db:seed              # optional: demo users, project and tasks
npm run dev
```

Open http://localhost:3000. After seeding you can log in as `alex@example.com` (project owner) or `sam@example.com` (member), both with the password `password123`.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` / `npm start` | Build and run for production |
| `npm run lint` | ESLint |
| `npm run typecheck` | Generate route types, then run the TypeScript compiler |
| `npm test` | Unit and integration tests (no database server needed) |
| `npm run db:generate` | Create a migration from changes to `src/db/schema` |
| `npm run db:migrate` | Apply pending migrations |
| `npm run db:seed` | Insert demo data into an empty database |
| `npm run db:studio` | Browse the database in Drizzle Studio |

## Documentation

- [Setup](docs/setup.md): PostgreSQL, environment variables, first run
- [Architecture](docs/architecture.md): folder structure, request flow, auth and permissions
- [Database](docs/database.md): tables, relationships, migration workflow
- [Conventions](docs/conventions.md): how to add a feature, validation, errors, tests
- [Design system](DESIGN.md): colours, type, spacing, components, the board, where animation is allowed

## Not in the MVP

Invitation emails, email verification, password reset, OAuth sign-in, realtime updates, file attachments, notifications and an activity log. A project member is added by the email of an account that already exists.
