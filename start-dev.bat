@echo off
echo ========================================
echo Starting Campus Mart Development Servers
echo ========================================
echo.

echo Installing dependencies...
echo.

echo [1/4] Installing Backend Dependencies...
cd backend
call npm install
cd ..

echo.
echo [2/4] Installing Frontend Dependencies...
cd frontend
call npm install
cd ..

echo.
echo [3/4] Starting Backend Server (Port 5000)...
start "Campus Mart Backend" cmd /k "cd backend && npm start"

timeout /t 3 /nobreak >nul

echo.
echo [4/4] Starting Frontend Server (Port 5173)...
start "Campus Mart Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo Both servers are starting!
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo ========================================
echo.
echo Press any key to exit this window...
pause >nul
