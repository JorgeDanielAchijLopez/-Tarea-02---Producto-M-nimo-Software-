@echo off
title Shell Fuel Control - Entorno de Desarrollo

cd /d "%~dp0"

echo ==========================================
echo       SHELL FUEL CONTROL - DEV
echo ==========================================
echo.

echo [1/4] Verificando PostgreSQL...

docker inspect -f "{{.State.Running}}" shell_postgres 2>nul | findstr /i "true" >nul

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
echo [2/4] Limpiando procesos anteriores...

for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8000" ^| findstr "LISTENING"') do (
    taskkill /F /T /PID %%a >nul 2>&1
)

for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":4200" ^| findstr "LISTENING"') do (
    taskkill /F /T /PID %%a >nul 2>&1
)

rmdir /s /q "%~dp0backend\app\__pycache__" 2>nul

echo Procesos anteriores limpiados.

echo.
echo [3/4] Iniciando FastAPI...

start "" /B "%~dp0backend\venv\Scripts\python.exe" -m uvicorn app.main:app --app-dir "%~dp0backend" --host 127.0.0.1 --port 8000

echo Esperando al backend...

set /a intentos=0

:esperar_backend

timeout /t 1 /nobreak >nul

curl -s http://127.0.0.1:8000/health >nul 2>&1

if not errorlevel 1 goto backend_listo

set /a intentos+=1

if %intentos% GEQ 15 goto backend_error

goto esperar_backend


:backend_listo

echo FastAPI iniciado correctamente.
echo.
echo API:
echo http://127.0.0.1:8000
echo.
echo Swagger:
echo http://127.0.0.1:8000/docs
echo.

goto iniciar_frontend


:backend_error

echo.
echo ERROR: FastAPI no pudo iniciar despues de 15 segundos.
echo.
echo Prueba manualmente:
echo backend\venv\Scripts\python.exe -m uvicorn app.main:app --app-dir backend --host 127.0.0.1 --port 8000
echo.
pause
exit /b 1


:iniciar_frontend

echo [4/4] Iniciando Angular...
echo.
echo Frontend:
echo http://localhost:4200
echo.
echo ==========================================
echo     ENTORNO DE DESARROLLO INICIADO
echo ==========================================
echo.
echo Para detener el sistema ejecuta:
echo stop-dev
echo.

cd /d "%~dp0frontend"

call npx ng serve --proxy-config proxy.conf.json