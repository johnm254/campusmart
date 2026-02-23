@echo off
echo Starting CampusMart...
echo.

echo [Backend] Starting on port 5000...
start "Backend" cmd /k "cd backend && npm start"

timeout /t 2 /nobreak >nul

echo [Frontend] Starting on port 5173...
start "Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Both servers started!
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
