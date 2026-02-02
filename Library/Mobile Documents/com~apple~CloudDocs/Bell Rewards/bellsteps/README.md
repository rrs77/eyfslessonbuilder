# BellSteps

A production-ready web app for Reception (age 4–5) handbells progression, tracking students from Bronze Star to Black Belt.

## Features

- **10-Level Progression System**: From Bronze Star through to Black Belt
- **Resource Library**: Videos, PDFs, printables, games, assessments, and more
- **Progress Tracking**: Track each user's progress per level with status and notes
- **Favourites System**: Save favourite resources for quick access
- **IWB-Optimized UI**: Large buttons, minimal text, icon-heavy design for classroom use
- **Email Magic Link Authentication**: Secure login with Auth.js
- **Vercel Postgres Database**: Reliable data storage
- **Vercel Blob Storage**: For PDFs and media files

## Tech Stack

- **Next.js 14+** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Auth.js (NextAuth)** v5
- **Vercel Postgres**
- **Vercel Blob**

## Prerequisites

- Node.js 18+ and npm
- Vercel account (for Postgres and Blob)
- SMTP server for email authentication (or use a service like SendGrid, Resend, etc.)

## Local Setup

1. **Clone and install dependencies:**

```bash
npm install
```

2. **Set up environment variables:**

Create a `.env.local` file in the root directory:

```env
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-generate-with-openssl-rand-base64-32

# Email (for magic link authentication)
EMAIL_SERVER_HOST=smtp.example.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@example.com
EMAIL_SERVER_PASSWORD=your-password
EMAIL_FROM=noreply@bellsteps.app

# Vercel Postgres
POSTGRES_URL=your-vercel-postgres-connection-string

# Vercel Blob (optional, for file uploads)
BLOB_READ_WRITE_TOKEN=your-blob-token

# Admin emails (comma-separated)
ADMIN_EMAILS=admin@example.com,teacher@example.com
```

3. **Run database migrations:**

```bash
npm run migrate
```

This will create all necessary tables in your Vercel Postgres database.

4. **Seed the database:**

```bash
npm run seed
```

This populates the database with all 10 levels and their resources.

5. **Start the development server:**

```bash
npm run dev
```

6. **Access the app:**

- Open [http://localhost:3000](http://localhost:3000)
- For local development, you can use the "Dev Login" option on the login page (email-only, no password required)

## Deployment to Vercel

### Quick Deploy (5 minutes)

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/bellsteps.git
   git push -u origin main
   ```

2. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel auto-detects Next.js

3. **Set up Vercel Postgres:**
   - In project dashboard → **Storage** → **Create Database** → **Postgres**
   - `POSTGRES_URL` is automatically added

4. **Set Environment Variables:**
   In **Settings** → **Environment Variables**, add:
   ```
   NEXTAUTH_URL=https://your-app.vercel.app
   NEXTAUTH_SECRET=(generate with: openssl rand -base64 32)
   EMAIL_SERVER_HOST=(your SMTP host)
   EMAIL_SERVER_PORT=587
   EMAIL_SERVER_USER=(your email)
   EMAIL_SERVER_PASSWORD=(your password)
   EMAIL_FROM=noreply@bellsteps.app
   ADMIN_EMAILS=your-email@example.com
   ```
   (POSTGRES_URL is auto-added by Vercel Postgres)

5. **Deploy:**
   - Click "Deploy" or push to GitHub (auto-deploys)

6. **Run Migrations & Seed:**
   After first deployment:
   - Visit `https://your-app.vercel.app/admin/seed`
   - Click "Run Seed Script" (requires admin email in ADMIN_EMAILS)
   - Or use Vercel CLI: `vercel env pull && npm run migrate && npm run seed`

**See `VERCEL_DEPLOY.md` for detailed instructions.**

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run migrate` - Run database migrations
- `npm run seed` - Seed database with initial data

## Project Structure

```
bellsteps/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── app/               # Authenticated app pages
│   ├── login/             # Login page
│   └── admin/             # Admin pages
├── components/            # React components
├── lib/                   # Utilities and helpers
│   ├── auth.ts           # Auth.js configuration
│   ├── db.ts             # Database connection
│   ├── actions.ts        # Server actions
│   └── types.ts          # TypeScript types
├── migrations/            # SQL migration files
├── scripts/              # Utility scripts
│   ├── migrate.ts        # Migration runner
│   ├── seed.ts           # Server action seed
│   ├── seed-cli.ts       # CLI seed script
│   └── seed-data.ts      # Seed data definitions
└── public/               # Static assets
```

## Database Schema

- **levels**: Level definitions (Bronze Star → Black Belt)
- **resources**: Videos, PDFs, printables, etc. linked to levels
- **user_progress**: User progress per level (locked/in_progress/achieved)
- **user_favourites**: User's saved resources
- **users, accounts, sessions, verification_tokens**: Auth.js tables

## Level Progression

1. Bronze Star - Bell Control
2. Silver Star - Wait & Listen
3. Gold Star - Play Together
4. White Belt - One Bell Pitch Team
5. Yellow Belt - Two Bells High/Low (So–Mi)
6. Orange Belt - Three Bells (So–Mi–La)
7. Blue Belt - Pattern Player
8. Purple Belt - Ensemble Musician
9. Red Belt - Performer
10. Black Belt - Master Bell Keeper

## Security

- All server actions verify user authentication
- Row-level access control ensures users can only access their own data
- Admin routes protected by email whitelist
- Environment variables for sensitive data

## Support

For issues or questions, please check the codebase or create an issue in your repository.

## License

Private project - All rights reserved.
