# Sistema de Autenticación Simplificado

Sistema de autenticación básico con JWT. Sin roles, sin permisos complejos, solo lo esencial.

## 🔐 Funcionalidades

- ✅ Registro de usuarios
- ✅ Login con email/password
- ✅ JWT tokens
- ✅ Protección básica de rutas

## 📋 Endpoints

### POST /api/auth/register
Registrar nuevo usuario.

```json
{
  "email": "usuario@example.com",
  "password": "password123",
  "nombre": "Juan Pérez" // opcional
}
```

**Respuesta:**
```json
{
  "access_token": "eyJhbGc...",
  "user": {
    "id": 1,
    "email": "usuario@example.com",
    "nombre": "Juan Pérez"
  }
}
```

### POST /api/auth/login
Iniciar sesión.

```json
{
  "email": "admin@turnera.com",
  "password": "admin123"
}
```

**Respuesta:**
```json
{
  "access_token": "eyJhbGc...",
  "user": {
    "id": 1,
    "email": "admin@turnera.com",
    "nombre": "Administrador"
  }
}
```

### GET /api/auth/me
Obtener información del usuario autenticado (requiere token).

**Headers:**
```
Authorization: Bearer tu-token-aqui
```

**Respuesta:**
```json
{
  "id": 1,
  "email": "usuario@example.com"
}
```

## 🔒 Proteger Rutas

Para proteger una ruta, usa el guard `JwtAuthGuard`:

```typescript
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { CurrentUser } from '@/modules/auth/decorators/current-user.decorator';

@Controller('turnos')
export class TurnoController {
  
  // Ruta pública - sin guard
  @Get()
  findAll() {
    return this.turnoService.findAll();
  }

  // Ruta protegida - requiere autenticación
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() data: any, @CurrentUser() user: any) {
    console.log('Usuario:', user.email);
    return this.turnoService.create(data);
  }
}
```

## 🎯 Decorador @CurrentUser()

Obtiene el usuario autenticado:

```typescript
@UseGuards(JwtAuthGuard)
@Get('mis-turnos')
getMisTurnos(@CurrentUser() user: any) {
  // user = { id: 1, email: "usuario@example.com" }
  return this.turnoService.findByUser(user.id);
}
```

## 🔧 Configuración

### Variables de Entorno (.env)

```env
JWT_SECRET=tu-clave-secreta-aqui
JWT_EXPIRATION=7d
```

### Generar JWT_SECRET

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## 🧪 Pruebas

### 1. Registrar Usuario

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "nombre": "Test User"
  }'
```

### 2. Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 3. Usar Token

```bash
# Guarda el token de la respuesta anterior
TOKEN="eyJhbGc..."

# Úsalo en las peticiones
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

## 💡 Frontend

### Login y Guardar Token

```javascript
// Login
const response = await fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'test@example.com',
    password: 'password123'
  })
});

const data = await response.json();

// Guardar token
localStorage.setItem('token', data.access_token);
```

### Usar Token en Peticiones

```javascript
const token = localStorage.getItem('token');

const response = await fetch('http://localhost:3000/api/doctores', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

### Con Axios

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api'
});

// Interceptor para añadir token automáticamente
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Uso
const response = await api.get('/doctores');
```

## ⚠️ Notas Importantes

1. **Por defecto, todas las rutas son públicas**. Solo protege las que necesites con `@UseGuards(JwtAuthGuard)`.

2. **Token expira en 7 días** por defecto. Puedes cambiarlo en `.env`.

3. **Las contraseñas se hashean** automáticamente con bcrypt.

4. **No hay roles ni permisos**. Es un sistema simple de autenticación.

## 🔐 Usuario Admin por Defecto

Al crear la base de datos, se crea un usuario admin:

- **Email**: admin@turnera.com
- **Password**: admin123

**⚠️ Cambia la contraseña en producción**

## 🎓 Ejemplo Completo

```typescript
import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { CurrentUser } from '@/modules/auth/decorators/current-user.decorator';

@Controller('ejemplo')
export class EjemploController {
  
  // Pública - cualquiera puede acceder
  @Get('public')
  getPublic() {
    return { message: 'Ruta pública' };
  }

  // Protegida - solo con token válido
  @UseGuards(JwtAuthGuard)
  @Get('protected')
  getProtected(@CurrentUser() user: any) {
    return { 
      message: 'Ruta protegida',
      user: user.email 
    };
  }

  // Protegida - crear algo
  @UseGuards(JwtAuthGuard)
  @Post('create')
  create(@Body() data: any, @CurrentUser() user: any) {
    return {
      message: 'Creado por',
      userId: user.id,
      userEmail: user.email,
      data: data
    };
  }
}
```

Eso es todo. Sistema simple, directo y funcional. 🚀
