@echo off
REM VFX Image Format Exchange Specs - Windows Start Script

echo 🚀 Starting VFX Image Format Exchange Specs...

REM Check if ports are available
echo 🔍 Checking available ports...

REM Check port 3000
netstat -an | find "3000" | find "LISTENING" >nul
if %ERRORLEVEL% EQU 0 (
    echo ❌ Frontend port 3000 is already in use. Please stop the service or change the port.
    pause
    exit /b 1
)

REM Check port 8001
netstat -an | find "8001" | find "LISTENING" >nul
if %ERRORLEVEL% EQU 0 (
    echo ❌ Backend port 8001 is already in use. Please stop the service or change the port.
    pause
    exit /b 1
)

REM Start MongoDB (if installed locally)
where mongod >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo 🗄️  Starting MongoDB...
    if not exist data\db mkdir data\db
    start /B mongod --logpath data\mongodb.log --dbpath data\db
    echo ✅ MongoDB started
) else (
    echo ℹ️  MongoDB not found locally. Make sure your MONGO_URL points to a valid instance.
)

REM Start Backend
echo 🔙 Starting backend...
cd backend

REM Activate virtual environment if it exists
if exist vfx_env\Scripts\activate.bat (
    call vfx_env\Scripts\activate.bat
)

REM Start backend server
start /B python server.py
echo ✅ Backend started

REM Wait a moment for backend to start
timeout /t 3 /nobreak >nul

REM Start Frontend
echo 🌐 Starting frontend...
cd ..\frontend
start /B yarn start
echo ✅ Frontend started

REM Display information
echo.
echo 🎉 Application started successfully!
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo 📱 Frontend:    http://localhost:3000
echo 🔗 Backend API: http://localhost:8001/api
echo 🗄️  Database:   MongoDB ^(check your MONGO_URL^)
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo 💡 Tips:
echo    • The frontend will automatically open in your browser
echo    • Check backend\.env for database configuration  
echo    • Templates are saved to your MongoDB database
echo    • Close this window to stop all services
echo.
echo ⏳ Services are running... Close this window to stop all services.
echo.

REM Keep window open
pause