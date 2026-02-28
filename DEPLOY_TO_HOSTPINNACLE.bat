@echo off
echo ========================================
echo   CAMPUSMART - HOSTPINNACLE DEPLOYMENT
echo ========================================
echo.
echo This script will:
echo   1. Test MySQL database connection
echo   2. Initialize database tables
echo   3. Start the backend server
echo.
echo Database: ricoanco_campusmart
echo User: ricoanco_campusmart
echo Domain: https://campusmart.co.ke
echo.
pause

echo.
echo ========================================
echo   STEP 1: Testing Database Connection
echo ========================================
cd backend
node test-db.js
if errorlevel 1 (
    echo.
    echo ❌ Database connection failed!
    echo Please check your HostPinnacle database settings.
    pause
    exit /b 1
)

echo.
echo ========================================
echo   STEP 2: Initializing Database Tables
echo ========================================
node init-database-mysql.js
if errorlevel 1 (
    echo.
    echo ❌ Database initialization failed!
    pause
    exit /b 1
)

echo.
echo ========================================
echo   STEP 3: Starting Backend Server
echo ========================================
echo.
echo Backend will start on port 5000
echo Press Ctrl+C to stop the server
echo.
node index.js

pause
