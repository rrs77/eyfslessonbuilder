# 🚀 Deploy to Vercel NOW - Quick Guide

## Step 1: Push to GitHub (if not already)

```bash
cd "/Users/robreich-storer/Library/Mobile Documents/com~apple~CloudDocs/Bell Rewards/bellsteps"

# Check if you have uncommitted changes
git status

# Add and commit everything
git add .
git commit -m "Ready for Vercel deployment"

# Push to GitHub (if you have a remote)
git push
```

**If you don't have a GitHub repo yet:**
1. Go to https://github.com/new
2. Create a new repository called "bellsteps"
3. Then run:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/bellsteps.git
   git push -u origin main
   ```

## Step 2: Deploy to Vercel

1. **Go to https://vercel.com** and sign in (use GitHub)

2. **Click "Add New Project"**

3. **Import your GitHub repository:**
   - Select "bellsteps" from your repos
   - Click "Import"

4. **Vercel will auto-detect Next.js** - just click "Deploy"

## Step 3: Set Up Database (After First Deploy)

1. **In your Vercel project dashboard:**
   - Go to **Storage** tab
   - Click **Create Database** → **Postgres**
   - This automatically adds `POSTGRES_URL` to your env vars

2. **Add Environment Variables:**
   Go to **Settings** → **Environment Variables** and add:

   ```
   NEXTAUTH_URL=https://your-app-name.vercel.app
   NEXTAUTH_SECRET=(generate with: openssl rand -base64 32)
   ADMIN_EMAILS=your-email@example.com
   ```

   **For email (optional - you can skip for now):**
   ```
   EMAIL_SERVER_HOST=smtp.example.com
   EMAIL_SERVER_PORT=587
   EMAIL_SERVER_USER=your-email@example.com
   EMAIL_SERVER_PASSWORD=your-password
   EMAIL_FROM=noreply@bellsteps.app
   ```

3. **Redeploy** after adding env vars (Vercel will auto-redeploy)

## Step 4: Run Migrations & Seed

**Easiest way - Use the Admin Page:**

1. Visit: `https://your-app-name.vercel.app/admin/seed`
2. Make sure your email is in `ADMIN_EMAILS` env var
3. Click "Run Seed Script"
4. Done! ✅

**Alternative - Use Vercel CLI:**
```bash
npm i -g vercel
vercel login
cd bellsteps
vercel link
vercel env pull .env.local
npm run migrate
npm run seed
```

## Step 5: Test!

1. Visit your Vercel URL: `https://your-app-name.vercel.app`
2. Go to `/login`
3. Use "Dev Login" (if in development) or sign in with email
4. You should see the dashboard with all 10 bell levels!

## That's It! 🎉

Your app is now live on Vercel. The database will be set up automatically, and you can seed it via the admin page.

## Need Help?

- Check build logs in Vercel dashboard if deployment fails
- Make sure all env vars are set correctly
- Verify PostgreSQL is created in Storage tab
