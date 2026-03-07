#!/bin/bash

# Course Management System - Unix/Linux/Mac Development Build & Run Script
# This script builds frontend and keeps dev server running

echo ""
echo "========================================"
echo "Course Management System - Dev Mode"
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

echo "[1/3] Building frontend..."
cd client
npm install
npm run build
if [ $? -ne 0 ]; then
    echo "Error: Frontend build failed"
    exit 1
fi
echo "Frontend build completed!"
echo ""

cd ..
echo "[2/3] Installing server dependencies..."
cd server
npm install
if [ $? -ne 0 ]; then
    echo "Error: Server npm install failed"
    exit 1
fi
echo "Server dependencies installed!"
echo ""

echo "[3/3] Stopping any existing Node processes on port 5000..."
pkill -f "node server.js" 2>/dev/null
sleep 1

echo ""
echo "========================================"
echo "Dev Server starting on http://localhost:5000"
echo "Press Ctrl+C to stop"
echo "========================================"
echo ""
npm start
