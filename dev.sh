#!/bin/bash
# Development script to run both frontend and backend

echo "🚀 Starting Solilop Development Environment"

# Kill any existing processes
pkill -f "wrangler dev" || true
pkill -f "vite" || true

# Wait a moment
sleep 1

echo "📦 Building frontend..."
cd frontend && npm run build && cd ..

echo "⚡ Starting Cloudflare Workers backend..."
npm run dev &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

echo "✨ Backend running on http://localhost:8787"
echo "🎨 Frontend files built and served by backend"
echo ""
echo "🌐 Your app is ready at: http://localhost:8787"
echo ""
echo "Press Ctrl+C to stop all servers"

# Keep the script running
wait $BACKEND_PID