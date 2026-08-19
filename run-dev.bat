@echo off
title Shell Fuel Control - Entorno de Desarrollo

cd /d "%~dp0"

echo ==========================================
echo       SHELL FUEL CONTROL - DEV
echo ==========================================
echo.

echo [1/3] Verificando PostgreSQL...

docker ps --format "{{.Names}}" | findstr /x "shell_postgres" >nul

if errorlevel 1 (
    echo PostgreSQL no esta activo. Iniciando Docker...
    docker compose up -d

    if errorlevel 1 (
        echo.
        echo ERROR: No se pudo iniciar PostgreSQL.
        pause
        exit /b 1
    )
) else (
    echo PostgreSQL ya esta activo.
)

echo.
echo [2/3] Iniciando FastAPI...

start "" /B "%~dp0backend\venv\Scripts\python.exe" -m uvicorn app.main:app --reload --reload-dir "%~dp0backend" --app-dir "%~dp0backend"

timeout /t 2 /nobreak >nul

echo.
echo FastAPI:
echo http://127.0.0.1:8000
echo.
echo Swagger:
echo http://127.0.0.1:8000/docs
echo.

echo [3/3] Iniciando Angular...
echo.
echo Frontend:
echo http://localhost:4200
echo.
echo ==========================================
echo     ENTORNO DE DESARROLLO INICIADO
echo ==========================================
echo.

cd /d "%~dp0frontend"
call npx ng serve --proxy-config proxy.conf.json