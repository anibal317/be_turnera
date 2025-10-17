# Guía Rápida de Instalación

## 🚀 Inicio Rápido (3 pasos)

### 1. Crear la base de datos

**Windows (PowerShell):**
```powershell
cd database
.\create-db.ps1
```

**Windows (CMD):**
```cmd
cd database
create-db.bat
```

**Linux/Mac:**
```bash
cd database
chmod +x create-db.sh
./create-db.sh
```

**Alternativa - Comando directo:**
```bash
mysql -u root -p < database/create-database.sql
```

### 2. Configurar variables de entorno

```bash
# Copiar el ejemplo
cp .env.example .env

# Editar .env con tus credenciales
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=tu_contraseña
DB_DATABASE=turnera
PORT=3000
```

### 3. Instalar dependencias y ejecutar

```bash
# Instalar
npm install

# Ejecutar en desarrollo
npm run start:dev
```

**✅ Listo!** La aplicación estará en: `http://localhost:3000/api`

## 📋 Verificar instalación

Prueba el endpoint de salud:
```bash
curl http://localhost:3000/api/doctores
```

## 🔧 Comandos útiles

```bash
# Ver logs en desarrollo
npm run start:dev

# Compilar para producción
npm run build

# Ejecutar en producción
npm run start:prod

# Formatear código
npm run format

# Ejecutar tests
npm run test
```

## ❓ Problemas comunes

### Error de autenticación MySQL
```sql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'tu_contraseña';
FLUSH PRIVILEGES;
```

### Puerto en uso
Cambiar `PORT` en el archivo `.env`

### Verificar que MySQL esté corriendo
```bash
# Windows
sc query mysql80

# Linux/Mac
systemctl status mysql
```

Para más detalles, ver el archivo `README.md` completo.
