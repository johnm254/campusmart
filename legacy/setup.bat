@echo off
echo ========================================
echo   CampusMart Admin Dashboard Setup
echo ========================================
echo.

echo [1/4] Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)
echo ✓ Node.js is installed

echo.
echo [2/4] Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)
echo ✓ Dependencies installed

echo.
echo [3/4] Checking environment configuration...
if not exist ".env" (
    echo WARNING: .env file not found!
    echo Creating .env from .env.example...
    copy .env.example .env
    echo.
    echo IMPORTANT: Please edit .env file and add your Supabase credentials:
    echo   - SUPABASE_URL
    echo   - SUPABASE_ANON_KEY
    echo.
    echo Get these from: https://app.supabase.com
    echo   Project Settings → API
    echo.
    pause
)
echo ✓ Environment file exists

echo.
echo [4/4] Starting server...
echo.
echo ========================================
echo   Server will start on http://localhost:3000
echo ========================================
echo.
echo NEXT STEPS:
echo 1. Open browser to http://localhost:3000
echo 2. Click "Sign in" and use Quick Login
echo 3. Click profile picture → Admin Panel
echo.
echo Press Ctrl+C to stop the server
echo.

npm start
