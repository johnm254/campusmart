@echo off
color 0A
echo.
echo ═══════════════════════════════════════════════════════════════
echo   CAMPUSMART - DEPLOY FRONTEND ONLY (NO BLAZE PLAN NEEDED)
echo   Project: campusmart-7d3d4
echo ═══════════════════════════════════════════════════════════════
echo.
echo This deploys ONLY the frontend to Firebase Hosting.
echo Backend will need to be hosted elsewhere (e.g., HostPinnacle).
echo.
echo Benefits:
echo   ✓ No Blaze plan required (stays FREE)
echo   ✓ Fast global CDN for frontend
echo   ✓ Free SSL certificate
echo   ✓ Keep existing backend on HostPinnacle
echo.
echo ═══════════════════════════════════════════════════════════════
pause

echo.
echo ═══════════════════════════════════════════════════════════════
echo   STEP 1: Build Frontend
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
    echo ✅ Frontend already built
)

cd ..

echo.
echo ═══════════════════════════════════════════════════════════════
echo   STEP 2: Deploy to Firebase Hosting Only
echo ═══════════════════════════════════════════════════════════════
echo.

firebase deploy --only hosting

if errorlevel 1 (
    echo.
    echo ❌ Deployment failed!
    pause
    exit /b 1
)

echo.
echo ═══════════════════════════════════════════════════════════════
echo   🎉 FRONTEND DEPLOYED SUCCESSFULLY!
echo ═══════════════════════════════════════════════════════════════
echo.
echo Your frontend is now live at:
echo   • https://campusmart-7d3d4.web.app
echo   • https://campusmart-7d3d4.firebaseapp.com
echo.
echo ⚠️  IMPORTANT: Configure Backend URL
echo ═══════════════════════════════════════════════════════════════
echo.
echo Your frontend needs to know where the backend API is.
echo.
echo If backend is on HostPinnacle:
echo   1. Edit frontend/.env.production
echo   2. Set: VITE_API_URL=https://campusmart.co.ke/api
echo   3. Rebuild: cd frontend ^&^& npm run build ^&^& cd ..
echo   4. Redeploy: firebase deploy --only hosting
echo.
echo If backend is local:
echo   1. Start backend: cd backend ^&^& node index.js
echo   2. Frontend will use: http://localhost:5000/api
echo.
echo ═══════════════════════════════════════════════════════════════
pause
