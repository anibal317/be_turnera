# Sistema de Autenticación - Turnera

## 📋 Descripción

Sistema de autenticación JWT completo con roles de usuario, protección de rutas y guards personalizados.

## 🔐 Roles de Usuario

El sistema maneja 4 roles:

- **ADMIN**: Administrador del sistema (acceso completo)
- **SECRETARIO**: Secretario/a (gestión de turnos y pacientes)
- **MEDICO**: Médico (acceso a sus turnos y pacientes)
- **PACIENTE**: Paciente (acceso a sus propios turnos)

## 🚀 Endpoints de Autenticación

### POST /api/auth/register
Registrar un nuevo usuario.

**Body:**
```json
{
  "email": "usuario@example.com",
  "password": "contraseña123",
  "rol": "paciente",
  "dniPaciente": "12345678" // Requerido si rol es 'paciente'
  // o
  "idDoctor": 1 // Requerido si rol es 'medico'
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "idUsuario": 1,
    "email": "usuario@example.com",
    "rol": "paciente",
    "activo": true,
    "dniPaciente": "12345678"
  }
}
```

### POST /api/auth/login
Iniciar sesión.

**Body:**
```json
{
  "email": "admin@turnera.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "idUsuario": 1,
    "email": "admin@turnera.com",
    "rol": "admin",
    "activo": true
  }
}
```

### GET /api/auth/profile
Obtener el perfil del usuario autenticado (requiere token).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "idUsuario": 1,
  "email": "admin@turnera.com",
  "rol": "admin",
  "activo": true,
  "fechaCreacion": "2024-01-01T00:00:00.000Z",
  "doctor": null,
  "paciente": null
}
```

### GET /api/auth/me
Obtener información básica del usuario del token.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "idUsuario": 1,
  "email": "admin@turnera.com",
  "rol": "admin"
}
```

## 🔒 Protección de Rutas

### Rutas Públicas (sin autenticación)

Para marcar una ruta como pública, usa el decorador `@Public()`:

```typescript
import { Public } from './decorators/public.decorator';

@Public()
@Get('public-endpoint')
getPublicData() {
  return { message: 'Esta ruta es pública' };
}
```

### Rutas Protegidas (requieren autenticación)

Por defecto, **todas las rutas están protegidas**. El guard JWT se aplica globalmente.

```typescript
// Esta ruta requiere autenticación automáticamente
@Get('protected-endpoint')
getProtectedData(@CurrentUser() user: any) {
  return { message: `Hola ${user.email}` };
}
```

### Rutas con Roles Específicos

Usa el decorador `@Roles()` para restringir acceso por rol:

```typescript
import { Roles } from './decorators/roles.decorator';
import { UserRole } from '@/entities/usuario.entity';

@Roles(UserRole.ADMIN, UserRole.SECRETARIO)
@Get('admin-only')
getAdminData() {
  return { message: 'Solo admins y secretarios' };
}
```

## 🛡️ Decoradores Disponibles

### @Public()
Marca una ruta como pública (sin autenticación).

```typescript
@Public()
@Post('login')
login(@Body() loginDto: LoginDto) {
  return this.authService.login(loginDto);
}
```

### @Roles(...roles)
Restringe acceso solo a roles específicos.

```typescript
@Roles(UserRole.ADMIN)
@Delete('user/:id')
deleteUser(@Param('id') id: number) {
  return this.userService.delete(id);
}
```

### @CurrentUser()
Obtiene el usuario autenticado del request.

```typescript
@Get('my-data')
getMyData(@CurrentUser() user: any) {
  console.log(user.idUsuario);
  console.log(user.email);
  console.log(user.rol);
  return user;
}
```

## 🔑 Uso del Token JWT

### En el Frontend

Después de login/register, guarda el token:

```javascript
// Guardar token
localStorage.setItem('access_token', response.access_token);

// Usar en requests
const token = localStorage.getItem('access_token');
fetch('http://localhost:3000/api/doctores', {
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

// Interceptor para agregar token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Uso
const response = await api.get('/doctores');
```

## 👤 Usuario Administrador por Defecto

El script de base de datos crea un usuario admin:

- **Email**: admin@turnera.com
- **Password**: admin123
- **Rol**: admin

⚠️ **IMPORTANTE**: Cambiar la contraseña en producción.

## 🔧 Configuración

### Variables de Entorno

```env
JWT_SECRET=tu-clave-super-secreta-cambiar-en-produccion
JWT_EXPIRATION=24h
```

### Cambiar Tiempo de Expiración

Valores válidos:
- `60s` - 60 segundos
- `15m` - 15 minutos
- `2h` - 2 horas
- `7d` - 7 días

## 🧪 Ejemplo Completo de Controlador

```typescript
import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { Public } from '@/modules/auth/decorators/public.decorator';
import { Roles } from '@/modules/auth/decorators/roles.decorator';
import { CurrentUser } from '@/modules/auth/decorators/current-user.decorator';
import { UserRole } from '@/entities/usuario.entity';

@Controller('example')
export class ExampleController {
  
  // Ruta pública - No requiere autenticación
  @Public()
  @Get('public')
  getPublic() {
    return { message: 'Ruta pública' };
  }

  // Ruta protegida - Requiere autenticación
  @Get('protected')
  getProtected(@CurrentUser() user: any) {
    return {
      message: 'Ruta protegida',
      user: user.email
    };
  }

  // Solo para admins
  @Roles(UserRole.ADMIN)
  @Get('admin-only')
  getAdminOnly() {
    return { message: 'Solo admins' };
  }

  // Para admins y secretarios
  @Roles(UserRole.ADMIN, UserRole.SECRETARIO)
  @Post('create')
  create(@Body() data: any, @CurrentUser() user: any) {
    return {
      message: 'Creado por',
      creator: user.email
    };
  }

  // Para médicos - ver sus turnos
  @Roles(UserRole.MEDICO)
  @Get('my-appointments')
  getMyAppointments(@CurrentUser() user: any) {
    // user.idDoctor contiene el ID del doctor
    return {
      doctorId: user.idDoctor
    };
  }

  // Para pacientes - ver sus turnos
  @Roles(UserRole.PACIENTE)
  @Get('my-bookings')
  getMyBookings(@CurrentUser() user: any) {
    // user.dniPaciente contiene el DNI del paciente
    return {
      patientDni: user.dniPaciente
    };
  }
}
```

## 🔐 Seguridad

### Mejores Prácticas

1. **JWT Secret**: Usar una clave larga y aleatoria en producción
2. **HTTPS**: Siempre usar HTTPS en producción
3. **Expiración**: No usar tokens con expiración muy larga
4. **Renovación**: Implementar refresh tokens para sesiones largas
5. **Logout**: Implementar blacklist de tokens si es necesario

### Generar JWT Secret Seguro

```bash
# En Linux/Mac
openssl rand -base64 64

# En Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"
```

## ❓ Troubleshooting

### Error: "Token inválido o expirado"
- Verificar que el token no haya expirado
- Verificar que JWT_SECRET sea el mismo en .env

### Error: "Usuario no válido o inactivo"
- El usuario puede estar marcado como inactivo en la BD
- Verificar que el usuario existe

### Error: "No tienes permisos"
- El usuario no tiene el rol requerido
- Verificar que el decorador @Roles() incluya el rol del usuario

## 📚 Recursos

- [NestJS Authentication](https://docs.nestjs.com/security/authentication)
- [Passport JWT](http://www.passportjs.org/packages/passport-jwt/)
- [JWT.io](https://jwt.io/) - Decodificar tokens JWT
