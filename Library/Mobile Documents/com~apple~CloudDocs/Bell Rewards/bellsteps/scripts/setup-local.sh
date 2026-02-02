#!/bin/bash

echo "🚀 Setting up BellSteps for local development..."
echo ""

# Check if PostgreSQL is running
if ! pg_isready -q; then
    echo "⚠️  PostgreSQL is not running"
    echo "Starting PostgreSQL..."
    brew services start postgresql@14 2>/dev/null || brew services start postgresql 2>/dev/null
    sleep 2
fi

# Create database if it doesn't exist
echo "📦 Creating database 'bellsteps'..."
createdb bellsteps 2>/dev/null && echo "✓ Database created" || echo "⚠️  Database may already exist"

# Update .env.local with local connection
echo ""
echo "📝 Updating .env.local with local Postgres connection..."
POSTGRES_URL="postgresql://localhost:5432/bellsteps"

# Check if .env.local exists and update POSTGRES_URL
if [ -f .env.local ]; then
    if grep -q "POSTGRES_URL=" .env.local; then
        # Use sed to replace the line (works on macOS)
        sed -i '' "s|POSTGRES_URL=.*|POSTGRES_URL=$POSTGRES_URL|" .env.local
        echo "✓ Updated POSTGRES_URL in .env.local"
    else
        echo "POSTGRES_URL=$POSTGRES_URL" >> .env.local
        echo "✓ Added POSTGRES_URL to .env.local"
    fi
else
    echo "⚠️  .env.local not found. Please create it first."
    exit 1
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Run migrations: npm run migrate"
echo "  2. Seed database: npm run seed"
echo "  3. Start dev server: npm run dev"
