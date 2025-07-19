@echo off
title Smart Resume Build Fix
color 0A
echo.
echo  ============================================
echo   SMART RESUME - BUILD FIX UTILITY
echo  ============================================
echo.

echo [1/6] Stopping Node.js processes...
taskkill /F /IM node.exe /T >nul 2>&1
if %errorlevel%==0 (
    echo       ^✓ Node.js processes stopped
) else (
    echo       - No Node.js processes running
)

echo.
echo [2/6] Cleaning build cache...
if exist .next (
    rmdir /s /q .next
    echo       ^✓ .next directory removed
) else (
    echo       - .next directory already clean
)

if exist node_modules\.cache (
    rmdir /s /q node_modules\.cache
    echo       ^✓ Cache directory removed
) else (
    echo       - Cache directory already clean
)

echo.
echo [3/6] Setting environment variables...
set NEXT_TELEMETRY_DISABLED=1
set NODE_OPTIONS=--no-deprecation --max-old-space-size=4096
echo       ^✓ Environment configured

echo.
echo [4/6] Installing dependencies...
call npm install >nul 2>&1
if %errorlevel%==0 (
    echo       ^✓ Dependencies installed
) else (
    echo       ! Error installing dependencies
)

echo.
echo [5/6] Running TypeScript check...
call npx tsc --noEmit >nul 2>&1
if %errorlevel%==0 (
    echo       ^✓ TypeScript check passed
) else (
    echo       ! TypeScript errors found (continuing...)
)

echo.
echo [6/6] Building project...
echo       Please wait...
call npm run build

if %errorlevel%==0 (
    echo.
    echo  ============================================
    echo   ^✓ BUILD SUCCESSFUL!
    echo  ============================================
    echo.
    echo   You can now run: npm run dev
    echo.
) else (
    echo.
    echo  ============================================
    echo   ! BUILD FAILED
    echo  ============================================
    echo.
    echo   Check the error messages above.
    echo   Try running this script again.
    echo.
)

echo Press any key to exit...
pause >nul