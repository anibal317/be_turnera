# Backend Turnera - Sistema de Gestión de Turnos Médicos

Backend desarrollado en NestJS con TypeORM para gestionar turnos médicos.

## Requisitos

- Node.js >= 18
- MySQL >= 8.0
- npm o yarn

## Instalación

### 1. Clonar e instalar dependencias

```bash
npm install
```

### 2. Crear la base de datos

La base de datos utiliza **utf8mb4** con collation **utf8mb4_0900_ai_ci** para soporte completo de caracteres Unicode.

#### Opción A: Usando scripts automáticos

**En Windows (PowerShell):**
```powershell
cd database
.\create-db.ps1
```

**En Windows (CMD):**
```cmd
cd database
create-db.bat
```

**En Linux/Mac:**
```bash
cd database
chmod +x create-db.sh
./create-db.sh
```

#### Opción B: Usando MySQL directamente

**Desde línea de comandos:**
```bash
mysql -u root -p < database/create-database.sql
```

**Desde MySQL Workbench o phpMyAdmin:**
- Abrir el archivo `database/create-database.sql`
- Ejecutar el script completo

#### Opción C: Comando manual

```bash
# Conectar a MySQL
mysql -u root -p

# Dentro de MySQL, ejecutar:
source database/create-database.sql;
```

### 3. Configurar variables de entorno

Copiar el archivo `.env.example` a `.env` y configurar las credenciales:

```bash
# En Windows (PowerShell)
Copy-Item .env.example .env

# En Linux/Mac
cp .env.example .env
```

Editar el archivo `.env`:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=tu_contraseña
DB_DATABASE=turnera

PORT=3000
```

### 4. Iniciar la aplicación

```bash
# Modo desarrollo
npm run start:dev

# Modo producción
npm run build
npm run start:prod
```

La aplicación estará disponible en: `http://localhost:3000/api`

## Estructura del Proyecto

```
be_turnera/
├── database/                    # Scripts de base de datos
│   ├── create-database.sql      # Script SQL principal
│   ├── create-db.sh            # Script para Linux/Mac
│   ├── create-db.bat           # Script para Windows CMD
│   └── create-db.ps1           # Script para Windows PowerShell
├── src/
│   ├── entities/               # Entidades TypeORM
│   ├── modules/                # Módulos de la aplicación
│   │   ├── doctor/             # CRUD de doctores
│   │   ├── paciente/           # CRUD de pacientes
│   │   ├── turno/              # Gestión de turnos
│   │   ├── especialidad/       # CRUD de especialidades
│   │   ├── cobertura/          # CRUD de coberturas
│   │   ├── obra-social/        # CRUD de obras sociales
│   │   ├── consultorio/        # CRUD de consultorios
│   │   ├── horario-disponible/ # Gestión de horarios
│   │   └── common.module.ts    # Módulo común
│   ├── app.module.ts           # Módulo principal
│   └── main.ts                 # Punto de entrada
├── .env.example                # Ejemplo de variables de entorno
├── package.json
└── README.md
```

## Configuración de Base de Datos

**Charset:** `utf8mb4`  
**Collation:** `utf8mb4_0900_ai_ci` (MySQL 8.0+)

Esta configuración garantiza:
- ✅ Soporte completo de caracteres especiales del español (ñ, á, é, í, ó, ú, ü)
- ✅ Soporte de emojis y caracteres Unicode
- ✅ Búsquedas sin distinción de mayúsculas/minúsculas
- ✅ Búsquedas sin distinción de acentos

### Verificar configuración de la base de datos

```sql
-- Ver configuración de la base de datos
SELECT 
    DEFAULT_CHARACTER_SET_NAME, 
    DEFAULT_COLLATION_NAME 
FROM INFORMATION_SCHEMA.SCHEMATA 
WHERE SCHEMA_NAME = 'turnera';

-- Ver configuración de las tablas
SELECT 
    TABLE_NAME, 
    TABLE_COLLATION 
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_SCHEMA = 'turnera';
```

## Scripts Disponibles

```bash
# Desarrollo con hot-reload
npm run start:dev

# Producción
npm run build
npm run start:prod

# Linting y formateo
npm run lint
npm run format

# Tests
npm run test
npm run test:watch
npm run test:cov
```

## Endpoints Principales

Todos los endpoints tienen el prefijo `/api`

### Doctores
- `GET /api/doctores` - Listar todos los doctores
- `GET /api/doctores/activos` - Listar doctores activos
- `GET /api/doctores/:id` - Obtener un doctor
- `POST /api/doctores` - Crear doctor
- `PATCH /api/doctores/:id` - Actualizar doctor
- `DELETE /api/doctores/:id` - Eliminar doctor

