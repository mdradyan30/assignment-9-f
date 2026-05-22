# Better Auth Setup Script for IdeaVault (Windows PowerShell)
# This script helps you quickly set up the authentication system

Write-Host "🚀 Better Auth Setup for IdeaVault" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env.local exists
if (Test-Path .env.local) {
    Write-Host "⚠️  .env.local already exists. Skipping creation." -ForegroundColor Yellow
} else {
    Write-Host "📝 Creating .env.local from .env.example..." -ForegroundColor Green
    Copy-Item .env.example .env.local
    Write-Host "✅ .env.local created. Please update it with your credentials." -ForegroundColor Green
}

Write-Host ""
Write-Host "📦 Installing dependencies..." -ForegroundColor Green
npm install

Write-Host ""
Write-Host "🔐 Generating BETTER_AUTH_SECRET..." -ForegroundColor Green
$SECRET = node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
Write-Host "Your secret: $SECRET" -ForegroundColor Yellow
Write-Host "👉 Add this to .env.local as BETTER_AUTH_SECRET=$SECRET" -ForegroundColor Cyan

Write-Host ""
Write-Host "✨ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "1. Open .env.local and add:" -ForegroundColor White
Write-Host "   - Your Google OAuth credentials" -ForegroundColor White
Write-Host "   - Database URL (PostgreSQL)" -ForegroundColor White
Write-Host "   - BETTER_AUTH_SECRET=$SECRET" -ForegroundColor White
Write-Host ""
Write-Host "2. Start PostgreSQL (or use Docker)" -ForegroundColor White
Write-Host ""
Write-Host "3. Run: npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "4. Visit http://localhost:3000/login to test" -ForegroundColor White
Write-Host ""
Write-Host "📚 For more details, see BETTER_AUTH_SETUP.md" -ForegroundColor Cyan
