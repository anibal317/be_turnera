# Script de PowerShell para crear la base de datos en Windows

Write-Host "==================================" -ForegroundColor Yellow
Write-Host "Creación de Base de Datos: Turnera" -ForegroundColor Yellow
Write-Host "==================================" -ForegroundColor Yellow
Write-Host ""

# Solicitar credenciales
$DB_USER = Read-Host "Usuario de MySQL (default: root)"
if ([string]::IsNullOrEmpty($DB_USER)) { $DB_USER = "root" }

$DB_PASS = Read-Host "Contraseña de MySQL" -AsSecureString
$DB_PASS_Plain = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
    [Runtime.InteropServices.Marshal]::SecureStringToBSTR($DB_PASS)
)

$DB_HOST = Read-Host "Host de MySQL (default: localhost)"
if ([string]::IsNullOrEmpty($DB_HOST)) { $DB_HOST = "localhost" }

$DB_PORT = Read-Host "Puerto de MySQL (default: 3306)"
if ([string]::IsNullOrEmpty($DB_PORT)) { $DB_PORT = "3306" }

Write-Host ""
Write-Host "Creando base de datos..." -ForegroundColor Yellow

# Ejecutar el script SQL
$scriptPath = Join-Path $PSScriptRoot "create-database.sql"

try {
    # Construir el comando
    $mysqlCmd = "mysql -h$DB_HOST -P$DB_PORT -u$DB_USER -p$DB_PASS_Plain"
    
    # Ejecutar
    Get-Content $scriptPath | & mysql -h $DB_HOST -P $DB_PORT -u $DB_USER -p"$DB_PASS_Plain"
    
    Write-Host ""
    Write-Host "✓ Base de datos creada exitosamente" -ForegroundColor Green
    Write-Host ""
    Write-Host "Siguiente paso:" -ForegroundColor Green
    Write-Host "1. Copia el archivo .env.example a .env"
    Write-Host "2. Configura las credenciales en el archivo .env"
    Write-Host "3. Ejecuta: npm install"
    Write-Host "4. Ejecuta: npm run start:dev"
}
catch {
    Write-Host ""
    Write-Host "✗ Error al crear la base de datos" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}
