@echo off
cd /d "%~dp0"

echo ============================================
echo   Wuxia Life Simulator
echo ============================================
echo.

REM Find pnpm
set PNPM=
where pnpm >nul 2>&1
if %ERRORLEVEL% EQU 0 set PNPM=pnpm
where pnpm.cmd >nul 2>&1
if %ERRORLEVEL% EQU 0 set PNPM=pnpm.cmd
if "%PNPM%"=="" (
    echo [ERROR] pnpm not found.
    echo Run: npm install -g pnpm
    pause
    exit /b 1
)

REM Install
if not exist node_modules\ (
    echo [1/5] Installing dependencies...
    call %PNPM% install
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Install failed
        pause
        exit /b 1
    )
) else (
    echo [1/5] Dependencies OK.
)

REM Build shared
echo [2/5] Building shared...
call %PNPM% --filter "@life-restart/shared" build
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Shared build failed
    pause
    exit /b 1
)

REM Build electron
echo [3/5] Building electron...
call %PNPM% --filter "@life-restart/electron" build
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Electron build failed
    pause
    exit /b 1
)

REM Rebuild native for Electron
echo [4/5] Rebuilding native modules for Electron...
call npx @electron/rebuild -v 30.5.1 -m packages/electron
if %ERRORLEVEL% NEQ 0 (
    echo [WARN] electron-rebuild had issues, trying to continue...
)

REM Kill old Vite
echo [5/5] Starting application...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5173" ^| findstr "LISTENING" 2^>nul') do (
    taskkill /F /PID %%a >nul 2>&1
)

REM Start Vite
echo Starting Vite dev server...
start "Vite" /min cmd /c "cd /d %~dp0 && %PNPM% --filter "@life-restart/frontend" dev"

REM Wait for Vite
echo Waiting for Vite to be ready...
set COUNT=0
:wait_loop
timeout /t 1 /nobreak >nul
set /a COUNT=COUNT+1
curl -s -o nul http://localhost:5173 >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    if %COUNT% LSS 15 goto :wait_loop
    echo [WARN] Vite might not be ready after 15s
) else (
    echo Vite ready.
)

REM Find electron.exe
set ELECTRON_PATH=
for /f "delims=" %%f in ('dir /s /b node_modules\electron\dist\electron.exe 2^>nul') do set ELECTRON_PATH=%%f
if "%ELECTRON_PATH%"=="" (
    for /f "delims=" %%f in ('dir /s /b node_modules\.pnpm\electron@*\node_modules\electron\dist\electron.exe 2^>nul') do set ELECTRON_PATH=%%f
)
if "%ELECTRON_PATH%"=="" (
    for /f "delims=" %%f in ('dir /s /b node_modules\electron.exe 2^>nul') do set ELECTRON_PATH=%%f
)

if "%ELECTRON_PATH%"=="" (
    echo [ERROR] electron.exe not found.
    echo Trying to run Electron install script...
    for /d %%d in (node_modules\.pnpm\electron@*) do (
        if exist "%%d\node_modules\electron\install.js" (
            node "%%d\node_modules\electron\install.js"
        )
    )
    for /f "delims=" %%f in ('dir /s /b node_modules\electron\dist\electron.exe 2^>nul') do set ELECTRON_PATH=%%f
    if "%ELECTRON_PATH%"=="" (
        for /f "delims=" %%f in ('dir /s /b node_modules\.pnpm\electron@*\node_modules\electron\dist\electron.exe 2^>nul') do set ELECTRON_PATH=%%f
    )
)

if "%ELECTRON_PATH%"=="" (
    echo [ERROR] Cannot find electron.exe. Please reinstall: pnpm install
    pause
    exit /b 1
)

echo Electron found: %ELECTRON_PATH%
echo Launching application...

start "Game" /min cmd /c "cd /d %~dp0 && "%ELECTRON_PATH%" packages\electron --no-sandbox"

echo.
echo ============================================
echo   Done! Game window should open shortly.
echo ============================================
pause
