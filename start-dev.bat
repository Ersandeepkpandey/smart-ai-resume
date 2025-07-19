@echo off
echo Cleaning up any running Node.js processes...
taskkill /f /im node.exe >nul 2>&1

echo Removing Next.js cache...
if exist .next rmdir /s /q .next
if exist node_modules\.cache rmdir /s /q node_modules\.cache

echo Starting development server...
set NEXT_TELEMETRY_DISABLED=1
npm run dev