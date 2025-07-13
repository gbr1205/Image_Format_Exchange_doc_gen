@echo off
REM VFX Image Format Exchange Specs - Windows Setup Script

echo 🚀 Setting up VFX Image Format Exchange Specs locally...

REM Check prerequisites
echo 📋 Checking prerequisites...

REM Check Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js not found. Please install Node.js ^(v16+^) from https://nodejs.org/
    pause
    exit /b 1
)

REM Check Python
where python >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Python not found. Please install Python ^(v3.8+^) from https://python.org/
    pause
    exit /b 1
)

REM Check MongoDB
where mongod >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ⚠️  MongoDB not found. Please install MongoDB from https://www.mongodb.com/try/download/community
    echo    You can also use MongoDB Atlas ^(cloud^) by updating the MONGO_URL in backend\.env
)

echo ✅ Prerequisites check completed

REM Setup Backend
echo 🔧 Setting up backend...
cd backend

REM Create virtual environment
python -m venv vfx_env
call vfx_env\Scripts\activate

REM Install Python dependencies
pip install -r requirements.txt

REM Create .env file if it doesn't exist
if not exist .env (
    echo 📝 Creating backend .env file...
    (
        echo MONGO_URL=mongodb://localhost:27017
        echo DB_NAME=vfx_specs_db
    ) > .env
    echo ✅ Backend .env created
)

echo ✅ Backend setup completed

REM Setup Frontend
echo 🔧 Setting up frontend...
cd ..\frontend

REM Install Node dependencies
call yarn install

REM Create .env file if it doesn't exist
if not exist .env (
    echo 📝 Creating frontend .env file...
    (
        echo REACT_APP_BACKEND_URL=http://localhost:8001
    ) > .env
    echo ✅ Frontend .env created
)

echo ✅ Frontend setup completed

REM Create start script
cd ..
(
    echo @echo off
    echo REM Start MongoDB ^(if installed locally^)
    echo where mongod ^>nul 2^>nul
    echo if %%ERRORLEVEL%% EQU 0 ^(
    echo     echo 🗄️  Starting MongoDB...
    echo     start mongod
    echo ^)
    echo.
    echo REM Start Backend
    echo echo 🔙 Starting backend...
    echo cd backend
    echo call vfx_env\Scripts\activate
    echo start python server.py
    echo.
    echo REM Start Frontend
    echo echo 🌐 Starting frontend...
    echo cd ..\frontend
    echo start yarn start
    echo.
    echo echo 🎉 Application started!
    echo echo 📱 Frontend: http://localhost:3000
    echo echo 🔗 Backend API: http://localhost:8001
    echo echo.
    echo echo Press any key to close this window...
    echo pause
) > start.bat

echo.
echo 🎉 Setup completed successfully!
echo.
echo 📚 Next steps:
echo 1. Start MongoDB ^(if using local instance^): mongod
echo 2. Run the application: start.bat
echo 3. Open browser to: http://localhost:3000
echo.
echo 📖 For detailed instructions, see README.md
pause