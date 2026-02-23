@echo off
echo ========================================
echo CampusMart - Push to GitHub
echo Repository: https://github.com/AliHamisi911/campusmart
echo ========================================
echo.

echo [1/5] Running security check...
node backend/check-secrets.js
if errorlevel 1 (
    echo.
    echo ERROR: Security check failed!
    pause
    exit /b 1
)

echo.
echo [2/5] Checking git status...
git status

echo.
echo [3/5] Adding all files...
git add .

echo.
echo [4/5] Committing...
git commit -m "Initial commit: CampusMart - Student marketplace and accommodation platform"

echo.
echo [5/5] Pushing to GitHub...
git branch -M main
git push -u origin main

echo.
echo ========================================
echo Done! Check your repository at:
echo https://github.com/AliHamisi911/campusmart
echo ========================================
pause
