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

# JWT
JWT_SECRET=tu-clave-secreta
JWT_EXPIRATION=7d

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

## 🔐 Usuario Administrador

- **Email**: admin@turnera.com
- **Password**: admin123

⚠️ Cambiar en producción

## 🧪 Probar Autenticación

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@turnera.com",
    "password": "admin123"
  }'
```

### Registrar Usuario
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "nombre": "Test User"
  }'
```

### Obtener Perfil (con token)
```bash
TOKEN="tu-token-aqui"

curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

## 📋 Verificar instalación

Prueba los endpoints:
```bash
# Listar doctores (público)
curl http://localhost:3000/api/doctores

# Listar pacientes (público)
curl http://localhost:3000/api/pacientes

# Obtener perfil (requiere token)
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer tu-token"
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

# Linting
npm run lint
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

## 📚 Documentación

- **README.md** - Guía completa del proyecto
- **AUTH_SIMPLE.md** - Guía de autenticación
- **AUTH_SIMPLIFIED.md** - Resumen de simplificación

## 🎯 Sistema de Autenticación

El sistema es **súper simple**:
- ✅ Login con email/password
- ✅ Registro de usuarios
- ✅ JWT tokens
- ✅ Protección de rutas con `@UseGuards(JwtAuthGuard)`

**Sin roles, sin permisos, sin complejidad.** Solo lo esencial.

Para proteger una ruta:
```typescript
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Post('protected')
create(@CurrentUser() user: any) {
  // Solo usuarios autenticados
}
```

¡Eso es todo! 🚀
