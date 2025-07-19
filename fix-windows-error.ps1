# Windows EPERM Fix Script
Write-Host "=== Fixing Windows EPERM Error ===" -ForegroundColor Yellow

# Step 1: Kill all Node.js processes
Write-Host "1. Stopping all Node.js processes..." -ForegroundColor Cyan
try {
    Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
    Start-Sleep -Seconds 2
    Write-Host "   ✓ Node.js processes stopped" -ForegroundColor Green
} catch {
    Write-Host "   - No Node.js processes to stop" -ForegroundColor Gray
}

# Step 2: Remove .next directory and cache
Write-Host "2. Cleaning Next.js cache..." -ForegroundColor Cyan
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

# Step 3: Set environment variables
Write-Host "3. Setting environment variables..." -ForegroundColor Cyan
$env:NEXT_TELEMETRY_DISABLED = "1"
$env:NODE_OPTIONS = "--no-deprecation"
Write-Host "   ✓ Environment variables set" -ForegroundColor Green

# Step 4: Start development server
Write-Host "4. Starting development server..." -ForegroundColor Cyan
Write-Host "   Running: npm run dev" -ForegroundColor Gray
npm run dev