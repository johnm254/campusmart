@echo off
color 0A
echo.
echo ═══════════════════════════════════════════════════════════════
echo   CAMPUSMART - FIREBASE DEPLOYMENT
echo ═══════════════════════════════════════════════════════════════
echo.
echo This will deploy your app to Firebase:
echo   • Frontend → Firebase Hosting
echo   • Backend → Firebase Functions
echo.
echo ═══════════════════════════════════════════════════════════════
pause

echo.
echo ═══════════════════════════════════════════════════════════════
echo   STEP 1: Building Frontend
echo ═══════════════════════════════════════════════════════════════
echo.

cd frontend
call npm run build

if errorlevel 1 (
    echo.
    echo ❌ Frontend build failed!
    echo.
    pause
    exit /b 1
)

echo.
echo ✅ Frontend built successfully!
echo.

cd ..

echo.
echo ═══════════════════════════════════════════════════════════════
echo   STEP 2: Installing Functions Dependencies
echo ═══════════════════════════════════════════════════════════════
echo.

cd functions

if not exist node_modules (
    echo Installing dependencies...
    call npm install
    
    if errorlevel 1 (
        echo.
        echo ❌ Failed to install dependencies!
        echo.
        cd ..
        pause
        exit /b 1
    )
) else (
    echo Dependencies already installed.
)

cd ..

echo.
echo ✅ Functions dependencies ready!
echo.

echo.
echo ═══════════════════════════════════════════════════════════════
echo   STEP 3: Deploying to Firebase
echo ═══════════════════════════════════════════════════════════════
echo.

firebase deploy

if errorlevel 1 (
    echo.
    echo ❌ Deployment failed!
    echo.
    echo Common issues:
    echo   • Not logged in: Run "firebase login"
    echo   • No project: Run "firebase use --add"
    echo   • Wrong project: Check .firebaserc file
    echo.
    pause
    exit /b 1
)

echo.
echo ═══════════════════════════════════════════════════════════════
echo   🎉 DEPLOYMENT SUCCESSFUL!
echo ═══════════════════════════════════════════════════════════════
echo.
echo Your app is now live on Firebase!
echo.
echo Next steps:
echo   1. Visit your Firebase Console to see the hosting URL
echo   2. Configure custom domain (campusmart.co.ke)
echo   3. Test all features
echo.
echo ═══════════════════════════════════════════════════════════════
pause
