@echo off
echo === Testing Build ===
echo.

echo 1. Cleaning old build...
if exist .next rmdir /s /q .next
echo    ✓ .next directory cleaned

echo.
echo 2. Setting environment variables...
set NEXT_TELEMETRY_DISABLED=1
set NODE_OPTIONS=--no-deprecation
echo    ✓ Environment variables set

echo.
echo 3. Running build...
npm run build

echo.
echo 4. Build completed. Check output above for any errors.
pause