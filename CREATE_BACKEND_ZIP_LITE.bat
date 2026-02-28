@echo off
echo ========================================
echo   Creating Backend ZIP (Without node_modules)
echo ========================================
echo.
echo This creates a smaller ZIP file without node_modules.
echo You'll need to run "npm install" on HostPinnacle.
echo.
pause

echo.
echo Creating temporary folder...
if exist backend-temp rmdir /s /q backend-temp
mkdir backend-temp

echo Copying files (excluding node_modules)...
xcopy backend\*.* backend-temp\ /E /I /H /Y /EXCLUDE:exclude-node-modules.txt

echo Creating ZIP file...
powershell -Command "Compress-Archive -Path 'backend-temp\*' -DestinationPath 'campusmart-backend-lite.zip' -Force"

echo Cleaning up...
rmdir /s /q backend-temp

if exist campusmart-backend-lite.zip (
    echo.
    echo ✅ SUCCESS!
    echo.
    echo ZIP file created: campusmart-backend-lite.zip
    echo.
    echo This file contains:
    echo   - All backend source files
    echo   - .env with MySQL credentials
    echo   - package.json
    echo   - NO node_modules (smaller file)
    echo.
    echo Next steps:
    echo   1. Upload campusmart-backend-lite.zip to HostPinnacle
    echo   2. Extract it on the server
    echo   3. Run: npm install
    echo   4. Run: node init-database-mysql.js
    echo   5. Run: node index.js
    echo.
) else (
    echo.
    echo ❌ Failed to create ZIP file
    echo.
)

pause
