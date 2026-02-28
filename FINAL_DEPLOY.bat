@echo off
color 0A
echo.
echo ═══════════════════════════════════════════════════════════════
echo   CAMPUSMART - FINAL DEPLOYMENT TO FIREBASE
echo   Project: campusmart-7d3d4
echo ═══════════════════════════════════════════════════════════════
echo.
echo This will deploy your complete app to Firebase:
echo   • Frontend (React app)
echo   • Backend (API functions)
echo   • Database (Firestore)
echo.
echo Make sure you have:
echo   ✓ Upgraded to Blaze plan
echo   ✓ Enabled Firestore database
echo.
echo ═══════════════════════════════════════════════════════════════
pause

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
        echo.
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
echo   STEP 2: Rebuild Frontend with Firebase API
echo ═══════════════════════════════════════════════════════════════
echo.

cd frontend

echo Rebuilding frontend...
call npm run build

if errorlevel 1 (
    echo.
    echo ❌ Frontend build failed!
    echo.
    cd ..
    pause
    exit /b 1
)

echo ✅ Frontend built successfully

cd ..

echo.
echo ═══════════════════════════════════════════════════════════════
echo   STEP 3: Deploy Everything to Firebase
echo ═══════════════════════════════════════════════════════════════
echo.

firebase deploy

if errorlevel 1 (
    echo.
    echo ❌ Deployment failed!
    echo.
    echo Common issues:
    echo   • Not upgraded to Blaze plan
    echo   • Firestore not enabled
    echo   • Not logged in (run: firebase login)
    echo.
    pause
    exit /b 1
)

echo.
echo ═══════════════════════════════════════════════════════════════
echo   🎉 DEPLOYMENT SUCCESSFUL!
echo ═══════════════════════════════════════════════════════════════
echo.
echo Your app is now LIVE!
echo.
echo URLs:
echo   • App: https://campusmart-7d3d4.web.app
echo   • API: https://campusmart-7d3d4.web.app/api
echo.
echo Firebase Console:
echo   https://console.firebase.google.com/project/campusmart-7d3d4
echo.
echo ═══════════════════════════════════════════════════════════════
echo   TEST YOUR APP
echo ═══════════════════════════════════════════════════════════════
echo.
echo 1. Visit: https://campusmart-7d3d4.web.app
echo 2. Register a new account
echo 3. Login
echo 4. Post a product
echo 5. Send a message
echo 6. Test admin panel
echo.
echo Everything should work with NO CORS errors!
echo.
echo ═══════════════════════════════════════════════════════════════
echo   NEXT STEPS
echo ═══════════════════════════════════════════════════════════════
echo.
echo Optional:
echo   • Add custom domain (campusmart.co.ke)
echo   • Monitor usage in Firebase Console
echo   • Set budget alerts
echo.
echo ═══════════════════════════════════════════════════════════════
pause
