# ✅ Sistema de Autenticación SIMPLIFICADO

## 🎯 Qué se Simplificó

### ❌ ELIMINADO:
- ❌ Sistema de roles (admin, secretario, médico, paciente)
- ❌ Guard de roles (`RolesGuard`)
- ❌ Decorador `@Roles()`
- ❌ Decorador `@Public()`
- ❌ Guards globales (APP_GUARD)
- ❌ Relaciones de usuario con doctor/paciente
- ❌ Complejidad innecesaria

### ✅ MANTENIDO:
- ✅ Login con email/password
- ✅ Registro de usuarios
- ✅ JWT tokens
- ✅ Protección básica de rutas con `@UseGuards(JwtAuthGuard)`
- ✅ Decorador `@CurrentUser()`
- ✅ Contraseñas hasheadas

## 📁 Estructura Simple

```
src/modules/auth/
├── decorators/
│   └── current-user.decorator.ts    # Obtener usuario
├── dto/
│   ├── login.dto.ts                 # Email + password
│   └── register.dto.ts              # Email + password + nombre
├── guards/
│   └── jwt-auth.guard.ts            # Protección simple
├── strategies/
│   └── jwt.strategy.ts              # Validación JWT
├── auth.controller.ts               # 3 endpoints: register, login, me
├── auth.service.ts                  # Lógica simple
└── auth.module.ts                   # Módulo básico
```

## 🗄️ Base de Datos

### Tabla usuario (simplificada):

```sql
CREATE TABLE usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    nombre VARCHAR(50) DEFAULT 'Usuario',
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**Sin roles, sin foreign keys, sin complejidad.**

## 🔐 Cómo Usar

### 1. Rutas Públicas (por defecto)

```typescript
@Get('doctores')
findAll() {
  return this.doctorService.findAll();
}
```

### 2. Rutas Protegidas (con guard)

```typescript
@UseGuards(JwtAuthGuard)
@Post('turnos')
create(@CurrentUser() user: any) {
  // user = { id: 1, email: "user@example.com" }
  return this.turnoService.create(data);
}
```

**Eso es todo.** No hay roles, no hay permisos, no hay complejidad.

## 📝 Endpoints

1. **POST /api/auth/register** - Registrar usuario
2. **POST /api/auth/login** - Iniciar sesión
3. **GET /api/auth/me** - Obtener usuario (requiere token)

## 🧪 Ejemplo de Uso

```bash
# 1. Registrar
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"pass123"}'

# 2. Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"pass123"}'

# 3. Usar token
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer tu-token"
```

## 🔧 Configuración

**.env:**
```env
JWT_SECRET=tu-clave-secreta
JWT_EXPIRATION=7d
```

## 🎓 Filosofía

**"Mantén las cosas simples, estúpido" (KISS)**

- No roles complejos
- No permisos granulares
- No guards globales
- Solo autenticación básica

**Si necesitas:**
- Distinguir tipos de usuario → Agrega un campo `tipo` a la tabla usuario
- Roles básicos → Agrega un enum simple después
- Más complejidad → Constrúyela cuando la necesites, no antes

## 📚 Documentación

Lee **AUTH_SIMPLE.md** para la guía completa de uso.

## ✅ Listo para Usar

1. `npm install`
2. Crear base de datos: `cd database && .\create-db.ps1`
3. Configurar `.env`
4. `npm run start:dev`
5. Listo! 🚀

**Sistema simple, funcional y fácil de entender.**
