# Troubleshooting Guide

## Browser Extension Errors (Harmless - IGNORE THESE)

If you see errors like:
- `background.js:1 Uncaught (in promise)`
- `chrome-extension://`
- `Unchecked runtime.lastError`

**These are from browser extensions and can be completely ignored.** They don't affect the app.

## How to See Real App Errors

1. Open DevTools (F12)
2. Go to Console tab
3. Click the filter icon (funnel)
4. Add filter: `-background.js -chrome-extension`
5. This will hide extension errors and show only app errors

## Common Issues

### 1. Server Error / Login Doesn't Work

**Cause:** PostgreSQL database not running

**Fix:**
```bash
# Start PostgreSQL
brew services start postgresql@14

# Wait a few seconds, then verify
pg_isready

# Run migrations
npm run migrate

# Seed database
npm run seed

# Restart dev server
npm run dev
```

### 2. "Database connection failed" Error

**Cause:** PostgreSQL not running or wrong connection string

**Fix:**
1. Check PostgreSQL is running: `pg_isready`
2. Verify `.env.local` has correct `POSTGRES_URL`
3. For local: `POSTGRES_URL=postgresql://localhost:5432/bellsteps`

### 3. Login Button Does Nothing

**Check:**
1. Open browser console (F12)
2. Filter out extension errors
3. Look for errors mentioning:
   - "database"
   - "POSTGRES"
   - "connection"
   - "ECONNREFUSED"

**Fix:** Start PostgreSQL and run migrations (see above)

### 4. "Module not found: nodemailer"

**Fix:** Already fixed - Email provider is now optional

## Testing Login

1. Go to http://localhost:3000/login
2. Enter any email (e.g., `teacher@school.com`)
3. Click "Sign In (Dev Mode)"
4. Check:
   - Toast message appears?
   - Redirects to /app?
   - Any errors in filtered console?

## Still Having Issues?

Check your terminal where `npm run dev` is running - look for:
- Database connection errors
- Server errors
- Any red error messages

Share those errors (not browser extension errors) for help.
