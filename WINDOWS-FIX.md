# Windows EPERM Fix Guide

If you're experiencing `EPERM: operation not permitted, open '..\.next\trace'` errors on Windows, here are multiple solutions:

## Quick Fix Options

### Option 1: Use the Clean Development Script
```bash
npm run dev:clean
```

### Option 2: Use the Windows Batch File
```bash
start-dev.bat
```

### Option 3: Manual Cleanup (if needed)
```bash
# Stop all Node.js processes
taskkill /f /im node.exe

# Remove Next.js cache
rmdir .next /s /q
rmdir node_modules\.cache /s /q

# Start development server
npm run dev
```

### Option 4: PowerShell Method
```powershell
# Stop processes
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force

# Clean cache
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force node_modules\.cache -ErrorAction SilentlyContinue

# Start server
npm run dev
```

## Root Cause
The error occurs because:
1. Next.js tries to write trace files on Windows
2. Windows has stricter file permissions than Unix systems
3. Previous Node.js processes may hold file locks

## Applied Fixes
1. **Disabled telemetry**: `NEXT_TELEMETRY_DISABLED=1`
2. **Updated Next.js config**: Added `telemetry: { disabled: true }`
3. **Cross-platform compatibility**: Using `cross-env` and `rimraf`
4. **Clean startup scripts**: `dev:clean` and `start-dev.bat`

## Verification
After running any of the above methods, you should see:
```
✓ Ready in 2s
```
Without any EPERM errors.

## Alternative Development Commands
- `npm run dev` - Standard development server
- `npm run dev:turbo` - With Turbopack (faster builds)
- `npm run dev:clean` - Clean startup (recommended for Windows)