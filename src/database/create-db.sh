#!/bin/bash
# Script para crear la base de datos en Linux/Mac

# Colores para mensajes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}==================================${NC}"
echo -e "${YELLOW}Creación de Base de Datos: Turnera${NC}"
echo -e "${YELLOW}==================================${NC}"
echo ""

# Solicitar credenciales
read -p "Usuario de MySQL (default: root): " DB_USER
DB_USER=${DB_USER:-root}

read -sp "Contraseña de MySQL: " DB_PASS
echo ""

read -p "Host de MySQL (default: localhost): " DB_HOST
DB_HOST=${DB_HOST:-localhost}

read -p "Puerto de MySQL (default: 3306): " DB_PORT
DB_PORT=${DB_PORT:-3306}

echo ""
echo -e "${YELLOW}Creando base de datos...${NC}"

# Ejecutar el script SQL
if mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASS" < create-database.sql; then
    echo -e "${GREEN}✓ Base de datos creada exitosamente${NC}"
    echo ""
    echo -e "${GREEN}Usuario administrador creado:${NC}"
    echo "  Email: admin@turnera.com"
    echo "  Password: admin123"
    echo ""
    echo -e "${YELLOW}⚠️  IMPORTANTE: Cambia la contraseña del admin en producción${NC}"
    echo ""
    echo -e "${GREEN}Siguiente paso:${NC}"
    echo "1. Copia el archivo .env.example a .env"
    echo "2. Configura las credenciales en el archivo .env"
    echo "3. Ejecuta: npm install"
    echo "4. Ejecuta: npm run start:dev"
else
    echo -e "${RED}✗ Error al crear la base de datos${NC}"
    exit 1
fi
