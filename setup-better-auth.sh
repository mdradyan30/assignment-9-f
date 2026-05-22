#!/bin/bash

# Better Auth Setup Script for IdeaVault
# This script helps you quickly set up the authentication system

echo "🚀 Better Auth Setup for IdeaVault"
echo "=================================="
echo ""

# Check if .env.local exists
if [ -f .env.local ]; then
    echo "⚠️  .env.local already exists. Skipping creation."
else
    echo "📝 Creating .env.local from .env.example..."
    cp .env.example .env.local
    echo "✅ .env.local created. Please update it with your credentials."
fi

echo ""
echo "📦 Installing dependencies..."
npm install

echo ""
echo "🔐 Generating BETTER_AUTH_SECRET..."
SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
echo "Your secret: $SECRET"
echo "👉 Add this to .env.local as BETTER_AUTH_SECRET=$SECRET"

echo ""
echo "✨ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Open .env.local and add:"
echo "   - Your Google OAuth credentials"
echo "   - Database URL (PostgreSQL)"
echo "   - BETTER_AUTH_SECRET=$SECRET"
echo ""
echo "2. Start PostgreSQL (or use Docker)"
echo ""
echo "3. Run: npm run dev"
echo ""
echo "4. Visit http://localhost:3000/login to test"
echo ""
echo "📚 For more details, see BETTER_AUTH_SETUP.md"
