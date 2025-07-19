# 🚨 URGENT: Build Fix Instructions

## Terminal Is Stuck? Use These Methods

### Method 1: PowerShell Script (RECOMMENDED)
1. Open **NEW** PowerShell window
2. Navigate to project: `cd "D:\smart-ai resume\smart-ai-resume"`
3. Run: `.\fix-build.ps1`

### Method 2: Command Prompt
1. Open **NEW** Command Prompt window
2. Navigate to project: `cd "D:\smart-ai resume\smart-ai-resume"`
3. Run: `fix-build.bat`

### Method 3: Manual Commands
Open **NEW** terminal and run these one by one:

```cmd
cd "D:\smart-ai resume\smart-ai-resume"
taskkill /F /IM node.exe /T
rmdir .next /s /q 2>nul
rmdir node_modules\.cache /s /q 2>nul
npm install
set NEXT_TELEMETRY_DISABLED=1
set NODE_OPTIONS=--no-deprecation --max-old-space-size=4096
npm run build
```

### Method 4: PowerShell One-Liner
```powershell
cd "D:\smart-ai resume\smart-ai-resume"; Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force; Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue; $env:NEXT_TELEMETRY_DISABLED="1"; $env:NODE_OPTIONS="--no-deprecation --max-old-space-size=4096"; npm install; npm run build
```

## What Was Fixed

✅ **TypeScript Errors**: Added type declarations for all packages
✅ **Windows Compatibility**: Cross-platform environment variables
✅ **Memory Issues**: Increased Node.js memory limit
✅ **Cache Problems**: Automatic cache cleaning
✅ **Telemetry Conflicts**: Disabled Next.js telemetry

## Expected Result

After running any method, you should see:
```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Finalizing page optimization
```

## If Build Still Fails

1. **Delete node_modules**: `rmdir node_modules /s /q` then `npm install`
2. **Check .env.local**: Ensure all environment variables are set
3. **Restart computer**: Sometimes Windows locks files
4. **Use different terminal**: Try Git Bash or WSL

## Files That Were Modified

- ✅ `types/global.d.ts` - TypeScript declarations
- ✅ `tsconfig.json` - Include types directory
- ✅ `package.json` - Added type dependencies
- ✅ `next.config.ts` - Optimized for Windows
- ✅ Build scripts created

## Need Help?

Check `BUILD-FIX-GUIDE.md` for detailed troubleshooting.

---
**🔥 IMPORTANT: Use a FRESH terminal window - don't use the stuck one!**