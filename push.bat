@echo off
echo ========================================
echo CampusMart - Push to GitHub
echo ========================================
echo.
echo Repository: https://github.com/AliHamisi911/campus-mart
echo.

echo [1/4] Running security check...
node backend/check-secrets.js
if errorlevel 1 (
    echo.
    echo ERROR: Security check failed!
    echo Please fix the issues above before pushing.
    pause
    exit /b 1
)

echo.
echo [2/4] Checking git status...
git status

echo.
echo [3/4] Adding files...
git add .

echo.
echo [4/4] Committing...
git commit -m "Update: CampusMart platform"

echo.
echo ========================================
echo Ready to push!
echo ========================================
echo.
echo Run this command to push:
echo git push -u origin main
echo.
echo Or run: git branch -M main ^&^& git push -u origin main
echo.
pause
