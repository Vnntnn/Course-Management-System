@echo off
setlocal enabledelayedexpansion

echo ========================================
echo   Course Management System - Setup
echo ========================================
echo.

:: Check for Node.js
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH.
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

:: Show Node version
for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo [OK] Node.js version: %NODE_VERSION%
echo.

:: Stop any running Node processes to prevent file locks
echo [INFO] Stopping any running Node processes...
taskkill /F /IM node.exe >nul 2>nul
timeout /t 2 /nobreak >nul

:: Navigate to project root
cd /d "%~dp0"

:: Check for .env file in server
if not exist "server\.env" (
    echo [INFO] Creating server .env file...
    echo DATABASE_URL="file:./dev.db" > server\.env
    echo SESSION_SECRET="your-secret-key-change-in-production" >> server\.env
    echo PORT=5000 >> server\.env
)

echo [1/4] Installing server dependencies...
cd server
call npm install --no-optional
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Failed to install server dependencies.
    pause
    exit /b 1
)
echo [OK] Server dependencies installed.
echo.

echo [2/4] Setting up database...
call npx prisma migrate deploy
if %ERRORLEVEL% neq 0 (
    echo [INFO] No migrations to deploy or fresh database. Running generate...
    call npx prisma generate
)
echo [OK] Database ready.
echo.

cd ..

echo [3/4] Installing client dependencies...
cd client
call npm install
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Failed to install client dependencies.
    pause
    exit /b 1
)
echo [OK] Client dependencies installed.
echo.

cd ..

echo [4/4] Starting servers...
echo.
echo ========================================
echo   Backend:  http://localhost:5000
echo   Frontend: http://localhost:5173
echo ========================================
echo.
echo Press Ctrl+C to stop the servers.
echo.

:: Start backend in a new window
start "Course Management - Backend" cmd /c "cd /d "%~dp0server" && node server.js"

:: Wait a moment for backend to start
timeout /t 2 /nobreak >nul

:: Start frontend in current window
cd client
call npm run dev
