@echo off
title Create Simple Deployment Package
color 0B

echo ========================================
echo   CREATING SIMPLE DEPLOYMENT PACKAGE
echo ========================================
echo.

echo This will create 2 ZIP files ready to upload:
echo 1. campusmart-backend.zip
echo 2. campusmart-frontend.zip
echo.
pause

echo.
echo [1/4] Building frontend (PRODUCTION MODE)...
cd frontend
# Ensure we use production environment
call npx vite build --mode production
if errorlevel 1 (
    echo ERROR: Build failed!
    pause
    exit /b 1
)
cd ..

echo.
echo [2/4] Preparing backend package...
if exist temp-backend rmdir /s /q temp-backend
mkdir temp-backend
copy backend\index.js temp-backend\
copy backend\package.json temp-backend\
copy backend\db.js temp-backend\
copy backend\.env.production temp-backend\.env
copy backend\init-database.js temp-backend\
copy backend\init-database-mysql.js temp-backend\

echo.
echo [3/4] Preparing frontend package...
if exist temp-frontend rmdir /s /q temp-frontend
mkdir temp-frontend
xcopy /E /I /Y frontend\dist temp-frontend

echo RewriteEngine On > temp-frontend\.htaccess
echo RewriteCond %%{REQUEST_FILENAME} !-f >> temp-frontend\.htaccess
echo RewriteCond %%{REQUEST_FILENAME} !-d >> temp-frontend\.htaccess
echo RewriteRule ^^ index.html [L] >> temp-frontend\.htaccess

echo.
echo [4/4] Creating ZIP files...
powershell -command "Compress-Archive -Path temp-backend\* -DestinationPath campusmart-backend-live.zip -Force"
powershell -command "Compress-Archive -Path temp-frontend\* -DestinationPath campusmart-frontend-live.zip -Force"

rmdir /s /q temp-backend
rmdir /s /q temp-frontend

echo.
color 0A
echo ========================================
echo   LIVE PACKAGES CREATED!
echo ========================================
echo.
echo 1. campusmart-backend-live.zip
echo 2. campusmart-frontend-live.zip
echo.
echo These are now configured for ricoanco.co.ke
echo.
pause
