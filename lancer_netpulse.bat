@echo off
title NetPulse Dashboard
cd /d "%~dp0"
echo ======================================================
echo    NetPulse Dashboard - Demarrage
echo ======================================================
if not exist "node_modules" (
    echo [INFO] Installation des dependances Node.js...
    call npm install
)
if exist "server.js" (
    echo [INFO] Lancement du backend de ping en arriere-plan...
    start "NetPulse Ping Backend" cmd /k "node server.js"
    timeout /t 2 /nobreak >nul
)
echo [INFO] Demarrage du frontend Vite...
call npm run dev
pause