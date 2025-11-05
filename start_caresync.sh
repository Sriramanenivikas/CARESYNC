#!/bin/bash

# CareSync Quick Start Script
# This script starts both backend and frontend servers

echo "🚀 Starting CareSync Hospital Management System..."
echo ""

# Check if Java is installed
if ! command -v java &> /dev/null; then
    echo "❌ Java is not installed. Please install Java 17 or higher."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 14 or higher."
    exit 1
fi

echo "✅ Java version: $(java -version 2>&1 | head -n 1)"
echo "✅ Node version: $(node --version)"
echo ""

# Start Backend
echo "📦 Starting Backend Server..."
cd /Users/vikas/Downloads/CareSync
./mvnw spring-boot:run &
BACKEND_PID=$!
echo "✅ Backend started with PID: $BACKEND_PID"
echo "🌐 Backend running on http://localhost:8080"
echo ""

# Wait for backend to start
echo "⏳ Waiting for backend to start..."
sleep 10

# Start Frontend
echo "📦 Starting Frontend Server..."
cd /Users/vikas/Downloads/CareSync/frontend
npm start &
FRONTEND_PID=$!
echo "✅ Frontend started with PID: $FRONTEND_PID"
echo "🌐 Frontend running on http://localhost:3000"
echo ""

echo "✅ CareSync is now running!"
echo ""
echo "📋 Test Credentials:"
echo "   Admin:        admin / admin123"
echo "   Doctor:       doctor1 / doctor123"
echo "   Patient:      patient1 / patient123"
echo "   Receptionist: receptionist1 / receptionist123"
echo ""
echo "🌐 Open http://localhost:3000 in your browser"
echo ""
echo "To stop servers, press Ctrl+C and run:"
echo "   kill $BACKEND_PID $FRONTEND_PID"
echo ""

# Wait for user to stop
wait

