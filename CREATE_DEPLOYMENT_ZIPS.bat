@echo off
color 0A
echo.
echo ═══════════════════════════════════════════════════════════════
echo   CAMPUSMART - CREATE DEPLOYMENT ZIP FILES
echo ═══════════════════════════════════════════════════════════════
echo.
echo This will create TWO ZIP files:
echo   1. campusmart-backend.zip  (Backend with node_modules)
echo   2. campusmart-frontend.zip (Frontend dist folder)
echo.
echo ═══════════════════════════════════════════════════════════════
pause

echo.
echo ═══════════════════════════════════════════════════════════════
echo   Creating Backend ZIP...
echo ═══════════════════════════════════════════════════════════════
echo.

powershell -Command "Compress-Archive -Path 'backend\*' -DestinationPath 'campusmart-backend.zip' -Force"

if exist campusmart-backend.zip (
    echo ✅ Backend ZIP created successfully!
    for %%A in (campusmart-backend.zip) do echo    Size: %%~zA bytes
) else (
    echo ❌ Failed to create backend ZIP
)

echo.
echo ═══════════════════════════════════════════════════════════════
echo   Creating Frontend ZIP...
echo ═══════════════════════════════════════════════════════════════
echo.

powershell -Command "Compress-Archive -Path 'frontend\dist\*' -DestinationPath 'campusmart-frontend.zip' -Force"

if exist campusmart-frontend.zip (
    echo ✅ Frontend ZIP created successfully!
    for %%A in (campusmart-frontend.zip) do echo    Size: %%~zA bytes
) else (
    echo ❌ Failed to create frontend ZIP
)

echo.
echo ═══════════════════════════════════════════════════════════════
echo   DEPLOYMENT FILES READY!
echo ═══════════════════════════════════════════════════════════════
echo.

if exist campusmart-backend.zip (
    echo ✅ campusmart-backend.zip
    echo    Upload to: HostPinnacle server backend folder
    echo    Then run: npm install (if needed)
    echo              node init-database-mysql.js
    echo              node index.js
    echo.
)

if exist campusmart-frontend.zip (
    echo ✅ campusmart-frontend.zip
    echo    Upload to: HostPinnacle public_html folder
    echo    Extract all files to public_html root
    echo.
)

echo ═══════════════════════════════════════════════════════════════
echo.
echo Next Steps:
echo   1. Upload campusmart-backend.zip to HostPinnacle
echo   2. Extract backend files on server
echo   3. Upload campusmart-frontend.zip to HostPinnacle
echo   4. Extract frontend files to public_html
echo   5. Initialize database: node init-database-mysql.js
echo   6. Start backend: node index.js
echo   7. Visit: https://campusmart.co.ke
echo.
echo ═══════════════════════════════════════════════════════════════
pause
