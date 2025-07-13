#!/bin/bash

# VFX Image Format Exchange Specs - Start Script
# Starts all services for local development

echo "🚀 Starting VFX Image Format Exchange Specs..."

# Function to check if port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo "⚠️  Port $1 is already in use"
        return 1
    fi
    return 0
}

# Check if ports are available
echo "🔍 Checking available ports..."
if ! check_port 3000; then
    echo "❌ Frontend port 3000 is busy. Please stop the service or change the port."
    exit 1
fi

if ! check_port 8001; then
    echo "❌ Backend port 8001 is busy. Please stop the service or change the port."
    exit 1
fi

# Start MongoDB (if installed locally)
if command -v mongod &> /dev/null; then
    echo "🗄️  Starting MongoDB..."
    # Create data directory if it doesn't exist
    mkdir -p ./data/db
    mongod --fork --logpath ./data/mongodb.log --dbpath ./data/db >/dev/null 2>&1 &
    MONGO_PID=$!
    echo "✅ MongoDB started (PID: $MONGO_PID)"
else
    echo "ℹ️  MongoDB not found locally. Make sure your MONGO_URL points to a valid instance."
fi

# Start Backend
echo "🔙 Starting backend..."
cd backend

# Activate virtual environment if it exists
if [ -d "vfx_env" ]; then
    source vfx_env/bin/activate
fi

# Start backend server
python server.py &
BACKEND_PID=$!
echo "✅ Backend started (PID: $BACKEND_PID)"

# Wait a moment for backend to start
sleep 3

# Start Frontend
echo "🌐 Starting frontend..."
cd ../frontend
yarn start &
FRONTEND_PID=$!
echo "✅ Frontend started (PID: $FRONTEND_PID)"

# Display information
echo ""
echo "🎉 Application started successfully!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📱 Frontend:    http://localhost:3000"
echo "🔗 Backend API: http://localhost:8001/api"
echo "🗄️  Database:   MongoDB (check your MONGO_URL)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "💡 Tips:"
echo "   • The frontend will automatically open in your browser"
echo "   • Check backend/.env for database configuration"
echo "   • Templates are saved to your MongoDB database"
echo "   • Press Ctrl+C to stop all services"
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down services..."
    
    # Kill frontend
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null
        echo "   Frontend stopped"
    fi
    
    # Kill backend
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null
        echo "   Backend stopped"
    fi
    
    # Kill MongoDB if we started it
    if [ ! -z "$MONGO_PID" ]; then
        kill $MONGO_PID 2>/dev/null
        echo "   MongoDB stopped"
    fi
    
    echo "✅ All services stopped"
    exit 0
}

# Trap Ctrl+C to cleanup
trap cleanup SIGINT SIGTERM

# Wait for services (this keeps the script running)
echo "⏳ Services running... Press Ctrl+C to stop"
wait