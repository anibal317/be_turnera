# Pruebas del Sistema de Autenticación

Esta guía te ayudará a probar el sistema de autenticación completo.

## 📝 Preparación

1. Asegúrate de que la base de datos esté creada y corriendo
2. Asegúrate de que el servidor esté corriendo: `npm run start:dev`
3. Usa Postman, Insomnia o curl para las pruebas

## 🧪 Pruebas Paso a Paso

### 1. Login con Usuario Admin

**Request:**
```http
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "admin@turnera.com",
  "password": "admin123"
}
```

**Response esperado:**
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

✅ **Guarda el `access_token` para los siguientes pasos**

### 2. Obtener Perfil del Usuario

**Request:**
```http
GET http://localhost:3000/api/auth/profile
Authorization: Bearer <tu_access_token>
```

**Response esperado:**
```json
{
  "idUsuario": 1,
  "email": "admin@turnera.com",
  "rol": "admin",
  "activo": true,
  "idDoctor": null,
  "dniPaciente": null,
  "fechaCreacion": "2024-...",
  "fechaActualizacion": "2024-...",
  "doctor": null,
  "paciente": null
}
```

### 3. Registrar un Paciente

Primero necesitas crear un paciente en la BD (o usar uno existente).

**Crear Obra Social:**
```http
POST http://localhost:3000/api/coberturas
Authorization: Bearer <tu_access_token>
Content-Type: application/json

{
  "nombre": "Particular"
}
```

**Crear Paciente:**
```http
POST http://localhost:3000/api/pacientes
Authorization: Bearer <tu_access_token>
Content-Type: application/json

{
  "dniPaciente": "12345678",
  "nombre": "Juan",
  "apellido": "Pérez",
  "fechaNacimiento": "1990-01-01",
  "telefono": "1234567890",
  "email": "juan.perez@example.com",
  "idObraSocial": "000001",
  "idCobertura": 1
}
```

**Registrar Usuario Paciente:**
```http
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "email": "juan.perez@example.com",
  "password": "password123",
  "rol": "paciente",
  "dniPaciente": "12345678"
}
```

**Response esperado:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "idUsuario": 2,
    "email": "juan.perez@example.com",
    "rol": "paciente",
    "activo": true,
    "dniPaciente": "12345678"
  }
}
```

### 4. Probar Acceso Protegido con Token de Paciente

```http
GET http://localhost:3000/api/auth/me
Authorization: Bearer <token_del_paciente>
```

**Response esperado:**
```json
{
  "idUsuario": 2,
  "email": "juan.perez@example.com",
  "rol": "paciente",
  "dniPaciente": "12345678"
}
```

### 5. Probar Restricción de Roles

Intenta acceder a un endpoint de solo admin con el token del paciente:

```http
GET http://localhost:3000/api/doctores
Authorization: Bearer <token_del_paciente>
```

**Response esperado:**
```json
{
  "statusCode": 200,
  "data": [...]
}
```

(En este ejemplo específico funcionará porque no hay restricción de roles en el endpoint de doctores. Para probar restricciones, necesitarías agregar `@Roles(UserRole.ADMIN)` al controlador)

### 6. Probar Sin Token (Debe Fallar)

```http
GET http://localhost:3000/api/doctores
```

**Response esperado:**
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

### 7. Probar con Token Inválido (Debe Fallar)

```http
GET http://localhost:3000/api/doctores
Authorization: Bearer token_invalido
```

**Response esperado:**
```json
{
  "statusCode": 401,
  "message": "Token inválido o expirado"
}
```

## 🧪 Casos de Prueba Adicionales

### Registrar un Médico

```http
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "email": "doctor@turnera.com",
  "password": "doctor123",
  "rol": "medico",
  "idDoctor": 1
}
```

### Registrar un Secretario

```http
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "email": "secretario@turnera.com",
  "password": "secret123",
  "rol": "secretario"
}
```

### Login Fallido - Email Incorrecto

```http
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "noexiste@example.com",
  "password": "password123"
}
```

**Response esperado:**
```json
{
  "statusCode": 401,
  "message": "Credenciales inválidas"
}
```

### Login Fallido - Contraseña Incorrecta

```http
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "admin@turnera.com",
  "password": "wrongpassword"
}
```

**Response esperado:**
```json
{
  "statusCode": 401,
  "message": "Credenciales inválidas"
}
```

## 📊 Validaciones de DTOs

### Email Inválido

```http
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "email": "email-invalido",
  "password": "password123",
  "rol": "paciente"
}
```

**Response esperado:**
```json
{
  "statusCode": 400,
  "message": ["email must be an email"],
  "error": "Bad Request"
}
```

### Contraseña Muy Corta

```http
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "12345",
  "rol": "paciente"
}
```

**Response esperado:**
```json
{
  "statusCode": 400,
  "message": ["La contraseña debe tener al menos 6 caracteres"],
  "error": "Bad Request"
}
```

## 🔍 Verificar en la Base de Datos

Después de registrar usuarios, verifica en la BD:

```sql
SELECT * FROM usuario;
```

Deberías ver:
- Contraseñas hasheadas (no en texto plano)
- Email único
- Rol correcto
- Usuario activo por defecto

## ✅ Checklist de Pruebas

- [ ] Login exitoso con admin
- [ ] Obtener perfil con token válido
- [ ] Registrar nuevo usuario paciente
- [ ] Registrar nuevo usuario médico
- [ ] Registrar nuevo usuario secretario
- [ ] Login fallido con credenciales incorrectas
- [ ] Acceso denegado sin token
- [ ] Acceso denegado con token inválido
- [ ] Validación de email inválido
- [ ] Validación de contraseña corta
- [ ] Usuario duplicado (mismo email)
- [ ] Verificar contraseñas hasheadas en BD

## 🐛 Debugging

Si algo no funciona:

1. **Verifica los logs del servidor** - deberían mostrar errores detallados
2. **Verifica las variables de entorno** - JWT_SECRET debe estar configurado
3. **Verifica la base de datos** - tabla usuario debe existir
4. **Verifica el token** - usa jwt.io para decodificar y verificar

## 🎯 Siguiente Paso

Una vez que todas las pruebas pasen, el sistema de autenticación está funcionando correctamente y puedes:

1. Integrar la autenticación en tu frontend
2. Agregar `@Roles()` a los controladores según necesites
3. Implementar refresh tokens si es necesario
4. Agregar más validaciones personalizadas
