Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Starting Campus Mart Development Servers" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Installing dependencies..." -ForegroundColor Yellow
Write-Host ""

Write-Host "[1/4] Installing Backend Dependencies..." -ForegroundColor Green
Set-Location backend
npm install
Set-Location ..

Write-Host ""
Write-Host "[2/4] Installing Frontend Dependencies..." -ForegroundColor Green
Set-Location frontend
npm install
Set-Location ..

Write-Host ""
Write-Host "[3/4] Starting Backend Server (Port 5000)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm start" -WindowStyle Normal

Start-Sleep -Seconds 3

Write-Host ""
Write-Host "[4/4] Starting Frontend Server (Port 5173)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev" -WindowStyle Normal

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Both servers are starting!" -ForegroundColor Green
Write-Host "Backend: http://localhost:5000" -ForegroundColor Yellow
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
