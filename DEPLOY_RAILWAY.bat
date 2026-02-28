@echo off
color 0A
echo.
echo ═══════════════════════════════════════════════════════════════
echo   CAMPUSMART - DEPLOY TO RAILWAY
echo ═══════════════════════════════════════════════════════════════
echo.
echo This will help you deploy your backend to Railway.
echo.
echo Prerequisites:
echo   ✓ Railway account created (railway.app)
echo   ✓ Railway CLI installed
echo   ✓ Logged in to Railway
echo.
echo ═══════════════════════════════════════════════════════════════
pause

echo.
echo ═══════════════════════════════════════════════════════════════
echo   STEP 1: Check Railway CLI
echo ═══════════════════════════════════════════════════════════════
echo.

railway --version >nul 2>&1

if errorlevel 1 (
    echo ❌ Railway CLI not installed!
    echo.
    echo Installing Railway CLI...
    call npm install -g @railway/cli
    
    if errorlevel 1 (
        echo.
        echo ❌ Failed to install Railway CLI!
        echo.
        echo Please install manually:
        echo   npm install -g @railway/cli
        echo.
        pause
        exit /b 1
    )
    
    echo ✅ Railway CLI installed!
) else (
    echo ✅ Railway CLI is installed
)

echo.
echo ═══════════════════════════════════════════════════════════════
echo   STEP 2: Login to Railway
echo ═══════════════════════════════════════════════════════════════
echo.

railway whoami >nul 2>&1

if errorlevel 1 (
    echo Please login to Railway...
    railway login
    
    if errorlevel 1 (
        echo.
        echo ❌ Login failed!
        pause
        exit /b 1
    )
)

echo ✅ Logged in to Railway

echo.
echo ═══════════════════════════════════════════════════════════════
echo   STEP 3: Initialize Railway Project
echo ═══════════════════════════════════════════════════════════════
echo.

cd backend

railway init

if errorlevel 1 (
    echo.
    echo ❌ Failed to initialize project!
    echo.
    echo You can also deploy from Railway dashboard:
    echo   1. Go to https://railway.app/dashboard
    echo   2. Click "New Project"
    echo   3. Select "Deploy from GitHub repo"
    echo.
    cd ..
    pause
    exit /b 1
)

echo.
echo ═══════════════════════════════════════════════════════════════
echo   STEP 4: Deploy to Railway
echo ═══════════════════════════════════════════════════════════════
echo.

railway up

if errorlevel 1 (
    echo.
    echo ❌ Deployment failed!
    cd ..
    pause
    exit /b 1
)

cd ..

echo.
echo ═══════════════════════════════════════════════════════════════
echo   🎉 BACKEND DEPLOYED TO RAILWAY!
echo ═══════════════════════════════════════════════════════════════
echo.
echo Next steps:
echo.
echo 1. Add PostgreSQL database:
echo    • Go to Railway dashboard
echo    • Click "New" → "Database" → "PostgreSQL"
echo.
echo 2. Configure environment variables:
echo    • Go to Variables tab
echo    • Copy from backend/.env.railway
echo.
echo 3. Get your Railway URL:
echo    • Settings → Domains → "Generate Domain"
echo    • Copy the URL (e.g., https://your-app.up.railway.app)
echo.
echo 4. Update frontend:
echo    • Edit frontend/.env.production
echo    • Set: VITE_API_URL=https://your-app.up.railway.app/api
echo    • Rebuild: cd frontend ^&^& npm run build
echo    • Redeploy: firebase deploy --only hosting
echo.
echo ═══════════════════════════════════════════════════════════════
pause
