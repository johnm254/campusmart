@echo off
echo ========================================
echo   TESTING MYSQL DATABASE CONNECTION
echo ========================================
echo.
echo Database: ricoanco_campusmart
echo User: ricoanco_campusmart
echo Host: localhost
echo Port: 3306
echo.
echo Starting test...
echo.

cd backend
node test-db.js

echo.
echo ========================================
echo   Test Complete
echo ========================================
pause
