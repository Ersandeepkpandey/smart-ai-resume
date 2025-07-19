# Build Fix Guide

## Issues Fixed

### 1. TypeScript Declaration Errors
**Problem**: Missing type definitions for third-party packages
**Solution**:
- Created `types/global.d.ts` with proper declarations
- Updated `tsconfig.json` to include types directory
- Removed `@ts-expect-error` comments

### 2. Windows Build Environment
**Problem**: EPERM errors and environment variable issues
**Solution**:
- Added `cross-env` for cross-platform compatibility
- Disabled telemetry: `NEXT_TELEMETRY_DISABLED=1`
- Created Windows-specific build scripts

### 3. Memory and Performance Issues
**Problem**: Build failures due to memory constraints
**Solution**:
- Added `NODE_OPTIONS=--max-old-space-size=4096`
- Optimized Next.js configuration
- Added cache cleaning scripts

## Quick Fix Commands

### Option 1: Run the Comprehensive Fix
```bash
fix-build.bat
```

### Option 2: Manual Fix Steps
```bash
# Stop processes
taskkill /F /IM node.exe /T

# Clean cache
rmdir .next /s /q
rmdir node_modules\.cache /s /q

# Install type definitions
npm install --save-dev @types/formidable @types/pdf-parse @types/bcryptjs

# Set environment
set NEXT_TELEMETRY_DISABLED=1
set NODE_OPTIONS=--no-deprecation --max-old-space-size=4096

# Build
npm run build
```

### Option 3: PowerShell Method
```powershell
# Clean and build
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
$env:NEXT_TELEMETRY_DISABLED = "1"
$env:NODE_OPTIONS = "--no-deprecation --max-old-space-size=4096"
npm run build
```

## Build Scripts Available

- `npm run build` - Standard build with telemetry disabled
- `npm run build:fast` - Fast build skipping analysis
- `npm run build:clean` - Clean build (removes cache first)

## Files Modified

1. **types/global.d.ts** - TypeScript declarations
2. **tsconfig.json** - Include types directory
3. **package.json** - Updated build scripts
4. **next.config.ts** - Optimized configuration
5. **fix-build.bat** - Comprehensive fix script

## Verification

After running any fix method, you should see:
```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
```

## Troubleshooting

If build still fails:
1. Delete `node_modules` and run `npm install`
2. Check for any custom code with TypeScript errors
3. Ensure all environment variables are set
4. Try running `npx tsc --noEmit` to check TypeScript issues

## Environment Variables Required

```bash
NEXT_TELEMETRY_DISABLED=1
NODE_OPTIONS=--no-deprecation --max-old-space-size=4096
TURSO_DATABASE_URL=your_database_url
TURSO_AUTH_TOKEN=your_auth_token
SENDGRID_API_KEY=your_sendgrid_key
SENDGRID_FROM_EMAIL=your_email
```