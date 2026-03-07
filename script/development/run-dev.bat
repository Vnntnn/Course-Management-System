@echo off
REM Course Management System - Windows Development Build & Run Script
REM This script builds frontend and keeps dev server watching for changes

echo.
echo ========================================
echo Course Management System - Dev Mode
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed or not in PATH
    exit /b 1
)

REM Go to project root directory
cd /d "%~dp0"
cd ..\..

REM Create .env file if it doesn't exist
if not exist server\.env (
    echo Creating .env file in server folder...
    echo DATABASE_URL="file:./dev.db" > server\.env
    echo .env file created successfully!
    echo.
)

echo [1/3] Building frontend...
cd client
call npm install
call npm run build
if %errorlevel% neq 0 (
    echo Error: Frontend build failed
    exit /b 1
)
echo Frontend build completed!
echo.

cd ..
echo [2/3] Installing server dependencies...
cd server
call npm install
if %errorlevel% neq 0 (
    echo Error: Server npm install failed
    exit /b 1
)
echo Server dependencies installed!
echo.

echo [3/3] Stopping any existing Node processes on port 5000...
taskkill /F /IM node.exe >nul 2>nul
timeout /t 1 >nul

echo.
echo ========================================
echo Dev Server starting on http://localhost:5000
echo Press Ctrl+C to stop the server
echo ========================================
echo.
call npm start
