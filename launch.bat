@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo ============================================
echo         江湖人生 - Wuxia Life Simulator
echo ============================================
echo.

REM Check if node_modules exists
if not exist "node_modules\" (
    echo [1/4] Installing dependencies...
    pnpm install
    if errorlevel 1 (
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
) else (
    echo [1/4] Dependencies already installed.
)

echo [2/4] Building shared package...
pnpm --filter @life-restart/shared build
if errorlevel 1 (
    echo ERROR: Shared package build failed
    pause
    exit /b 1
)

echo [3/4] Building electron package...
pnpm --filter @life-restart/electron build
if errorlevel 1 (
    echo ERROR: Electron package build failed
    pause
    exit /b 1
)

echo [4/4] Starting application...
echo.
echo   Vite dev server: http://localhost:5173
echo   Electron window will open automatically.
echo.

REM Kill existing vite process on port 5173
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5173 ^| findstr LISTENING 2^>nul') do (
    taskkill /F /PID %%a >nul 2>&1
)

REM Start Vite in background and Electron
start "Vite" cmd /c "pnpm --filter @life-restart/frontend dev"
timeout /t 3 /nobreak >nul
start "Electron" cmd /c "node_modules\.pnpm\electron@30.5.1\node_modules\electron\dist\electron.exe packages\electron --no-sandbox"

echo ============================================
echo   Application started!
echo   Close this window to stop Vite.
echo ============================================
pause
