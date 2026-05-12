@echo off
setlocal enabledelayedexpansion
chcp 65001 >nul
cd /d "%~dp0"

echo ============================================
echo         江湖人生 - Wuxia Life Simulator
echo ============================================
echo.

REM --- Find pnpm ---
set "PNPM="
for %%p in (pnpm.cmd pnpm) do (
    where %%p >nul 2>&1 && set "PNPM=%%p" && goto :found_pnpm
)
echo [ERROR] pnpm not found. Please install pnpm first:
echo         npm install -g pnpm
pause
exit /b 1

:found_pnpm

REM --- Install ---
if not exist "node_modules\" (
    echo [1/5] Installing dependencies...
    call %PNPM% install
    if errorlevel 1 (
        echo [ERROR] Install failed
        pause
        exit /b 1
    )
) else (
    echo [1/5] Dependencies OK.
)

REM --- Build shared ---
echo [2/5] Building shared package...
call %PNPM% --filter @life-restart/shared build
if errorlevel 1 (
    echo [ERROR] Shared build failed
    pause
    exit /b 1
)

REM --- Build electron ---
echo [3/5] Building electron package...
call %PNPM% --filter @life-restart/electron build
if errorlevel 1 (
    echo [ERROR] Electron build failed
    pause
    exit /b 1
)

REM --- Rebuild native modules for Electron ---
echo [4/5] Rebuilding native modules for Electron...
npx @electron/rebuild -v 30.5.1 -m packages/electron 2>&1
if errorlevel 1 (
    echo [WARN] Some native modules may not work correctly
)

echo [5/5] Starting application...

REM --- Kill existing Vite ---
for /f "tokens=5" %%a in ('netstat -ano 2^>nul ^| findstr /r ":5173.*LISTENING"') do (
    taskkill /F /PID %%a >nul 2>&1
)

REM --- Start Vite ---
echo   Starting Vite dev server...
start "Wuxia-Vite" cmd /c "cd /d "%~dp0" && call %PNPM% --filter @life-restart/frontend dev"

REM --- Wait for Vite ---
set /a count=0
:wait_vite
timeout /t 1 /nobreak >nul
set /a count+=1
curl -s -o nul http://localhost:5173 >nul 2>&1
if errorlevel 1 (
    if !count! lss 15 goto :wait_vite
    echo [WARN] Vite may not have started in time.
) else (
    echo   Vite ready after !count!s
)

REM --- Find Electron ---
set "ELECTRON="
for /f "delims=" %%f in ('dir /s /b node_modules\electron.exe 2^>nul') do set "ELECTRON=%%f"
if "!ELECTRON!"=="" (
    for /f "delims=" %%f in ('dir /s /b node_modules\electron\dist\electron.exe 2^>nul') do set "ELECTRON=%%f"
)
if "!ELECTRON!"=="" (
    echo [ERROR] electron.exe not found. Running install script...
    for /d %%d in (node_modules\.pnpm\electron@*.*) do (
        if exist "%%d\node_modules\electron\install.js" (
            node "%%d\node_modules\electron\install.js"
        )
    )
    for /f "delims=" %%f in ('dir /s /b node_modules\electron.exe 2^>nul') do set "ELECTRON=%%f"
    if "!ELECTRON!"=="" (
        for /f "delims=" %%f in ('dir /s /b node_modules\electron\dist\electron.exe 2^>nul') do set "ELECTRON=%%f"
    )
)
echo   Electron: !ELECTRON!

REM --- Launch Electron ---
start "Wuxia-Electron" cmd /c "cd /d "%~dp0" && "!ELECTRON!" packages\electron --no-sandbox"

echo.
echo ============================================
echo   Application started!
echo   If the game window does not appear,
echo   check the Vite and Electron windows.
echo ============================================
pause
