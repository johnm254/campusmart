@echo off
color 0A
echo.
echo ═══════════════════════════════════════════════════════════════
echo   CAMPUSMART - FIREBASE QUICK START
echo ═══════════════════════════════════════════════════════════════
echo.
echo This will set up Firebase for your project.
echo.
echo ═══════════════════════════════════════════════════════════════
pause

echo.
echo ═══════════════════════════════════════════════════════════════
echo   STEP 1: Check Firebase CLI
echo ═══════════════════════════════════════════════════════════════
echo.

firebase --version >nul 2>&1

if errorlevel 1 (
    echo ❌ Firebase CLI not installed!
    echo.
    echo Installing Firebase CLI...
    call npm install -g firebase-tools
    
    if errorlevel 1 (
        echo.
        echo ❌ Failed to install Firebase CLI!
        echo.
        echo Please install manually:
        echo   npm install -g firebase-tools
        echo.
        pause
        exit /b 1
    )
    
    echo.
    echo ✅ Firebase CLI installed!
) else (
    echo ✅ Firebase CLI is installed
)

echo.
echo ═══════════════════════════════════════════════════════════════
echo   STEP 2: Login to Firebase
echo ═══════════════════════════════════════════════════════════════
echo.
echo Opening browser for Firebase login...
echo.

firebase login

if errorlevel 1 (
    echo.
    echo ❌ Login failed!
    echo.
    pause
    exit /b 1
)

echo.
echo ✅ Logged in successfully!
echo.

echo.
echo ═══════════════════════════════════════════════════════════════
echo   STEP 3: Select Firebase Project
echo ═══════════════════════════════════════════════════════════════
echo.
echo Choose your Firebase project:
echo.

firebase use --add

if errorlevel 1 (
    echo.
    echo ❌ Failed to select project!
    echo.
    echo Make sure you have created a project at:
    echo https://console.firebase.google.com
    echo.
    pause
    exit /b 1
)

echo.
echo ✅ Project selected!
echo.

echo.
echo ═══════════════════════════════════════════════════════════════
echo   STEP 4: Install Functions Dependencies
echo ═══════════════════════════════════════════════════════════════
echo.

cd functions
call npm install

if errorlevel 1 (
    echo.
    echo ❌ Failed to install dependencies!
    echo.
    cd ..
    pause
    exit /b 1
)

cd ..

echo.
echo ✅ Dependencies installed!
echo.

echo.
echo ═══════════════════════════════════════════════════════════════
echo   🎉 FIREBASE SETUP COMPLETE!
echo ═══════════════════════════════════════════════════════════════
echo.
echo You're ready to deploy!
echo.
echo Next steps:
echo   1. Build frontend: cd frontend ^&^& npm run build
echo   2. Deploy: firebase deploy
echo   OR
echo   3. Run: DEPLOY_FIREBASE.bat (does both automatically)
echo.
echo ═══════════════════════════════════════════════════════════════
pause
