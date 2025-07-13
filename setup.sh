#!/bin/bash

# VFX Image Format Exchange Specs - Local Setup Script
# This script sets up the application for local development

echo "🚀 Setting up VFX Image Format Exchange Specs locally..."

# Check prerequisites
echo "📋 Checking prerequisites..."

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js (v16+) from https://nodejs.org/"
    exit 1
fi

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 not found. Please install Python (v3.8+) from https://python.org/"
    exit 1
fi

# Check MongoDB
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB not found. Please install MongoDB from https://www.mongodb.com/try/download/community"
    echo "   You can also use MongoDB Atlas (cloud) by updating the MONGO_URL in backend/.env"
fi

echo "✅ Prerequisites check completed"

# Setup Backend
echo "🔧 Setting up backend..."
cd backend

# Create virtual environment (optional but recommended)
python3 -m venv vfx_env
source vfx_env/bin/activate  # On Windows: vfx_env\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating backend .env file..."
    cat > .env << EOF
MONGO_URL=mongodb://localhost:27017
DB_NAME=vfx_specs_db
EOF
    echo "✅ Backend .env created"
fi

echo "✅ Backend setup completed"

# Setup Frontend
echo "🔧 Setting up frontend..."
cd ../frontend

# Install Node dependencies
yarn install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating frontend .env file..."
    cat > .env << EOF
REACT_APP_BACKEND_URL=http://localhost:8001
EOF
    echo "✅ Frontend .env created"
fi

echo "✅ Frontend setup completed"

# Create start script
cd ..
cat > start.sh << 'EOF'
#!/bin/bash

# Start MongoDB (if installed locally)
if command -v mongod &> /dev/null; then
    echo "🗄️  Starting MongoDB..."
    mongod --fork --logpath /tmp/mongodb.log --dbpath ./data/db &
fi

# Start Backend
echo "🔙 Starting backend..."
cd backend
source vfx_env/bin/activate  # On Windows: vfx_env\Scripts\activate
python server.py &
BACKEND_PID=$!

# Start Frontend
echo "🌐 Starting frontend..."
cd ../frontend
yarn start &
FRONTEND_PID=$!

echo "🎉 Application started!"
echo "📱 Frontend: http://localhost:3000"
echo "🔗 Backend API: http://localhost:8001"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for user to stop
wait $FRONTEND_PID
kill $BACKEND_PID
EOF

chmod +x start.sh

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📚 Next steps:"
echo "1. Start MongoDB (if using local instance): mongod"
echo "2. Run the application: ./start.sh"
echo "3. Open browser to: http://localhost:3000"
echo ""
echo "📖 For detailed instructions, see README.md"