@echo off
REM Script para crear la base de datos en Windows

echo ==================================
echo Creacion de Base de Datos: Turnera
echo ==================================
echo.

REM Solicitar credenciales
set /p DB_USER="Usuario de MySQL (default: root): "
if "%DB_USER%"=="" set DB_USER=root

set /p DB_PASS="Contrasena de MySQL: "

set /p DB_HOST="Host de MySQL (default: localhost): "
if "%DB_HOST%"=="" set DB_HOST=localhost

set /p DB_PORT="Puerto de MySQL (default: 3306): "
if "%DB_PORT%"=="" set DB_PORT=3306

echo.
echo Creando base de datos...

REM Ejecutar el script SQL
mysql -h%DB_HOST% -P%DB_PORT% -u%DB_USER% -p%DB_PASS% < create-database.sql

if %ERRORLEVEL% EQU 0 (
    echo.
    echo [OK] Base de datos creada exitosamente
    echo.
    echo Usuario administrador creado:
    echo   Email: admin@turnera.com
    echo   Password: admin123
    echo.
    echo [ADVERTENCIA] Cambia la contraseña del admin en produccion
    echo.
    echo Siguiente paso:
    echo 1. Copia el archivo .env.example a .env
    echo 2. Configura las credenciales en el archivo .env
    echo 3. Ejecuta: npm install
    echo 4. Ejecuta: npm run start:dev
) else (
    echo.
    echo [ERROR] Error al crear la base de datos
    exit /b 1
)

pause
