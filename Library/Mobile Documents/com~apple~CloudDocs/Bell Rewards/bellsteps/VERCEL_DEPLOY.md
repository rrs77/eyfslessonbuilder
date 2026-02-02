# Deploying BellSteps to Vercel

## Quick Deploy Steps

### 1. Push to GitHub

```bash
cd "/Users/robreich-storer/Library/Mobile Documents/com~apple~CloudDocs/Bell Rewards/bellsteps"

# Initialize git if not already done
git init
git add .
git commit -m "Initial commit - BellSteps app"

# Create a new repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/bellsteps.git
git push -u origin main
```

### 2. Deploy to Vercel

1. Go to https://vercel.com and sign in
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js

### 3. Set Up Vercel Postgres

**In your Vercel project dashboard:**

1. Go to **Storage** tab
2. Click **Create Database** → **Postgres**
3. Vercel will automatically add `POSTGRES_URL` to your environment variables

### 4. Set Up Vercel Blob (Optional)

1. In **Storage** tab
2. Click **Create Database** → **Blob**
3. Copy the token (you'll add it as `BLOB_READ_WRITE_TOKEN`)

### 5. Configure Environment Variables

In Vercel project **Settings** → **Environment Variables**, add:

```
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=generate-a-random-secret-here-use-openssl-rand-base64-32
EMAIL_SERVER_HOST=your-smtp-host
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@example.com
EMAIL_SERVER_PASSWORD=your-password
EMAIL_FROM=noreply@bellsteps.app
POSTGRES_URL=(automatically added by Vercel Postgres)
BLOB_READ_WRITE_TOKEN=(from Vercel Blob, optional)
ADMIN_EMAILS=your-email@example.com
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 6. Run Migrations After First Deploy

After your first deployment:

**Option A: Via Vercel Dashboard**
1. Go to your project → **Settings** → **Functions**
2. Use the Vercel CLI or run migrations via API

**Option B: Via Vercel CLI** (recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link to your project
cd bellsteps
vercel link

# Run migrations
vercel env pull .env.local  # Get environment variables
npm run migrate

# Or use Vercel's database UI to run SQL directly
```

**Option C: Via Admin Page** (easiest)
1. Deploy the app
2. Visit `https://your-app.vercel.app/admin/seed`
3. Make sure your email is in `ADMIN_EMAILS`
4. Click "Run Seed Script"

### 7. Deploy!

Vercel will automatically deploy when you push to GitHub, or click **Deploy** in the dashboard.

## Post-Deployment Checklist

- [ ] Vercel Postgres database created
- [ ] Environment variables set
- [ ] Migrations run (via admin page or CLI)
- [ ] Database seeded (via `/admin/seed` page)
- [ ] Test login works
- [ ] Test accessing `/app` dashboard

## Troubleshooting

### Database Connection Issues
- Check `POSTGRES_URL` is set correctly
- Verify Vercel Postgres is running in dashboard
- Check connection string format

### Auth Issues
- Verify `NEXTAUTH_URL` matches your Vercel domain
- Check `NEXTAUTH_SECRET` is set
- For production, you'll need email configured OR use a different auth method

### Build Errors
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify TypeScript compiles without errors

## Quick Start (After Deployment)

1. Visit your Vercel URL
2. Go to `/admin/seed` (if admin email configured)
3. Run seed script to populate levels
4. Go to `/login` and sign in
5. Start using the app!
