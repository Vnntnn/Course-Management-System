#!/bin/bash

echo "========================================"
echo "  Course Management System - Setup"
echo "========================================"
echo ""

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js is not installed."
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v)
echo "[OK] Node.js version: $NODE_VERSION"
echo ""

# Stop any running Node processes
echo "[INFO] Stopping any running Node processes..."
pkill -f "node server.js" 2>/dev/null || true
sleep 2

# Check for .env file in server
if [ ! -f "server/.env" ]; then
    echo "[INFO] Creating server .env file..."
    cat > server/.env << EOF
DATABASE_URL="file:./dev.db"
SESSION_SECRET="your-secret-key-change-in-production"
PORT=5000
EOF
fi

echo "[1/4] Installing server dependencies..."
cd server

# If running on Linux/WSL, clean Windows-compiled native modules
if [[ "$(uname -s)" == "Linux"* ]]; then
    if [ -d "node_modules" ] && [ -f "node_modules/.package-lock.json" ]; then
        # Check if modules were compiled for a different platform
        if ! node -e "require('bcryptjs')" 2>/dev/null || ! node -e "require('@prisma/client')" 2>/dev/null; then
            echo "[INFO] Reinstalling native modules for Linux..."
            rm -rf node_modules
        fi
    fi
fi

npm install --no-optional
if [ $? -ne 0 ]; then
    echo "[ERROR] Failed to install server dependencies."
    exit 1
fi
echo "[OK] Server dependencies installed."
echo ""

echo "[2/4] Setting up database..."
npx prisma generate
npx prisma migrate deploy 2>/dev/null || echo "[INFO] No migrations to apply"
echo "[OK] Database ready."
echo ""

cd ..

echo "[3/4] Installing client dependencies..."
cd client
npm install
if [ $? -ne 0 ]; then
    echo "[ERROR] Failed to install client dependencies."
    exit 1
fi
echo "[OK] Client dependencies installed."
echo ""

cd ..

echo "[4/4] Starting servers..."
echo ""
echo "========================================"
echo "  Backend:  http://localhost:5000"
echo "  Frontend: http://localhost:5173"
echo "========================================"
echo ""
echo "Press Ctrl+C to stop the servers."
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    exit 0
}
trap cleanup SIGINT SIGTERM

# Start backend in background
cd server
echo "[INFO] Starting backend server..."
node server.js 2>&1 &
BACKEND_PID=$!
cd ..

# Wait for backend to start and verify it's running
echo "[INFO] Waiting for backend to start..."
sleep 3

if ! kill -0 $BACKEND_PID 2>/dev/null; then
    echo "[ERROR] Backend failed to start. Check for errors above."
    exit 1
fi

# Verify backend is responding
if command -v curl &> /dev/null; then
    if curl -s http://localhost:5000 > /dev/null 2>&1; then
        echo "[OK] Backend is running on http://localhost:5000"
    else
        echo "[WARN] Backend process started but not responding yet..."
    fi
fi

# Start frontend (foreground)
cd client
npm run dev
