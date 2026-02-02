# Local Development Setup Guide

## Quick Start

### 1. Start PostgreSQL

Open a terminal and run:

```bash
brew services start postgresql@14
# OR if that doesn't work:
brew services start postgresql
```

Wait a few seconds for PostgreSQL to start, then verify:

```bash
pg_isready
```

### 2. Create Database

```bash
createdb bellsteps
```

### 3. Verify Environment Variables

Make sure your `.env.local` has:

```
POSTGRES_URL=postgresql://localhost:5432/bellsteps
```

If your PostgreSQL requires a username/password, use:

```
POSTGRES_URL=postgresql://username:password@localhost:5432/bellsteps
```

### 4. Run Migrations

```bash
npm run migrate
```

### 5. Seed Database

```bash
npm run seed
```

### 6. Start Dev Server

```bash
npm run dev
```

The app will be available at http://localhost:3000

## Troubleshooting

### PostgreSQL Not Starting

If `brew services start` doesn't work, try:

```bash
# Check if PostgreSQL is already running
pg_isready

# Or start manually
pg_ctl -D /opt/homebrew/var/postgresql@14 start
# (adjust path based on your installation)
```

### Connection Refused

If you get connection errors:

1. Check PostgreSQL is running: `pg_isready`
2. Verify the connection string format in `.env.local`
3. Try connecting manually: `psql -d bellsteps`

### Using Vercel Postgres Instead

If you prefer to use Vercel Postgres (cloud database):

1. Go to https://vercel.com/dashboard
2. Create/select a project
3. Go to Storage → Create Database → Postgres
4. Copy the connection string
5. Update `.env.local` with: `POSTGRES_URL=<your-vercel-connection-string>`
6. Run migrations and seed as above

## Dev Login

For local development, you can use the "Dev Login" option on the login page:
- Enter any email address
- Click "Dev Login (No Email)"
- No password required - it will create/login automatically
