@echo off
REM Course Management System - Windows Build & Run Script

echo.
echo ========================================
echo Course Management System - Build & Run
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

echo [1/4] Building frontend...
cd client
call npm install
call npm run build
if %errorlevel% neq 0 (
    echo Error: Frontend build failed
    exit /b 1
)
echo Frontend build completed successfully!
echo.

cd ..
echo [2/4] Installing server dependencies...
cd server
call npm install
if %errorlevel% neq 0 (
    echo Error: Server npm install failed
    exit /b 1
)
echo Server dependencies installed!
echo.

echo [3/4] Stopping any existing Node processes on port 5000...
taskkill /F /IM node.exe >nul 2>nul
timeout /t 1 >nul

echo [4/4] Starting the server...
echo.
echo ========================================
echo Server is starting on http://localhost:5000
echo ========================================
echo.
call npm start

pause
