import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiExtraModels, getSchemaPath, ApiQuery } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards, Query } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/entities/usuario.entity';

@ApiTags('Doctores')
@ApiExtraModels(CreateDoctorDto)
@ApiExtraModels(UpdateDoctorDto)
@Controller('doctores')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.SECRETARIA)
  @ApiOperation({ summary: 'Crear doctor', description: 'Registra un nuevo doctor en el sistema.' })
  @ApiBody({
    type: CreateDoctorDto,
    examples: {
      ejemplo: {
        summary: 'Ejemplo de creación',
        value: {
          nombre: 'Ana',
          apellido: 'García',
          telefono: '1122334455',
          email: 'ana.garcia@mail.com',
          matricula: 'MAT12345',
          activo: true,
          especialidades: [1, 2]
        }
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'Doctor creado correctamente.',
    schema: {
      type: 'object',
      properties: {
        nombre: { type: 'string', example: 'Ana' },
        apellido: { type: 'string', example: 'García' },
        telefono: { type: 'string', example: '1122334455' },
        email: { type: 'string', example: 'ana.garcia@mail.com' },
        matricula: { type: 'string', example: 'MAT12345' },
        activo: { type: 'boolean', example: true },
        especialidades: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              idEspecialidad: { type: 'number', example: 1 },
              nombreEspecialidad: { type: 'string', example: 'Cardiología' }
            }
          }
        }
      },
      example: {
        nombre: 'Ana',
        apellido: 'García',
        telefono: '1122334455',
        email: 'ana.garcia@mail.com',
        matricula: 'MAT12345',
        activo: true,
        especialidades: [
          { idEspecialidad: 1, nombreEspecialidad: 'Cardiología' },
          { idEspecialidad: 2, nombreEspecialidad: 'Clínica Médica' }
        ]
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos o faltantes.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos o faltantes.' })
  @ApiResponse({ status: 401, description: 'No autenticado.' })
  @ApiResponse({ status: 403, description: 'No autorizado.' })
  @ApiResponse({ status: 404, description: 'Recurso no encontrado.' })
  create(@Body() createDoctorDto: CreateDoctorDto) {
    return this.doctorService.create(createDoctorDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.SECRETARIA, UserRole.DOCTOR)
  @ApiOperation({ summary: 'Listar doctores', description: 'Obtiene la lista de todos los doctores registrados, con soporte de paginación, filtrado y ordenamiento.' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Número de página', example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Cantidad de resultados por página', example: 10 })
  @ApiQuery({ name: 'sort', required: false, type: String, description: 'Campo para ordenar', example: 'apellido' })
  @ApiQuery({ name: 'order', required: false, enum: ['ASC', 'DESC'], description: 'Dirección de ordenamiento', example: 'ASC' })
  @ApiQuery({ name: 'nombre', required: false, type: String, description: 'Filtrar por nombre', example: 'Ana' })
  @ApiQuery({ name: 'apellido', required: false, type: String, description: 'Filtrar por apellido', example: 'García' })
  @ApiQuery({ name: 'matricula', required: false, type: String, description: 'Filtrar por matrícula', example: 'MAT12345' })
  @ApiQuery({ name: 'activo', required: false, type: Boolean, description: 'Filtrar por estado activo', example: true })
  @ApiResponse({
    status: 200,
    description: 'Listado de doctores paginado.',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              nombre: { type: 'string', example: 'Ana' },
              apellido: { type: 'string', example: 'García' },
              telefono: { type: 'string', example: '1122334455' },
              email: { type: 'string', example: 'ana.garcia@mail.com' },
              matricula: { type: 'string', example: 'MAT12345' },
              activo: { type: 'boolean', example: true },
              especialidades: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    idEspecialidad: { type: 'number', example: 1 },
                    nombreEspecialidad: { type: 'string', example: 'Cardiología' }
                  }
                }
              }
            }
          }
        },
        total: { type: 'number', example: 1 },
        page: { type: 'number', example: 1 },
        limit: { type: 'number', example: 10 }
      },
      example: {
        data: [
          {
            nombre: 'Ana',
            apellido: 'García',
            telefono: '1122334455',
            email: 'ana.garcia@mail.com',
            matricula: 'MAT12345',
            activo: true,
            especialidades: [
              { idEspecialidad: 1, nombreEspecialidad: 'Cardiología' },
              { idEspecialidad: 2, nombreEspecialidad: 'Clínica Médica' }
            ]
          }
        ],
        total: 1,
        page: 1,
        limit: 10
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos o faltantes.' })
  @ApiResponse({ status: 401, description: 'No autenticado.' })
  @ApiResponse({ status: 403, description: 'No autorizado.' })
  @ApiResponse({ status: 404, description: 'Recurso no encontrado.' })
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sort') sort?: string,
    @Query('order') order?: 'ASC' | 'DESC',
    @Query('nombre') nombre?: string,
    @Query('apellido') apellido?: string,
    @Query('matricula') matricula?: string,
    @Query('activo') activo?: boolean
  ) {
    return this.doctorService.findAll({ page, limit, sort, order, nombre, apellido, matricula, activo });
  }

  @Get('activos')
  @Roles(UserRole.ADMIN, UserRole.SECRETARIA, UserRole.DOCTOR)
  @ApiOperation({ summary: 'Listar doctores activos', description: 'Obtiene los doctores que están activos en el sistema, con soporte de paginación, filtrado y ordenamiento.' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Número de página', example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Cantidad de resultados por página', example: 10 })
  @ApiQuery({ name: 'sort', required: false, type: String, description: 'Campo para ordenar', example: 'apellido' })
  @ApiQuery({ name: 'order', required: false, enum: ['ASC', 'DESC'], description: 'Dirección de ordenamiento', example: 'ASC' })
  @ApiQuery({ name: 'nombre', required: false, type: String, description: 'Filtrar por nombre', example: 'Ana' })
  @ApiQuery({ name: 'apellido', required: false, type: String, description: 'Filtrar por apellido', example: 'García' })
  @ApiQuery({ name: 'matricula', required: false, type: String, description: 'Filtrar por matrícula', example: 'MAT12345' })
  @ApiResponse({
    status: 200,
    description: 'Listado de doctores activos paginado.',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              nombre: { type: 'string', example: 'Ana' },
              apellido: { type: 'string', example: 'García' },
              telefono: { type: 'string', example: '1122334455' },
              email: { type: 'string', example: 'ana.garcia@mail.com' },
              matricula: { type: 'string', example: 'MAT12345' },
              activo: { type: 'boolean', example: true },
              especialidades: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    idEspecialidad: { type: 'number', example: 1 },
                    nombreEspecialidad: { type: 'string', example: 'Cardiología' }
                  }
                }
              }
            }
          }
        },
        total: { type: 'number', example: 1 },
        page: { type: 'number', example: 1 },
        limit: { type: 'number', example: 10 }
      },
      example: {
        data: [
          {
            nombre: 'Ana',
            apellido: 'García',
            telefono: '1122334455',
            email: 'ana.garcia@mail.com',
            matricula: 'MAT12345',
            activo: true,
            especialidades: [
              { idEspecialidad: 1, nombreEspecialidad: 'Cardiología' },
              { idEspecialidad: 2, nombreEspecialidad: 'Clínica Médica' }
            ]
          }
        ],
        total: 1,
        page: 1,
        limit: 10
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos o faltantes.' })
  @ApiResponse({ status: 401, description: 'No autenticado.' })
  @ApiResponse({ status: 403, description: 'No autorizado.' })
  @ApiResponse({ status: 404, description: 'Recurso no encontrado.' })
  findActivos(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sort') sort?: string,
    @Query('order') order?: 'ASC' | 'DESC',
    @Query('nombre') nombre?: string,
    @Query('apellido') apellido?: string,
    @Query('matricula') matricula?: string
  ) {
    return this.doctorService.findActivos({ page, limit, sort, order, nombre, apellido, matricula });
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.SECRETARIA, UserRole.DOCTOR)
  @ApiOperation({ summary: 'Obtener doctor por ID', description: 'Devuelve el detalle de un doctor a partir de su ID.' })
  @ApiParam({ name: 'id', type: Number, description: 'ID del doctor', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Detalle del doctor.',
    schema: {
      type: 'object',
      properties: {
        nombre: { type: 'string', example: 'Ana' },
        apellido: { type: 'string', example: 'García' },
        telefono: { type: 'string', example: '1122334455' },
        email: { type: 'string', example: 'ana.garcia@mail.com' },
        matricula: { type: 'string', example: 'MAT12345' },
        activo: { type: 'boolean', example: true },
        especialidades: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              idEspecialidad: { type: 'number', example: 1 },
              nombreEspecialidad: { type: 'string', example: 'Cardiología' }
            }
          }
        }
      },
      example: {
        nombre: 'Ana',
        apellido: 'García',
        telefono: '1122334455',
        email: 'ana.garcia@mail.com',
        matricula: 'MAT12345',
        activo: true,
        especialidades: [
          { idEspecialidad: 1, nombreEspecialidad: 'Cardiología' },
          { idEspecialidad: 2, nombreEspecialidad: 'Clínica Médica' }
        ]
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos o faltantes.' })
  @ApiResponse({ status: 401, description: 'No autenticado.' })
  @ApiResponse({ status: 403, description: 'No autorizado.' })
  @ApiResponse({ status: 404, description: 'Doctor no encontrado.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.doctorService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.SECRETARIA)
  @ApiOperation({ summary: 'Actualizar doctor', description: 'Modifica los datos de un doctor existente.' })
  @ApiParam({ name: 'id', type: Number, description: 'ID del doctor', example: 1 })
  @ApiBody({
    type: UpdateDoctorDto,
    examples: {
      ejemplo: {
        summary: 'Ejemplo de actualización',
        value: {
          telefono: '1199887766',
          activo: false,
          especialidades: [2, 3]
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Doctor actualizado correctamente.',
    schema: {
      type: 'object',
      properties: {
        nombre: { type: 'string', example: 'Ana' },
        apellido: { type: 'string', example: 'García' },
        telefono: { type: 'string', example: '1199887766' },
        email: { type: 'string', example: 'ana.garcia@mail.com' },
        matricula: { type: 'string', example: 'MAT12345' },
        activo: { type: 'boolean', example: false },
        especialidades: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              idEspecialidad: { type: 'number', example: 1 },
              nombreEspecialidad: { type: 'string', example: 'Cardiología' }
            }
          }
        }
      },
      example: {
        nombre: 'Ana',
        apellido: 'García',
        telefono: '1199887766',
        email: 'ana.garcia@mail.com',
        matricula: 'MAT12345',
        activo: false,
        especialidades: [
          { idEspecialidad: 1, nombreEspecialidad: 'Cardiología' },
          { idEspecialidad: 2, nombreEspecialidad: 'Clínica Médica' }
        ]
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos o faltantes.' })
  @ApiResponse({ status: 401, description: 'No autenticado.' })
  @ApiResponse({ status: 403, description: 'No autorizado.' })
  @ApiResponse({ status: 404, description: 'Doctor no encontrado.' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateDoctorDto: UpdateDoctorDto) {
    return this.doctorService.update(id, updateDoctorDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Eliminar doctor', description: 'Elimina un doctor del sistema por su ID.' })
  @ApiParam({ name: 'id', type: Number, description: 'ID del doctor', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Doctor eliminado correctamente.',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Doctor eliminado correctamente.' }
      },
      example: {
        message: 'Doctor eliminado correctamente.'
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos o faltantes.' })
  @ApiResponse({ status: 401, description: 'No autenticado.' })
  @ApiResponse({ status: 403, description: 'No autorizado.' })
  @ApiResponse({ status: 404, description: 'Doctor no encontrado.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.doctorService.remove(id);
  }
}
