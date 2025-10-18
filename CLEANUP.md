# Limpieza de Archivos Antiguos

Después de corregir el sistema de autenticación, hay algunos archivos marcados como `.old` que deben eliminarse.

## 🧹 Archivos para Eliminar

```bash
# Desde la raíz del proyecto

# Windows PowerShell
Remove-Item src\entities\user.entity.ts.old
Remove-Item src\modules\cobertura.controller.ts.old
Remove-Item src\modules\cobertura.service.ts.old

# Windows CMD
del src\entities\user.entity.ts.old
del src\modules\cobertura.controller.ts.old
del src\modules\cobertura.service.ts.old

# Linux/Mac
rm src/entities/user.entity.ts.old
rm src/modules/cobertura.controller.ts.old
rm src/modules/cobertura.service.ts.old
```

## 📁 Carpeta auth Antigua (Opcional)

También existe la carpeta `src/auth/` que ya no se usa. Puedes eliminarla:

```bash
# Windows PowerShell
Remove-Item -Recurse -Force src\auth

# Windows CMD
rmdir /s /q src\auth

# Linux/Mac
rm -rf src/auth
```

## ✅ Verificar que Todo Funciona

Después de eliminar los archivos:

```bash
# Compilar el proyecto
npm run build

# Si compila sin errores, todo está bien
```

## 🔍 Lista de Archivos Obsoletos

- ❌ `src/entities/user.entity.ts.old` - Entidad duplicada
- ❌ `src/modules/cobertura.controller.ts.old` - Versión antigua
- ❌ `src/modules/cobertura.service.ts.old` - Versión antigua
- ❌ `src/auth/` (carpeta completa) - Módulo antiguo duplicado

## ✅ Estructura Correcta Final

Después de la limpieza, deberías tener:

```
src/
├── entities/
│   ├── usuario.entity.ts ✅ (única entidad de usuario)
│   └── ...
├── modules/
│   ├── auth/ ✅ (módulo de autenticación único)
│   ├── cobertura/
│   │   ├── cobertura.controller.ts ✅
│   │   ├── cobertura.service.ts ✅
│   │   └── cobertura.module.ts ✅
│   └── ...
└── ...
```

**NO** debe existir:
- ❌ `src/auth/` (carpeta antigua)
- ❌ `src/entities/user.entity.ts`
- ❌ Archivos con extensión `.old`
