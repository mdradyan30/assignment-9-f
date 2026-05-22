# Better Auth Google OAuth Setup Verification Script (Windows PowerShell)

Write-Host "🔍 Verifying Better Auth Google OAuth Setup" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Check 1: .env.local exists
Write-Host "✓ Checking .env.local..." -ForegroundColor Green
if (-Not (Test-Path ".env.local")) {
    Write-Host "  ✗ .env.local not found" -ForegroundColor Red
    Write-Host "  → Create it with: Copy-Item .env.example .env.local" -ForegroundColor Yellow
    exit 1
}
Write-Host "  ✓ .env.local exists" -ForegroundColor Green

# Check 2: Required variables
Write-Host ""
Write-Host "✓ Checking required environment variables..." -ForegroundColor Green

$envContent = Get-Content .env.local
$requiredVars = @("BETTER_AUTH_URL", "BETTER_AUTH_SECRET", "GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "DATABASE_URL")

foreach ($var in $requiredVars) {
    $line = $envContent | Select-String "^$var="
    if ($null -eq $line) {
        Write-Host "  ✗ $var not found" -ForegroundColor Red
    } elseif ($line.Line -match "^$var=$") {
        Write-Host "  ✗ $var is empty" -ForegroundColor Red
    } else {
        Write-Host "  ✓ $var is set" -ForegroundColor Green
    }
}

# Check 3: Node modules
Write-Host ""
Write-Host "✓ Checking dependencies..." -ForegroundColor Green
if (-Not (Test-Path "node_modules")) {
    Write-Host "  ⚠ node_modules not found" -ForegroundColor Yellow
    Write-Host "  → Run: npm install" -ForegroundColor Yellow
} else {
    if (Test-Path "node_modules/better-auth") {
        Write-Host "  ✓ better-auth installed" -ForegroundColor Green
    } else {
        Write-Host "  ✗ better-auth not found" -ForegroundColor Red
        Write-Host "  → Run: npm install" -ForegroundColor Yellow
    }
}

# Check 4: API routes file
Write-Host ""
Write-Host "✓ Checking API routes..." -ForegroundColor Green
$routeFile = "src\app\api\auth\[...auth]\route.js"
if (Test-Path $routeFile) {
    Write-Host "  ✓ API route handler exists" -ForegroundColor Green
} else {
    Write-Host "  ✗ API route handler not found at $routeFile" -ForegroundColor Red
}

Write-Host ""
Write-Host "✅ Setup verification complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "1. Verify all checks above are green (✓)" -ForegroundColor White
Write-Host "2. Start the dev server: npm run dev" -ForegroundColor White
Write-Host "3. Visit http://localhost:3000/debug to check configuration" -ForegroundColor White
Write-Host "4. Try Google sign-in at http://localhost:3000/login" -ForegroundColor White
Write-Host ""
Write-Host "📚 For help, see GOOGLE_OAUTH_TROUBLESHOOTING.md" -ForegroundColor Cyan
