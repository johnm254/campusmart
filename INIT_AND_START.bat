@echo off
echo ========================================
echo   INITIALIZE DATABASE AND START SERVER
echo ========================================
echo.
echo This will:
echo   1. Initialize MySQL database tables
echo   2. Start the backend server
echo.
pause

cd backend

echo.
echo ========================================
echo   Initializing Database...
echo ========================================
node init-database-mysql.js

echo.
echo ========================================
echo   Starting Backend Server...
echo ========================================
echo.
echo Server will start on port 5000
echo Press Ctrl+C to stop
echo.
node index.js

pause
