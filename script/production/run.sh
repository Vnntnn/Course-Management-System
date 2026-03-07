#!/bin/bash

# Course Management System - Unix/Linux/Mac Build & Run Script

echo ""
echo "========================================"
echo "Course Management System - Build & Run"
echo "========================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed or not in PATH"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "Error: npm is not installed or not in PATH"
    exit 1
fi

# Get the directory where this script is located and go to project root
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR/../.."

# Create .env file if it doesn't exist
if [ ! -f server/.env ]; then
    echo "Creating .env file in server folder..."
    cat > server/.env << EOF
DATABASE_URL="file:./dev.db"
EOF
    echo ".env file created successfully!"
    echo ""
fi

echo "[1/4] Building frontend..."
cd client
npm install
npm run build
if [ $? -ne 0 ]; then
    echo "Error: Frontend build failed"
    exit 1
fi
echo "Frontend build completed successfully!"
echo ""

cd ..
echo "[2/4] Installing server dependencies..."
cd server
npm install
if [ $? -ne 0 ]; then
    echo "Error: Server npm install failed"
    exit 1
fi
echo "Server dependencies installed!"
echo ""

echo "[3/4] Stopping any existing Node processes on port 5000..."
pkill -f "node server.js" 2>/dev/null
sleep 1

echo "[4/4] Starting the server..."
echo ""
echo "========================================"
echo "Server is starting on http://localhost:5000"
echo "========================================"
echo ""
npm start
