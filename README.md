# 🏥 Sistema de Gestión de Turnos Médicos - Backend

Backend desarrollado en **NestJS** con **TypeORM** y **MySQL** para la gestión completa de turnos médicos, incluyendo autenticación, autorización basada en roles, y administración de pacientes, doctores, especialidades, obras sociales y horarios.

## 📋 Tabla de Contenidos

- [Características Principales](#-características-principales)
- [Tecnologías](#-tecnologías)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Base de Datos](#-base-de-datos)
- [Seeders](#-seeders)
- [Sistema de Roles](#-sistema-de-roles)
- [Autenticación](#-autenticación)
- [Endpoints de la API](#-endpoints-de-la-api)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Scripts Disponibles](#-scripts-disponibles)
- [Solución de Problemas](#-solución-de-problemas)

---

## ✨ Características Principales

- 🔐 **Sistema de autenticación JWT** con roles y permisos
- 👥 **4 tipos de usuarios**: Admin, Doctor, Secretaria, Paciente
- 📅 **Gestión completa de turnos** con estados y confirmaciones
- 🏥 **Administración de doctores** con especialidades
- 👤 **Gestión de pacientes** con obras sociales
- ⏰ **Horarios disponibles** configurables por doctor y consultorio
- 🏢 **Obras sociales** y coberturas
- 🚪 **Consultorios** con gestión de disponibilidad
- ✅ **Validación de datos** con class-validator
- 🔄 **Relaciones complejas** entre entidades
- 📊 **Base de datos optimizada** con índices y soft deletes

---

## 🛠 Tecnologías

| Tecnología | Versión | Descripción |
|------------|---------|-------------|
| **NestJS** | 11.x | Framework de Node.js para backend escalable |
| **TypeORM** | 0.3.x | ORM para TypeScript/JavaScript |
| **MySQL** | 8.0+ | Base de datos relacional |
| **TypeScript** | 5.x | Lenguaje tipado para JavaScript |
| **JWT** | - | JSON Web Tokens para autenticación |
| **bcrypt** | - | Encriptación de contraseñas |
| **class-validator** | - | Validación de DTOs |

---

## 📦 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0 o **yarn** >= 1.22.0
- **MySQL** >= 8.0
- Un editor de código (recomendado: VS Code)

---

## 🚀 Instalación

### 1️⃣ Clonar el repositorio e instalar dependencias

```bash
# Clonar el repositorio
git clone <url-del-repositorio>
cd be_turnera

# Instalar dependencias
npm install
```

### 2️⃣ Crear la base de datos

La base de datos utiliza **utf8mb4** con collation **utf8mb4_0900_ai_ci** para soporte completo de caracteres Unicode (español, emojis, etc.).

#### **Opción A: Scripts automáticos**

**Windows (PowerShell):**
```powershell
cd src/database
.\create-db.ps1
```

**Windows (CMD):**
```cmd
cd src/database
create-db.bat
```

**Linux/Mac:**
```bash
cd src/database
chmod +x create-db.sh
./create-db.sh
```

#### **Opción B: MySQL CLI**

```bash
mysql -u root -p < src/database/create-database.sql
```

#### **Opción C: Comando manual en MySQL**

```sql
-- Conectar a MySQL
mysql -u root -p

-- Ejecutar el script
source src/database/create-database.sql;
```

### 3️⃣ Configurar variables de entorno

```bash
# Copiar el archivo de ejemplo
cp .env.example .env
```

Editar `.env` con tus credenciales:

```env
# Base de datos
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=tu_contraseña_mysql
DB_DATABASE=turnera

# Aplicación
PORT=3000
NODE_ENV=development

# JWT (cambiar en producción)
JWT_SECRET=tu_secreto_super_seguro_aqui
JWT_EXPIRATION=24h
```

### 4️⃣ Iniciar la aplicación

```bash
# Modo desarrollo (con hot-reload)
npm run start:dev

# La API estará disponible en: http://localhost:3000/api
```

---

## ⚙ Configuración

### Variables de Entorno

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `DB_HOST` | Host de MySQL | `localhost` |
| `DB_PORT` | Puerto de MySQL | `3306` |
| `DB_USERNAME` | Usuario de MySQL | `root` |
| `DB_PASSWORD` | Contraseña de MySQL | - |
| `DB_DATABASE` | Nombre de la base de datos | `turnera` |
| `PORT` | Puerto de la aplicación | `3000` |
| `JWT_SECRET` | Secreto para JWT | - |
| `JWT_EXPIRATION` | Tiempo de expiración del token | `24h` |

---

## 🗄 Base de Datos

### Configuración

- **Charset:** `utf8mb4`
- **Collation:** `utf8mb4_0900_ai_ci` (MySQL 8.0+)

Esta configuración garantiza:
- ✅ Soporte de caracteres especiales del español (ñ, á, é, í, ó, ú, ü)
- ✅ Soporte de emojis y caracteres Unicode completos
- ✅ Búsquedas case-insensitive
- ✅ Búsquedas accent-insensitive

### Estructura de Tablas

El proyecto incluye las siguientes tablas principales:

1. **usuario** - Usuarios del sistema con roles
2. **doctor** - Información de doctores
3. **paciente** - Información de pacientes
4. **turno** - Turnos médicos
5. **especialidad** - Especialidades médicas
6. **obra_social** - Obras sociales
7. **cobertura** - Tipos de cobertura
8. **consultorio** - Consultorios disponibles
9. **horario_disponible** - Horarios de atención
10. **doctor_especialidad** - Relación muchos a muchos entre doctores y especialidades

### Verificar configuración

```sql
-- Ver configuración de la base de datos
SELECT 
    DEFAULT_CHARACTER_SET_NAME, 
    DEFAULT_COLLATION_NAME 
FROM INFORMATION_SCHEMA.SCHEMATA 
WHERE SCHEMA_NAME = 'turnera';

-- Ver configuración de tablas
SELECT 
    TABLE_NAME, 
    TABLE_COLLATION 
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_SCHEMA = 'turnera';
```

---

## 🌱 Seeders

Los seeders crean datos iniciales para probar la aplicación. Se ejecutan **una sola vez** después de crear la base de datos.

### Ejecutar Seeders

```bash
npm run seed
```

### Usuarios Creados

El seeder crea 4 usuarios de prueba, uno por cada rol:

| Email | Password | Rol | ID Referencia |
|-------|----------|-----|---------------|
| `admin@turnera.com` | `123456` | **ADMIN** | - |
| `doctor@turnera.com` | `123456` | **DOCTOR** | `1` (id_doctor) |
| `secretaria@turnera.com` | `123456` | **SECRETARIA** | - |
| `paciente@turnera.com` | `123456` | **PACIENTE** | `12345678` (DNI) |

**Nota:** Estos usuarios son solo para desarrollo. Cambiar las contraseñas en producción.

### Datos adicionales creados:

- ✅ Especialidades médicas (Cardiología, Pediatría, Traumatología, etc.)
- ✅ Consultorios (Consultorio 1, 2, 3, etc.)
- ✅ Obras sociales y coberturas

---

## 👥 Sistema de Roles

El sistema implementa **4 roles** con diferentes niveles de acceso:

### 🔴 ADMIN - Administrador del Sistema

Control total sobre el sistema:

- ✅ Crear, modificar y eliminar **pacientes**
- ✅ Crear, modificar y eliminar **doctores**
- ✅ Ver **todos los turnos** del sistema
- ✅ Crear, modificar, confirmar, cancelar y completar **turnos**
- ✅ **Eliminar turnos**
- ✅ Gestionar **obras sociales, consultorios, especialidades**
- ✅ Gestionar **horarios disponibles**

### 🟢 DOCTOR - Médico

Permisos orientados a la gestión de pacientes y turnos propios:

- ✅ Crear y modificar **pacientes**
- ✅ Ver **solo sus propios turnos** (`/turnos/mis-turnos`)
- ✅ Ver turnos por fecha
- ✅ Confirmar, cancelar y completar **turnos**
- ✅ Ver información de **otros doctores**
- ❌ No puede eliminar turnos
- ❌ No puede ver turnos de otros doctores

### 🟡 SECRETARIA - Recepcionista/Administradora

Permisos para gestión administrativa completa:

- ✅ Crear y modificar **pacientes**
- ✅ Crear y modificar **doctores**
- ✅ Ver **todos los turnos** del sistema
- ✅ Crear **turnos**
- ✅ Actualizar, confirmar y cancelar **turnos**
- ✅ **Eliminar turnos**
- ✅ Gestionar **obras sociales y consultorios**
- ❌ No puede eliminar doctores (solo ADMIN)

### 🔵 PACIENTE - Usuario Final

Permisos limitados a información propia:

- ✅ Ver **solo sus propios turnos** (`/turnos/mis-turnos`)
- ✅ Crear **turnos** para sí mismo
- ✅ Cancelar **sus propios turnos**
- ✅ Ver detalles de **sus turnos**
- ❌ No puede ver turnos de otros pacientes
- ❌ No puede modificar datos de pacientes
- ❌ No puede ver información de doctores completa

---

## 🔐 Autenticación

La API usa **JWT (JSON Web Tokens)** para autenticación.

### 1. Registrar un usuario

```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "nuevo@example.com",
  "password": "password123",
  "nombre": "Juan Pérez",
  "rol": "paciente",
  "idReferencia": "87654321"  // DNI del paciente o ID del doctor
}
```

**Respuesta:**
```json
{
  "idUsuario": 5,
  "email": "nuevo@example.com",
  "nombre": "Juan Pérez",
  "rol": "paciente",
  "idReferencia": "87654321",
  "activo": true,
  "fechaCreacion": "2025-10-18T12:00:00.000Z"
}
```

### 2. Iniciar sesión

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@turnera.com",
  "password": "123456"
}
```

**Respuesta:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "idUsuario": 1,
    "email": "admin@turnera.com",
    "nombre": "Admin Sistema",
    "rol": "admin",
    "idReferencia": null
  }
}
```

### 3. Usar el token

Incluir el token en el header `Authorization` de todas las peticiones:

```bash
GET /api/turnos
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Ver perfil del usuario autenticado

```bash
GET /api/auth/profile
Authorization: Bearer <tu_token>
```

---

## 📡 Endpoints de la API

Todos los endpoints tienen el prefijo **`/api`**

### 🔓 Públicos (Sin autenticación)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Registrar nuevo usuario |
| `POST` | `/api/auth/login` | Iniciar sesión |

### 🔒 Protegidos (Requieren autenticación)

#### Perfil de Usuario

| Método | Endpoint | Roles | Descripción |
|--------|----------|-------|-------------|
| `GET` | `/api/auth/profile` | Todos | Obtener perfil del usuario autenticado |

#### Turnos

| Método | Endpoint | Roles | Descripción |
|--------|----------|-------|-------------|
| `POST` | `/api/turnos` | Admin, Secretaria, Paciente | Crear turno |
| `GET` | `/api/turnos` | Admin, Secretaria | Ver todos los turnos |
| `GET` | `/api/turnos/mis-turnos` | Doctor, Paciente | Ver mis propios turnos |
| `GET` | `/api/turnos/:id` | Admin, Secretaria, Doctor, Paciente | Ver un turno específico |
| `GET` | `/api/turnos/paciente/:dni` | Admin, Secretaria | Turnos de un paciente |
| `GET` | `/api/turnos/doctor/:id` | Admin, Secretaria, Doctor | Turnos de un doctor |
| `GET` | `/api/turnos/estado/:estado` | Admin, Secretaria, Doctor | Turnos por estado |
| `GET` | `/api/turnos/fecha?fecha=YYYY-MM-DD` | Admin, Secretaria, Doctor | Turnos por fecha |
| `PATCH` | `/api/turnos/:id` | Admin, Secretaria | Actualizar turno |
| `PATCH` | `/api/turnos/:id/confirmar` | Admin, Secretaria, Doctor | Confirmar turno |
| `PATCH` | `/api/turnos/:id/cancelar` | Admin, Secretaria, Paciente, Doctor | Cancelar turno |
| `PATCH` | `/api/turnos/:id/completar` | Admin, Secretaria, Doctor | Completar turno |
| `DELETE` | `/api/turnos/:id` | Admin, Secretaria | Eliminar turno |

#### Pacientes

| Método | Endpoint | Roles | Descripción |
|--------|----------|-------|-------------|
| `POST` | `/api/pacientes` | Admin, Doctor, Secretaria | Crear paciente |
| `GET` | `/api/pacientes` | Admin, Doctor, Secretaria | Listar todos |
| `GET` | `/api/pacientes/activos` | Admin, Doctor, Secretaria | Listar activos |
| `GET` | `/api/pacientes/:dni` | Admin, Doctor, Secretaria | Obtener por DNI |
| `PATCH` | `/api/pacientes/:dni` | Admin, Doctor, Secretaria | Actualizar paciente |
| `DELETE` | `/api/pacientes/:dni` | Admin | Eliminar paciente |

#### Doctores

| Método | Endpoint | Roles | Descripción |
|--------|----------|-------|-------------|
| `POST` | `/api/doctores` | Admin, Secretaria | Crear doctor |
| `GET` | `/api/doctores` | Admin, Secretaria, Doctor | Listar todos |
| `GET` | `/api/doctores/activos` | Admin, Secretaria, Doctor | Listar activos |
| `GET` | `/api/doctores/:id` | Admin, Secretaria, Doctor | Obtener por ID |
| `PATCH` | `/api/doctores/:id` | Admin, Secretaria | Actualizar doctor |
| `DELETE` | `/api/doctores/:id` | Admin | Eliminar doctor |

#### Especialidades

| Método | Endpoint | Roles | Descripción |
|--------|----------|-------|-------------|
| `POST` | `/api/especialidades` | Admin | Crear especialidad |
| `GET` | `/api/especialidades` | Todos autenticados | Listar todas |
| `GET` | `/api/especialidades/:id` | Todos autenticados | Obtener por ID |
| `PATCH` | `/api/especialidades/:id` | Admin | Actualizar especialidad |
| `DELETE` | `/api/especialidades/:id` | Admin | Eliminar especialidad |

#### Obras Sociales

| Método | Endpoint | Roles | Descripción |
|--------|----------|-------|-------------|
| `POST` | `/api/obras-sociales` | Admin, Secretaria | Crear obra social |
| `GET` | `/api/obras-sociales` | Todos autenticados | Listar todas |
| `GET` | `/api/obras-sociales/activas` | Todos autenticados | Listar activas |
| `GET` | `/api/obras-sociales/:codigo` | Todos autenticados | Obtener por código |
| `PATCH` | `/api/obras-sociales/:codigo` | Admin, Secretaria | Actualizar |
| `DELETE` | `/api/obras-sociales/:codigo` | Admin | Eliminar |

#### Coberturas

| Método | Endpoint | Roles | Descripción |
|--------|----------|-------|-------------|
| `POST` | `/api/coberturas` | Admin | Crear cobertura |
| `GET` | `/api/coberturas` | Todos autenticados | Listar todas |
| `GET` | `/api/coberturas/:id` | Todos autenticados | Obtener por ID |
| `PATCH` | `/api/coberturas/:id` | Admin | Actualizar |
| `DELETE` | `/api/coberturas/:id` | Admin | Eliminar |

#### Consultorios

| Método | Endpoint | Roles | Descripción |
|--------|----------|-------|-------------|
| `POST` | `/api/consultorios` | Admin, Secretaria | Crear consultorio |
| `GET` | `/api/consultorios` | Todos autenticados | Listar todos |
| `GET` | `/api/consultorios/activos` | Todos autenticados | Listar activos |
| `GET` | `/api/consultorios/:id` | Todos autenticados | Obtener por ID |
| `PATCH` | `/api/consultorios/:id` | Admin, Secretaria | Actualizar |
| `DELETE` | `/api/consultorios/:id` | Admin | Eliminar |

#### Horarios Disponibles

| Método | Endpoint | Roles | Descripción |
|--------|----------|-------|-------------|
| `POST` | `/api/horarios-disponibles` | Admin, Secretaria | Crear horario |
| `GET` | `/api/horarios-disponibles` | Todos autenticados | Listar todos |
| `GET` | `/api/horarios-disponibles/doctor/:id` | Todos autenticados | Por doctor |
| `GET` | `/api/horarios-disponibles/consultorio/:id` | Todos autenticados | Por consultorio |
| `GET` | `/api/horarios-disponibles/dia?dia=lunes` | Todos autenticados | Por día |
| `GET` | `/api/horarios-disponibles/:id` | Todos autenticados | Obtener por ID |
| `PATCH` | `/api/horarios-disponibles/:id` | Admin, Secretaria | Actualizar |
| `DELETE` | `/api/horarios-disponibles/:id` | Admin | Eliminar |

### Ejemplos de Uso con cURL

#### Iniciar sesión

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@turnera.com",
    "password": "123456"
  }'
```

#### Crear un paciente (como Admin)

```bash
curl -X POST http://localhost:3000/api/pacientes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <tu_token>" \
  -d '{
    "dniPaciente": "12345678",
    "nombre": "Juan",
    "apellido": "Pérez",
    "fechaNacimiento": "1990-05-15",
    "direccion": "Calle Falsa 123",
    "telefono": "1234567890",
    "email": "juan@example.com",
    "idObraSocial": "OS001",
    "numeroAfiliado": "12345",
    "idCobertura": 1
  }'
```

#### Ver mis turnos (como Doctor o Paciente)

```bash
curl -X GET http://localhost:3000/api/turnos/mis-turnos \
  -H "Authorization: Bearer <tu_token>"
```

---

## 📁 Estructura del Proyecto

```
be_turnera/
├── src/
│   ├── auth/                           # Módulo de autenticación
│   │   ├── decorators/                 # Decoradores personalizados
│   │   │   ├── get-user.decorator.ts   # Obtener usuario del request
│   │   │   └── roles.decorator.ts      # Decorador de roles
│   │   ├── dto/                        # Data Transfer Objects
│   │   │   ├── login.dto.ts
│   │   │   └── register.dto.ts
│   │   ├── guards/                     # Guards de NestJS
│   │   │   ├── jwt-auth.guard.ts       # Guard de autenticación JWT
│   │   │   └── roles.guard.ts          # Guard de autorización por roles
│   │   ├── strategies/                 # Estrategias de Passport
│   │   │   └── jwt.strategy.ts         # Estrategia JWT
│   │   ├── auth.controller.ts
│   │   ├── auth.module.ts
│   │   └── auth.service.ts
│   │
│   ├── entities/                       # Entidades TypeORM
│   │   ├── cobertura.entity.ts
│   │   ├── consultorio.entity.ts
│   │   ├── doctor.entity.ts
│   │   ├── especialidad.entity.ts
│   │   ├── horario-disponible.entity.ts
│   │   ├── index.ts
│   │   ├── obra-social.entity.ts
│   │   ├── paciente.entity.ts
│   │   ├── turno.entity.ts
│   │   └── usuario.entity.ts
│   │
│   ├── modules/                        # Módulos de funcionalidad
│   │   ├── cobertura/
│   │   │   ├── dto/
│   │   │   ├── cobertura.controller.ts
│   │   │   ├── cobertura.module.ts
│   │   │   └── cobertura.service.ts
│   │   ├── consultorio/
│   │   ├── doctor/
│   │   ├── especialidad/
│   │   ├── horario-disponible/
│   │   ├── obra-social/
│   │   ├── paciente/
│   │   ├── turno/
│   │   └── common.module.ts
│   │
│   ├── database/                       # Scripts de base de datos
│   │   ├── seeds/                      # Seeders
│   │   │   ├── consultorio.seeder.ts
│   │   │   ├── especialidad.seeder.ts
│   │   │   ├── usuario.seeder.ts
│   │   │   └── seed-all.ts
│   │   ├── create-database.sql
│   │   ├── create-db.bat
│   │   ├── create-db.ps1
│   │   └── create-db.sh
│   │
│   ├── common/                         # Utilidades comunes
│   ├── app.module.ts                   # Módulo raíz
│   └── main.ts                         # Punto de entrada
│
├── .env                                # Variables de entorno (no incluir en git)
├── .env.example                        # Ejemplo de variables
├── .gitignore
├── nest-cli.json
├── package.json
├── tsconfig.json
└── README.md
```

---

## 📜 Scripts Disponibles

```bash
# Desarrollo
npm run start:dev          # Iniciar en modo desarrollo (hot-reload)
npm run start:debug        # Iniciar en modo debug

# Producción
npm run build              # Compilar el proyecto
npm run start:prod         # Iniciar en modo producción

# Base de datos
npm run seed               # Ejecutar seeders (crear datos iniciales)

# Calidad de código
npm run lint               # Ejecutar ESLint
npm run format             # Formatear código con Prettier

# Testing
npm run test               # Ejecutar tests
npm run test:watch         # Ejecutar tests en modo watch
npm run test:cov           # Ejecutar tests con cobertura
npm run test:e2e           # Ejecutar tests end-to-end
```

---

## 🔧 Solución de Problemas

### ❌ Error: `ER_NOT_SUPPORTED_AUTH_MODE`

**Problema:** MySQL está usando un método de autenticación no compatible.

**Solución:**

```sql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'tu_contraseña';
FLUSH PRIVILEGES;
```

### ❌ Error: Puerto 3000 ya está en uso

**Solución:** Cambiar el puerto en `.env`:

```env
PORT=3001
```

### ❌ Error: No se puede conectar a MySQL

**Verificar que MySQL esté corriendo:**

```bash
# Windows
services.msc    # Buscar "MySQL" y verificar que esté iniciado

# Linux
sudo systemctl status mysql

# Mac
brew services list
```

### ❌ Error: Charset incorrecto

**Verificar configuración:**

```sql
SHOW VARIABLES LIKE 'character_set%';
SHOW VARIABLES LIKE 'collation%';
```

### ❌ Error 401: Unauthorized

**Posibles causas:**
1. Token expirado → Iniciar sesión nuevamente
2. Token inválido → Verificar que el token esté bien copiado
3. Usuario inactivo → Verificar que `activo = true` en la base de datos

### ❌ Error 403: Forbidden

**Causa:** No tienes permisos para acceder a ese recurso.

**Solución:** Verificar que tu rol tenga acceso al endpoint solicitado (ver [Sistema de Roles](#-sistema-de-roles)).

---

## 📝 Notas Importantes

- ⚠️ **Seguridad:** Cambiar `JWT_SECRET` en producción por un valor seguro y aleatorio
- ⚠️ **Contraseñas:** Los usuarios de prueba del seeder tienen contraseñas débiles (`123456`). Cambiarlas en producción.
- ⚠️ **CORS:** Está habilitado para desarrollo. Configurar apropiadamente en producción.
- ⚠️ **TypeORM Sync:** La opción `synchronize` está en `false` para evitar cambios automáticos en producción
- ✅ **Soft Deletes:** Las entidades principales usan soft deletes (campo `activo`)
- ✅ **Validación:** Todos los DTOs tienen validación automática
- ✅ **Timestamps:** Todas las entidades tienen timestamps automáticos
- 📝 **API Prefix:** Todos los endpoints tienen el prefijo `/api`

---

## 📖 Documentación Adicional

### Flujo de Trabajo Típico

1. **Iniciar sesión** con un usuario de prueba
2. **Obtener el token JWT** de la respuesta
3. **Incluir el token** en el header `Authorization` de cada petición
4. **Realizar operaciones** según los permisos del rol

### Estados de Turnos

Los turnos pueden tener los siguientes estados:

- `pendiente` - Turno creado, esperando confirmación
- `confirmado` - Turno confirmado por secretaria o doctor
- `completado` - Turno realizado
- `cancelado` - Turno cancelado

### Días de la semana (para horarios)

- `lunes`
- `martes`
- `miércoles`
- `jueves`
- `viernes`
- `sábado`
- `domingo`

---

## 🤝 Contribuir

Si deseas contribuir al proyecto:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

---

## 📄 Licencia

UNLICENSED - Este proyecto es privado.

---

## 👨‍💻 Autor

Desarrollado con ❤️ para la gestión eficiente de turnos médicos.

---

## 📞 Soporte

Si tienes problemas o preguntas:

1. Revisa la sección [Solución de Problemas](#-solución-de-problemas)
2. Verifica que todos los pasos de [Instalación](#-instalación) estén completos
3. Consulta la [Documentación de NestJS](https://docs.nestjs.com/)
4. Consulta la [Documentación de TypeORM](https://typeorm.io/)

---

**¡Gracias por usar el Sistema de Gestión de Turnos Médicos! 🏥**
