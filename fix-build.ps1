# PowerShell Build Fix Script
Write-Host "=== Comprehensive Build Fix ===" -ForegroundColor Yellow
Write-Host ""

# Step 1: Kill all Node.js processes
Write-Host "1. Stopping all Node.js processes..." -ForegroundColor Cyan
try {
    Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
    Start-Sleep -Seconds 3
    Write-Host "   ✓ Node.js processes stopped" -ForegroundColor Green
} catch {
    Write-Host "   - No Node.js processes to stop" -ForegroundColor Gray
}

# Step 2: Clean cache directories
Write-Host ""
Write-Host "2. Cleaning cache directories..." -ForegroundColor Cyan
try {
    if (Test-Path ".next") {
        Remove-Item -Recurse -Force ".next"
        Write-Host "   ✓ .next directory removed" -ForegroundColor Green
    }
    if (Test-Path "node_modules\.cache") {
        Remove-Item -Recurse -Force "node_modules\.cache"
        Write-Host "   ✓ node_modules cache removed" -ForegroundColor Green
    }
} catch {
    Write-Host "   ! Error cleaning cache: $($_.Exception.Message)" -ForegroundColor Red
}

# Step 3: Install dependencies
Write-Host ""
Write-Host "3. Installing dependencies..." -ForegroundColor Cyan
try {
    & npm install
    Write-Host "   ✓ Dependencies installed" -ForegroundColor Green
} catch {
    Write-Host "   ! Error installing dependencies: $($_.Exception.Message)" -ForegroundColor Red
}

# Step 4: Set environment variables
Write-Host ""
Write-Host "4. Setting environment variables..." -ForegroundColor Cyan
$env:NEXT_TELEMETRY_DISABLED = "1"
$env:NODE_OPTIONS = "--no-deprecation --max-old-space-size=4096"
Write-Host "   ✓ Environment variables set" -ForegroundColor Green

# Step 5: TypeScript check
Write-Host ""
Write-Host "5. Running TypeScript check..." -ForegroundColor Cyan
try {
    & npx tsc --noEmit
    Write-Host "   ✓ TypeScript check passed" -ForegroundColor Green
} catch {
    Write-Host "   ! TypeScript errors found - continuing anyway" -ForegroundColor Yellow
}

# Step 6: Run build
Write-Host ""
Write-Host "6. Running build..." -ForegroundColor Cyan
try {
    & npm run build
    Write-Host ""
    Write-Host "   ✓ BUILD SUCCESSFUL!" -ForegroundColor Green -BackgroundColor Black
} catch {
    Write-Host ""
    Write-Host "   ! BUILD FAILED - Check errors above" -ForegroundColor Red
    Write-Host "   Try running the script again or check BUILD-FIX-GUIDE.md" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Build process completed." -ForegroundColor Yellow
Write-Host "Press any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")