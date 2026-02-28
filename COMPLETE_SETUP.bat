@echo off
color 0A
echo.
echo ═══════════════════════════════════════════════════════════════
echo   CAMPUSMART - COMPLETE AUTOMATED SETUP
echo ═══════════════════════════════════════════════════════════════
echo.
echo   Database: ricoanco_campusmart
echo   User: ricoanco_campusmart
echo   Type: MySQL (Port 3306)
echo   Domain: https://campusmart.co.ke
echo.
echo ═══════════════════════════════════════════════════════════════
echo.
echo This script will:
echo   [1] Install mysql2 package
echo   [2] Test database connection
echo   [3] Initialize all database tables
echo   [4] Start the backend server
echo.
echo Press any key to begin setup...
pause >nul

echo.
echo ═══════════════════════════════════════════════════════════════
echo   STEP 1/4: Installing MySQL2 Package
echo ═══════════════════════════════════════════════════════════════
cd backend
call npm install mysql2
if errorlevel 1 (
    echo.
    echo ❌ Failed to install mysql2
    echo Please check your internet connection and try again.
    pause
    exit /b 1
)
echo ✅ mysql2 installed successfully!

echo.
echo ═══════════════════════════════════════════════════════════════
echo   STEP 2/4: Testing Database Connection
echo ═══════════════════════════════════════════════════════════════
node test-db.js
if errorlevel 1 (
    echo.
    echo ❌ Database connection failed!
    echo.
    echo Please verify:
    echo   - Database "ricoanco_campusmart" exists on HostPinnacle
    echo   - User "ricoanco_campusmart" has access
    echo   - Password is correct: 911Hamisi.
    echo.
    pause
    exit /b 1
)
echo ✅ Database connection successful!

echo.
echo ═══════════════════════════════════════════════════════════════
echo   STEP 3/4: Initializing Database Tables
echo ═══════════════════════════════════════════════════════════════
echo.
echo Running MySQL database initialization...
echo.
node init-database-mysql.js
if errorlevel 1 (
    echo.
    echo ❌ Database initialization failed!
    echo.
    echo The backend will still start, but you may need to
    echo run init-database-mysql.js manually.
    echo.
    pause
)
echo.
echo ✅ Database initialization complete!

echo.
echo ═══════════════════════════════════════════════════════════════
echo   STEP 4/4: Starting Backend Server
echo ═══════════════════════════════════════════════════════════════
echo.
echo ✅ Setup Complete!
echo.
echo Backend server starting on port 5000...
echo API will be available at: http://localhost:5000/api
echo.
echo Press Ctrl+C to stop the server
echo.
echo ═══════════════════════════════════════════════════════════════
echo.
node index.js

pause
