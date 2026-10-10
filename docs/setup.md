# Setup

How to get the app running on a new machine. The steps are written for Windows; only the PostgreSQL install differs on macOS and Linux.

## 1. Prerequisites

- Node.js 22 or newer (`node -v`)
- PostgreSQL 17

## 2. Install PostgreSQL (Windows)

Either download the installer from https://www.postgresql.org/download/windows/ or run this in a terminal:

```powershell
winget install PostgreSQL.PostgreSQL.17
```

Accept the administrator prompt. The installer asks for a password for the `postgres` superuser; keep it, you need it in the next step. Leave the port at 5432. Stack Builder and pgAdmin are optional.

The installer registers PostgreSQL as a Windows service that starts with the machine. It does not add the command line tools to your `PATH`, so the commands below use the full path.

## 3. Create the role and the database

The app connects as its own role, `pm_tool`, not as the superuser. Choose a password for it and run:

```powershell
& "C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -c "CREATE ROLE pm_tool LOGIN PASSWORD 'choose-a-password'"
& "C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -c "CREATE DATABASE pm_tool OWNER pm_tool"
```

Each command prompts for the `postgres` superuser password.

## 4. Environment variables

Copy `.env.example` to `.env.local` and fill it in. `.env.local` is ignored by git.

| Variable | Meaning |
|---|---|
| `DATABASE_URL` | `postgres://pm_tool:<password>@localhost:5432/pm_tool`, with the password from step 3. URL-encode any special characters in it. |
| `BETTER_AUTH_SECRET` | Random string of at least 32 characters used to sign session cookies. Generate one with `openssl rand -base64 32`. |
| `BETTER_AUTH_URL` | The address the app is served from. `http://localhost:3000` in development. |

The app checks these on startup (`src/lib/env.ts`) and stops with a message naming any that are missing or malformed.

## 5. Install, migrate, run

```bash
npm install
npm run db:migrate
npm run db:seed     # optional demo data
npm run dev
```

Open http://localhost:3000 and sign up, or log in with a seeded account: `alex@example.com` or `sam@example.com`, password `password123`.

## Tests

```bash
npm test
```

Tests do not use your PostgreSQL server or `.env.local`. They run against PGlite, which is PostgreSQL compiled to run inside the Node.js process, and build a fresh database from the migrations in `drizzle/` for every test file.

## Troubleshooting

| Symptom | Cause |
|---|---|
| `Invalid or missing environment variables: ...` | `.env.local` is missing or a value is wrong. Restart `npm run dev` after editing it. |
| `ECONNREFUSED 127.0.0.1:5432` | PostgreSQL is not running. Start the `postgresql-x64-17` service from the Windows Services app. |
| `password authentication failed for user "pm_tool"` | The password in `DATABASE_URL` does not match the role. Reset it with `ALTER ROLE pm_tool PASSWORD '...'`. |
| `relation "user" does not exist` | Migrations have not been applied. Run `npm run db:migrate`. |
| Sign-in fails with an origin error | `BETTER_AUTH_URL` does not match the address in the browser, for example a different port. |

## Deploying

Any host that runs Node.js and can reach a PostgreSQL database works. Set the three environment variables there, with `BETTER_AUTH_URL` set to the public HTTPS address, run `npm run db:migrate` against the production database, then `npm run build` and `npm start`.
