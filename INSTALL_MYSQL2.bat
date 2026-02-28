@echo off
echo ========================================
echo   Installing MySQL2 Package
echo ========================================
echo.
echo This will install the mysql2 package
echo required for MySQL database connection.
echo.
pause

cd backend
echo Installing mysql2...
call npm install mysql2

if errorlevel 1 (
    echo.
    echo ❌ Installation failed!
    echo Please check your internet connection.
    pause
    exit /b 1
)

echo.
echo ✅ mysql2 installed successfully!
echo.
echo You can now run:
echo   - TEST_MYSQL_CONNECTION.bat
echo   - DEPLOY_TO_HOSTPINNACLE.bat
echo.
pause
