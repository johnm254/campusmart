@echo off
color 0A
echo.
echo ═══════════════════════════════════════════════════════════════
echo   CAMPUSMART - DEPLOY TO FIREBASE
echo   Project: campusmart-7d3d4
echo ═══════════════════════════════════════════════════════════════
echo.

echo Checking Firebase login status...
firebase projects:list >nul 2>&1
if errorlevel 1 (
    echo.
    echo ❌ Not logged in to Firebase!
    echo.
    echo Please run: firebase login
    echo.
    pause
    exit /b 1
)

echo ✅ Firebase CLI ready
echo.

echo ═══════════════════════════════════════════════════════════════
echo   STEP 1: Install Functions Dependencies
echo ═══════════════════════════════════════════════════════════════
echo.

cd functions

if not exist node_modules (
    echo Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo.
        echo ❌ Failed to install dependencies!
        cd ..
        pause
        exit /b 1
    )
    echo ✅ Dependencies installed
) else (
    echo ✅ Dependencies already installed
)

cd ..

echo.
echo ═══════════════════════════════════════════════════════════════
echo   STEP 2: Build Frontend
echo ═══════════════════════════════════════════════════════════════
echo.

cd frontend

if not exist dist (
    echo Building frontend...
    call npm run build
    if errorlevel 1 (
        echo.
        echo ❌ Frontend build failed!
        cd ..
        pause
        exit /b 1
    )
    echo ✅ Frontend built
) else (
    echo ✅ Frontend already built (using existing dist/)
    echo.
    echo To rebuild, delete frontend/dist/ and run this script again
)

cd ..

echo.
echo ═══════════════════════════════════════════════════════════════
echo   STEP 3: Deploy to Firebase
echo ═══════════════════════════════════════════════════════════════
echo.

firebase deploy

if errorlevel 1 (
    echo.
    echo ❌ Deployment failed!
    echo.
    echo Common issues:
    echo   • Check firebase.json configuration
    echo   • Ensure Firestore is enabled in Firebase Console
    echo   • Check functions/index.js for errors
    echo.
    pause
    exit /b 1
)

echo.
echo ═══════════════════════════════════════════════════════════════
echo   🎉 DEPLOYMENT SUCCESSFUL!
echo ═══════════════════════════════════════════════════════════════
echo.
echo Your app is now live!
echo.
echo URLs:
echo   • Hosting: https://campusmart-7d3d4.web.app
echo   • Hosting: https://campusmart-7d3d4.firebaseapp.com
echo   • API: https://campusmart-7d3d4.web.app/api
echo.
echo Next steps:
echo   1. Test your app at the URLs above
echo   2. Configure custom domain (campusmart.co.ke) in Firebase Console
echo   3. Update frontend/.env with production API URL
echo.
echo Firebase Console:
echo   https://console.firebase.google.com/project/campusmart-7d3d4
echo.
echo ═══════════════════════════════════════════════════════════════
pause
