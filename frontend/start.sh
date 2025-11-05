#!/bin/bash

# CareSync Frontend Runner
# Simple script to start the React frontend

echo "🚀 Starting CareSync Frontend..."
echo ""

# Check if in correct directory
if [ ! -f "package.json" ]; then
    echo "📁 Navigating to frontend directory..."
    cd /Users/vikas/Downloads/CareSync/frontend
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

echo "✅ Starting React development server..."
echo "🌐 Frontend will open at http://localhost:3000"
echo ""
echo "📋 Make sure backend is running on http://localhost:8080"
echo ""
echo "🔑 Test Credentials:"
echo "   Admin: admin / admin123"
echo "   Doctor: doctor1 / doctor123"
echo "   Patient: patient1 / patient123"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm start