### Pacientes
- `GET /api/pacientes` - Listar todos los pacientes
- `GET /api/pacientes/activos` - Listar pacientes activos
- `GET /api/pacientes/:dni` - Obtener un paciente
- `POST /api/pacientes` - Crear paciente
- `PATCH /api/pacientes/:dni` - Actualizar paciente
- `DELETE /api/pacientes/:dni` - Eliminar paciente

### Turnos
- `GET /api/turnos` - Listar todos los turnos
- `GET /api/turnos/:id` - Obtener un turno
- `GET /api/turnos/paciente/:dni` - Turnos de un paciente
- `GET /api/turnos/doctor/:id` - Turnos de un doctor
- `GET /api/turnos/estado/:estado` - Turnos por estado (pendiente, confirmado, completado, cancelado)
- `GET /api/turnos/fecha?fecha=YYYY-MM-DD` - Turnos por fecha
- `POST /api/turnos` - Crear turno
- `PATCH /api/turnos/:id` - Actualizar turno
- `PATCH /api/turnos/:id/confirmar` - Confirmar turno
- `PATCH /api/turnos/:id/cancelar` - Cancelar turno
- `PATCH /api/turnos/:id/completar` - Completar turno
- `DELETE /api/turnos/:id` - Eliminar turno

### Especialidades
- `GET /api/especialidades` - Listar especialidades
- `GET /api/especialidades/:id` - Obtener especialidad
- `POST /api/especialidades` - Crear especialidad
- `PATCH /api/especialidades/:id` - Actualizar especialidad
- `DELETE /api/especialidades/:id` - Eliminar especialidad

### Coberturas
- `GET /api/coberturas` - Listar coberturas
- `GET /api/coberturas/:id` - Obtener cobertura
- `POST /api/coberturas` - Crear cobertura
- `PATCH /api/coberturas/:id` - Actualizar cobertura
- `DELETE /api/coberturas/:id` - Eliminar cobertura

### Obras Sociales
- `GET /api/obras-sociales` - Listar obras sociales
- `GET /api/obras-sociales/activas` - Listar activas
- `GET /api/obras-sociales/:codigo` - Obtener obra social
- `POST /api/obras-sociales` - Crear obra social
- `PATCH /api/obras-sociales/:codigo` - Actualizar obra social
- `DELETE /api/obras-sociales/:codigo` - Eliminar obra social

### Consultorios
- `GET /api/consultorios` - Listar consultorios
- `GET /api/consultorios/activos` - Listar activos
- `GET /api/consultorios/:id` - Obtener consultorio
- `POST /api/consultorios` - Crear consultorio
- `PATCH /api/consultorios/:id` - Actualizar consultorio
- `DELETE /api/consultorios/:id` - Eliminar consultorio

### Horarios Disponibles
- `GET /api/horarios-disponibles` - Listar horarios
- `GET /api/horarios-disponibles/doctor/:id` - Por doctor
- `GET /api/horarios-disponibles/consultorio/:id` - Por consultorio
- `GET /api/horarios-disponibles/dia?dia=lunes` - Por día
- `GET /api/horarios-disponibles/:id` - Obtener horario
- `POST /api/horarios-disponibles` - Crear horario
- `PATCH /api/horarios-disponibles/:id` - Actualizar horario
- `DELETE /api/horarios-disponibles/:id` - Eliminar horario

## Tecnologías Utilizadas

- **NestJS 10** - Framework de Node.js
- **TypeORM 0.3** - ORM para TypeScript
- **MySQL 8.0** - Base de datos relacional
- **class-validator** - Validación de DTOs
- **class-transformer** - Transformación de objetos
- **TypeScript 5** - Lenguaje tipado

## Características

- ✅ API RESTful completa
- ✅ Validación de datos con DTOs
- ✅ Relaciones entre entidades con TypeORM
- ✅ CORS habilitado
- ✅ Manejo de errores centralizado
- ✅ Índices en base de datos para mejor performance
- ✅ Soft deletes en entidades principales
- ✅ Timestamps automáticos

## Solución de Problemas

### Error de conexión a MySQL

Si obtienes el error `ER_NOT_SUPPORTED_AUTH_MODE`:

```sql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'tu_contraseña';
FLUSH PRIVILEGES;
```

### Puerto 3000 en uso

Cambiar el puerto en el archivo `.env`:
```env
PORT=3001
```

### Problemas con charset

Verificar que MySQL esté configurado correctamente:
```sql
SHOW VARIABLES LIKE 'character_set%';
SHOW VARIABLES LIKE 'collation%';
```

## Notas Importantes

- ⚠️ La opción `synchronize` en TypeORM está en `false` para evitar cambios automáticos en la base de datos en producción
- 🔒 En producción, configurar variables de entorno seguras
- 📝 Todas las rutas tienen el prefijo `/api`
- 🌐 CORS está habilitado para desarrollo (configurar apropiadamente en producción)
- ✅ Se usa validación global con pipes de NestJS

## Licencia

UNLICENSED
