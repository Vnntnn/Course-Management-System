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
npm install --no-optional
if [ $? -ne 0 ]; then
    echo "[ERROR] Failed to install server dependencies."
    exit 1
fi
echo "[OK] Server dependencies installed."
echo ""

echo "[2/4] Setting up database..."
npx prisma migrate deploy 2>/dev/null || npx prisma generate
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
node server.js &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 2

# Start frontend (foreground)
cd client
npm run dev
