@echo off
title Shell Fuel Control - Detener Entorno

cd /d "%~dp0"

echo ==========================================
echo       SHELL FUEL CONTROL - STOP
echo ==========================================
echo.

echo Deteniendo FastAPI...

for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8000" ^| findstr "LISTENING"') do (
    taskkill /F /T /PID %%a >nul 2>&1
)

echo FastAPI detenido.

echo.
echo Deteniendo Angular...

for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":4200" ^| findstr "LISTENING"') do (
    taskkill /F /T /PID %%a >nul 2>&1
)

echo Angular detenido.

echo.
echo Entorno de desarrollo detenido correctamente.
echo.

pause