@echo off
echo === Windows EPERM Fix ===
echo.

echo 1. Killing Node.js processes...
taskkill /F /IM node.exe /T >nul 2>&1
if %errorlevel%==0 (
    echo    ^✓ Node.js processes stopped
) else (
    echo    - No Node.js processes running
)

echo.
echo 2. Cleaning cache directories...
if exist .next (
    rmdir /s /q .next
    echo    ^✓ .next directory removed
)
if exist node_modules\.cache (
    rmdir /s /q node_modules\.cache
    echo    ^✓ Cache directory removed
)

echo.
echo 3. Setting environment variables...
set NEXT_TELEMETRY_DISABLED=1
set NODE_OPTIONS=--no-deprecation
echo    ^✓ Environment variables set

echo.
echo 4. Starting development server...
npm run dev