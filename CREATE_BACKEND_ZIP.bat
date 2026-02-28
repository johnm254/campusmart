@echo off
echo ========================================
echo   Creating Backend ZIP for HostPinnacle
echo ========================================
echo.
echo This will create: campusmart-backend.zip
echo.
pause

echo.
echo Creating ZIP file...
echo.

powershell -Command "Compress-Archive -Path 'backend\*' -DestinationPath 'campusmart-backend.zip' -Force"

if exist campusmart-backend.zip (
    echo.
    echo ✅ SUCCESS!
    echo.
    echo ZIP file created: campusmart-backend.zip
    echo.
    echo This file contains:
    echo   - All backend source files
    echo   - .env with MySQL credentials
    echo   - package.json
    echo   - node_modules folder
    echo.
    echo Next steps:
    echo   1. Upload campusmart-backend.zip to HostPinnacle
    echo   2. Extract it on the server
    echo   3. Run: npm install (if node_modules not included)
    echo   4. Run: node init-database-mysql.js
    echo   5. Run: node index.js
    echo.
) else (
    echo.
    echo ❌ Failed to create ZIP file
    echo.
    echo Try manually:
    echo   1. Right-click the backend folder
    echo   2. Select "Send to" ^> "Compressed (zipped) folder"
    echo.
)

pause
