#!/bin/bash

# Better Auth Google OAuth Setup Verification Script

echo "🔍 Verifying Better Auth Google OAuth Setup"
echo "=============================================="
echo ""

# Check 1: .env.local exists
echo "✓ Checking .env.local..."
if [ ! -f .env.local ]; then
    echo "  ✗ .env.local not found"
    echo "  → Create it with: cp .env.example .env.local"
    exit 1
fi
echo "  ✓ .env.local exists"

# Check 2: Required variables
echo ""
echo "✓ Checking required environment variables..."

check_env() {
    if grep -q "^$1=" .env.local; then
        if grep "^$1=$" .env.local | grep -q "^$1=$"; then
            echo "  ✗ $1 is empty"
            return 1
        else
            echo "  ✓ $1 is set"
            return 0
        fi
    else
        echo "  ✗ $1 not found"
        return 1
    fi
}

check_env "BETTER_AUTH_URL"
check_env "BETTER_AUTH_SECRET"
check_env "GOOGLE_CLIENT_ID"
check_env "GOOGLE_CLIENT_SECRET"
check_env "DATABASE_URL"

# Check 3: Node modules
echo ""
echo "✓ Checking dependencies..."
if [ ! -d "node_modules" ]; then
    echo "  ⚠ node_modules not found"
    echo "  → Run: npm install"
else
    if [ -d "node_modules/better-auth" ]; then
        echo "  ✓ better-auth installed"
    else
        echo "  ✗ better-auth not found"
        echo "  → Run: npm install"
    fi
fi

# Check 4: Database connection
echo ""
echo "✓ Checking PostgreSQL connection..."
if command -v psql &> /dev/null; then
    DB_URL=$(grep "^DATABASE_URL=" .env.local | cut -d'=' -f2 | sed 's/"//g')
    # Extract connection info (basic check)
    if echo "$DB_URL" | grep -q "postgresql://"; then
        echo "  ✓ Database URL looks valid"
    else
        echo "  ✗ Invalid Database URL format"
    fi
else
    echo "  ⚠ psql not found (install PostgreSQL to verify connection)"
fi

echo ""
echo "✅ Setup verification complete!"
echo ""
echo "📋 Next steps:"
echo "1. Verify all checks above are green (✓)"
echo "2. Start the dev server: npm run dev"
echo "3. Visit http://localhost:3000/debug to check configuration"
echo "4. Try Google sign-in at http://localhost:3000/login"
echo ""
echo "📚 For help, see GOOGLE_OAUTH_TROUBLESHOOTING.md"
