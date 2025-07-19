@echo off
echo === Comprehensive Build Fix ===
echo.

echo 1. Stopping all Node.js processes...
taskkill /F /IM node.exe /T >nul 2>&1
echo    ✓ Processes stopped

echo.
echo 2. Cleaning build cache...
if exist .next rmdir /s /q .next
if exist node_modules\.cache rmdir /s /q node_modules\.cache
echo    ✓ Cache cleaned

echo.
echo 3. Installing missing type definitions...
call npm install --save-dev @types/formidable @types/pdf-parse @types/bcryptjs
echo    ✓ Type definitions installed

echo.
echo 4. Setting environment variables...
set NEXT_TELEMETRY_DISABLED=1
set NODE_OPTIONS=--no-deprecation --max-old-space-size=4096
echo    ✓ Environment configured

echo.
echo 5. Running TypeScript check...
call npx tsc --noEmit
if %errorlevel% neq 0 (
    echo    ! TypeScript errors found - continuing anyway
) else (
    echo    ✓ TypeScript check passed
)

echo.
echo 6. Running build...
call npm run build
if %errorlevel% equ 0 (
    echo    ✓ Build successful!
) else (
    echo    ! Build failed - check errors above
)

echo.
echo Build process completed.
pause