@echo off
color 0A
echo.
echo ═══════════════════════════════════════════════════════════════
echo   CAMPUSMART - CREATE ZIP FILES FOR HOSTPINNACLE
echo ═══════════════════════════════════════════════════════════════
echo.
echo This will create:
echo   • campusmart-backend.zip
echo   • campusmart-frontend.zip
echo.
echo ═══════════════════════════════════════════════════════════════
echo.
pause

echo.
echo Creating ZIP files using VBScript...
echo (This works on all Windows systems without PowerShell restrictions)
echo.

cscript //nologo create-zips.vbs

echo.
echo ═══════════════════════════════════════════════════════════════
echo   CHECKING RESULTS
echo ═══════════════════════════════════════════════════════════════
echo.

if exist campusmart-backend.zip (
    echo ✅ campusmart-backend.zip created
    for %%A in (campusmart-backend.zip) do (
        set size=%%~zA
        echo    Size: %%~zA bytes
    )
) else (
    echo ❌ campusmart-backend.zip NOT created
)

echo.

if exist campusmart-frontend.zip (
    echo ✅ campusmart-frontend.zip created
    for %%A in (campusmart-frontend.zip) do (
        set size=%%~zA
        echo    Size: %%~zA bytes
    )
) else (
    echo ❌ campusmart-frontend.zip NOT created
)

echo.
echo ═══════════════════════════════════════════════════════════════
echo   UPLOAD TO HOSTPINNACLE
echo ═══════════════════════════════════════════════════════════════
echo.
echo Backend ZIP:
echo   1. Login to HostPinnacle cPanel
echo   2. Go to File Manager
echo   3. Navigate to your backend folder
echo   4. Upload campusmart-backend.zip
echo   5. Right-click → Extract
echo   6. Run: npm install
echo   7. Run: node init-database-mysql.js
echo   8. Run: node index.js
echo.
echo Frontend ZIP:
echo   1. Go to File Manager
echo   2. Navigate to public_html
echo   3. Upload campusmart-frontend.zip
echo   4. Right-click → Extract
echo   5. Ensure files are in public_html root (not subfolder)
echo.
echo ═══════════════════════════════════════════════════════════════
echo.
pause
