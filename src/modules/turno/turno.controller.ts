import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiBody, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';
import { ApiForbiddenResponse } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { TurnoService } from './turno.service';
import { CreateTurnoDto } from './dto/create-turno.dto';
import { UpdateTurnoDto } from './dto/update-turno.dto';
import { EstadoTurno } from '../../common/enums/estado-turno.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/entities/usuario.entity';
import { GetUser } from '../auth/decorators/get-user.decorator';

@ApiTags('Turnos')
@ApiExtraModels(CreateTurnoDto)
@ApiExtraModels(UpdateTurnoDto)
@Controller('turnos')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class TurnoController {
  constructor(private readonly turnoService: TurnoService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.SECRETARIA, UserRole.PACIENTE)
  @ApiOperation({ summary: 'Crear un nuevo turno', description: 'Crea un turno para un paciente, validando disponibilidad y reglas de negocio.' })
  @ApiBody({
    type: CreateTurnoDto,
    examples: {
      ejemplo: {
        summary: 'Ejemplo de creación',
        value: {
          idPaciente: '12345678',
          idDoctor: 1,
          idConsultorio: 2,
          fechaHora: '2025-10-18T10:00:00.000Z',
          duracionMinutos: 30,
          estado: 'pendiente'
        }
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'Turno creado correctamente.',
    schema: { $ref: getSchemaPath(CreateTurnoDto) },
    example: {
      idTurno: 1,
      idPaciente: '12345678',
      idDoctor: 1,
      idConsultorio: 2,
      fechaHora: '2025-10-18T10:00:00.000Z',
      duracionMinutos: 30,
      estado: 'pendiente',
      paciente: {
        dniPaciente: '12345678',
        nombre: 'Juan',
        apellido: 'Pérez',
        email: 'juan.perez@mail.com',
        activo: true
      },
      doctor: {
        idDoctor: 1,
        nombre: 'Ana',
        apellido: 'García',
        email: 'ana.garcia@mail.com',
        matricula: 'MAT12345',
        activo: true
      },
      consultorio: {
        idConsultorio: 2,
        nombre: 'Central',
        activo: true
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Ya existe un turno confirmado en ese horario o datos inválidos.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos o faltantes.' })
  @ApiResponse({ status: 401, description: 'No autenticado.' })
  @ApiResponse({ status: 403, description: 'No autorizado.' })
  @ApiResponse({ status: 404, description: 'Recurso no encontrado.' })
  create(@Body() createTurnoDto: CreateTurnoDto, @GetUser() user: any) {
    return this.turnoService.create(createTurnoDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.SECRETARIA)
  @ApiOperation({ summary: 'Listar todos los turnos', description: 'Obtiene la lista completa de turnos registrados en el sistema con paginación, filtrado y ordenamiento.' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1, description: 'Número de página' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10, description: 'Cantidad de resultados por página' })
  @ApiQuery({ name: 'sortBy', required: false, type: String, example: 'fechaHora', description: 'Campo por el cual ordenar' })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['ASC', 'DESC'], example: 'ASC', description: 'Dirección de ordenamiento' })
  @ApiQuery({ name: 'filter', required: false, type: String, example: 'paciente', description: 'Filtro por nombre de paciente, doctor o consultorio' })
  @ApiResponse({
    status: 200,
    description: 'Listado paginado de turnos.',
    schema: {
      type: 'object',
      properties: {
        data: { type: 'array', items: { $ref: getSchemaPath(CreateTurnoDto) } },
        total: { type: 'number', example: 1 },
        page: { type: 'number', example: 1 },
        limit: { type: 'number', example: 10 }
      }
    },
    example: {
      data: [
        {
          idTurno: 1,
          idPaciente: '12345678',
          idDoctor: 1,
          idConsultorio: 2,
          fechaHora: '2025-10-18T10:00:00.000Z',
          duracionMinutos: 30,
          estado: 'pendiente',
          paciente: {
            dniPaciente: '12345678',
            nombre: 'Juan',
            apellido: 'Pérez',
            email: 'juan.perez@mail.com',
            activo: true
          },
          doctor: {
            idDoctor: 1,
            nombre: 'Ana',
            apellido: 'García',
            email: 'ana.garcia@mail.com',
            matricula: 'MAT12345',
            activo: true
          },
          consultorio: {
            idConsultorio: 2,
            nombre: 'Central',
            activo: true
          }
        }
      ],
      total: 1,
      page: 1,
      limit: 10
    }
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos o faltantes.' })
  @ApiResponse({ status: 401, description: 'No autenticado.' })
  @ApiResponse({ status: 403, description: 'No autorizado.' })
  @ApiResponse({ status: 404, description: 'Recurso no encontrado.' })
     findAll(
       @Query('page') page?: number,
       @Query('limit') limit?: number,
       @Query('sortBy') sortBy?: string,
       @Query('sortOrder') sortOrder?: 'ASC' | 'DESC',
       @Query('filter') filter?: string,
       @GetUser() user?: any
     ) {
       const isAdmin = user && user.rol === UserRole.ADMIN;
       return this.turnoService.findAll({
         page: page ? Number(page) : undefined,
         limit: limit ? Number(limit) : undefined,
         sortBy,
         sortOrder,
         filter,
         isAdmin,
       });
     }

  @Get('mis-turnos')
  @Roles(UserRole.DOCTOR, UserRole.PACIENTE)
  @ApiOperation({ summary: 'Obtener mis turnos', description: 'Devuelve los turnos asociados al usuario autenticado (doctor o paciente).' })
  @ApiResponse({
    status: 200,
    description: 'Listado de turnos del usuario.',
    schema: { type: 'array', items: { $ref: getSchemaPath(CreateTurnoDto) } },
    example: [
      {
        idTurno: 1,
        idPaciente: '12345678',
        idDoctor: 1,
        idConsultorio: 2,
        fechaHora: '2025-10-18T10:00:00.000Z',
        duracionMinutos: 30,
        estado: 'pendiente',
        paciente: {
          dniPaciente: '12345678',
          nombre: 'Juan',
          apellido: 'Pérez',
          email: 'juan.perez@mail.com',
          activo: true
        },
        doctor: {
          idDoctor: 1,
          nombre: 'Ana',
          apellido: 'García',
          email: 'ana.garcia@mail.com',
          matricula: 'MAT12345',
          activo: true
        },
        consultorio: {
          idConsultorio: 2,
          nombre: 'Central',
          activo: true
        }
      }
    ]
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos o faltantes.' })
  @ApiResponse({ status: 401, description: 'No autenticado.' })
  @ApiResponse({ status: 403, description: 'No autorizado.' })
  @ApiResponse({ status: 404, description: 'Recurso no encontrado.' })
     async getMisTurnos(@GetUser() user: any) {
       const isAdmin = user.rol === UserRole.ADMIN;
       if (user.rol === UserRole.DOCTOR) {
         return this.turnoService.findByDoctor(parseInt(user.idReferencia), isAdmin);
       } else if (user.rol === UserRole.PACIENTE) {
         return this.turnoService.findByPaciente(user.idReferencia, isAdmin);
       }
     }

  @Get('estado/:estado')
  @Roles(UserRole.ADMIN, UserRole.SECRETARIA, UserRole.DOCTOR)
  @ApiOperation({ summary: 'Buscar turnos por estado', description: 'Filtra los turnos según su estado (pendiente, confirmado, etc.).' })
  @ApiParam({ name: 'estado', enum: EstadoTurno, description: 'Estado del turno', example: 'pendiente' })
  @ApiResponse({
    status: 200,
    description: 'Listado de turnos filtrados por estado.',
    schema: { type: 'array', items: { $ref: getSchemaPath(CreateTurnoDto) } },
    example: [
      {
        idTurno: 1,
        idPaciente: '12345678',
        idDoctor: 1,
        idConsultorio: 2,
        fechaHora: '2025-10-18T10:00:00.000Z',
        duracionMinutos: 30,
        estado: 'pendiente',
        paciente: {
          dniPaciente: '12345678',
          nombre: 'Juan',
          apellido: 'Pérez',
          email: 'juan.perez@mail.com',
          activo: true
        },
        doctor: {
          idDoctor: 1,
          nombre: 'Ana',
          apellido: 'García',
          email: 'ana.garcia@mail.com',
          matricula: 'MAT12345',
          activo: true
        },
        consultorio: {
          idConsultorio: 2,
          nombre: 'Central',
          activo: true
        }
      }
    ]
  })
  @ApiResponse({ status: 401, description: 'No autenticado.' })
  @ApiResponse({ status: 403, description: 'No autorizado.' })
     findByEstado(@Param('estado') estado: EstadoTurno, @GetUser() user?: any) {
       const isAdmin = user && user.rol === UserRole.ADMIN;
       return this.turnoService.findByEstado(estado, isAdmin);
     }

  @Get('paciente/:dni')
  @Roles(UserRole.ADMIN, UserRole.SECRETARIA)
  @ApiOperation({ summary: 'Buscar turnos por paciente', description: 'Obtiene todos los turnos asociados a un paciente por su DNI.' })
  @ApiParam({ name: 'dni', type: String, description: 'DNI del paciente', example: '12345678' })
  @ApiResponse({
    status: 200,
    description: 'Listado de turnos del paciente.',
    schema: { type: 'array', items: { $ref: getSchemaPath(CreateTurnoDto) } },
    example: [
      {
        idTurno: 1,
        idPaciente: '12345678',
        idDoctor: 1,
        idConsultorio: 2,
        fechaHora: '2025-10-18T10:00:00.000Z',
        duracionMinutos: 30,
        estado: 'pendiente',
        paciente: {
          dniPaciente: '12345678',
          nombre: 'Juan',
          apellido: 'Pérez',
          email: 'juan.perez@mail.com',
          activo: true
        },
        doctor: {
          idDoctor: 1,
          nombre: 'Ana',
          apellido: 'García',
          email: 'ana.garcia@mail.com',
          matricula: 'MAT12345',
          activo: true
        },
        consultorio: {
          idConsultorio: 2,
          nombre: 'Central',
          activo: true
        }
      }
    ]
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos o faltantes.' })
  @ApiResponse({ status: 401, description: 'No autenticado.' })
  @ApiResponse({ status: 403, description: 'No autorizado.' })
  @ApiResponse({ status: 404, description: 'Paciente no encontrado.' })
     findByPaciente(@Param('dni') dni: string, @GetUser() user?: any) {
       const isAdmin = user && user.rol === UserRole.ADMIN;
       return this.turnoService.findByPaciente(dni, isAdmin);
     }

  @Get('doctor/:id')
  @Roles(UserRole.ADMIN, UserRole.SECRETARIA, UserRole.DOCTOR)
  @ApiOperation({ summary: 'Buscar turnos por doctor', description: 'Obtiene todos los turnos asociados a un doctor por su ID.' })
  @ApiParam({ name: 'id', type: Number, description: 'ID del doctor', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Listado de turnos del doctor.',
    schema: { type: 'array', items: { $ref: getSchemaPath(CreateTurnoDto) } },
    example: [
      {
        idTurno: 1,
        idPaciente: '12345678',
        idDoctor: 1,
        idConsultorio: 2,
        fechaHora: '2025-10-18T10:00:00.000Z',
        duracionMinutos: 30,
        estado: 'pendiente',
        paciente: {
          dniPaciente: '12345678',
          nombre: 'Juan',
          apellido: 'Pérez',
          email: 'juan.perez@mail.com',
          activo: true
        },
        doctor: {
          idDoctor: 1,
          nombre: 'Ana',
          apellido: 'García',
          email: 'ana.garcia@mail.com',
          matricula: 'MAT12345',
          activo: true
        },
        consultorio: {
          idConsultorio: 2,
          nombre: 'Central',
          activo: true
        }
      }
    ]
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos o faltantes.' })
  @ApiResponse({ status: 401, description: 'No autenticado.' })
  @ApiResponse({ status: 403, description: 'No autorizado.' })
  @ApiResponse({ status: 404, description: 'Doctor no encontrado.' })
     findByDoctor(@Param('id', ParseIntPipe) id: number, @GetUser() user: any) {
       if (user.rol === UserRole.DOCTOR && parseInt(user.idReferencia) !== id) {
         throw new Error('No tiene permisos para ver turnos de otros médicos');
       }
       const isAdmin = user.rol === UserRole.ADMIN;
       return this.turnoService.findByDoctor(id, isAdmin);
     }

  @Get('fecha')
  @Roles(UserRole.ADMIN, UserRole.SECRETARIA, UserRole.DOCTOR)
  @ApiOperation({ summary: 'Buscar turnos por fecha', description: 'Filtra los turnos por una fecha específica.' })
  @ApiQuery({ name: 'fecha', type: String, description: 'Fecha en formato ISO (YYYY-MM-DD)', example: '2025-10-18' })
  @ApiResponse({
    status: 200,
    description: 'Listado de turnos en la fecha indicada.',
    schema: { type: 'array', items: { $ref: getSchemaPath(CreateTurnoDto) } },
    example: [
      {
        idTurno: 1,
        idPaciente: '12345678',
        idDoctor: 1,
        idConsultorio: 2,
        fechaHora: '2025-10-18T10:00:00.000Z',
        duracionMinutos: 30,
        estado: 'pendiente',
        paciente: {
          dniPaciente: '12345678',
          nombre: 'Juan',
          apellido: 'Pérez',
          email: 'juan.perez@mail.com',
          activo: true
        },
        doctor: {
          idDoctor: 1,
          nombre: 'Ana',
          apellido: 'García',
          email: 'ana.garcia@mail.com',
          matricula: 'MAT12345',
          activo: true
        },
        consultorio: {
          idConsultorio: 2,
          nombre: 'Central',
          activo: true
        }
      }
    ]
  })
  @ApiResponse({ status: 400, description: 'Fecha inválida.' })
  @ApiResponse({ status: 401, description: 'No autenticado.' })
  @ApiResponse({ status: 403, description: 'No autorizado.' })
  @ApiResponse({ status: 404, description: 'Recurso no encontrado.' })
     findByFecha(@Query('fecha') fecha: string, @GetUser() user?: any) {
       const isAdmin = user && user.rol === UserRole.ADMIN;
       return this.turnoService.findByFecha(new Date(fecha), isAdmin);
     }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.SECRETARIA, UserRole.DOCTOR, UserRole.PACIENTE)
  @ApiOperation({ summary: 'Obtener un turno por ID', description: 'Devuelve el detalle de un turno específico.' })
  @ApiParam({ name: 'id', type: Number, description: 'ID del turno', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Detalle del turno.',
    schema: { $ref: getSchemaPath(CreateTurnoDto) },
    example: {
      idTurno: 1,
      idPaciente: '12345678',
      idDoctor: 1,
      idConsultorio: 2,
      fechaHora: '2025-10-18T10:00:00.000Z',
      duracionMinutos: 30,
      estado: 'pendiente',
      paciente: {
        dniPaciente: '12345678',
        nombre: 'Juan',
        apellido: 'Pérez',
        email: 'juan.perez@mail.com',
        activo: true
      },
      doctor: {
        idDoctor: 1,
        nombre: 'Ana',
        apellido: 'García',
        email: 'ana.garcia@mail.com',
        matricula: 'MAT12345',
        activo: true
      },
      consultorio: {
        idConsultorio: 2,
        nombre: 'Central',
        activo: true
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos o faltantes.' })
  @ApiResponse({ status: 401, description: 'No autenticado.' })
  @ApiResponse({ status: 403, description: 'No autorizado.' })
  @ApiResponse({ status: 404, description: 'Turno no encontrado.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.turnoService.findOne(id);
  }


  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.SECRETARIA)
  @ApiOperation({ summary: 'Eliminar turno (soft delete)', description: 'Marca un turno como inactivo.' })
  @ApiParam({ name: 'id', type: Number, description: 'ID del turno', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Turno marcado como inactivo.',
    example: {
      message: 'Turno marcado como inactivo.'
    }
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.turnoService.remove(id);
  }

  @Get('inactivos')
  @Roles(UserRole.ADMIN, UserRole.SECRETARIA)
  @ApiOperation({ summary: 'Listar turnos eliminados', description: 'Obtiene los turnos marcados como inactivos.' })
  @ApiResponse({ status: 200, description: 'Listado de turnos inactivos.' })
    /**
     * Listar turnos eliminados (solo admin o secretaria)
     * @returns Listado de turnos marcados como inactivos (soft delete)
     */
    @ApiBearerAuth()
    @ApiForbiddenResponse({ description: 'No autorizado. Solo el admin o secretaria puede acceder a este recurso.' })
    findInactivos(
      @Query('page') page?: number,
      @Query('limit') limit?: number,
      @Query('sortBy') sortBy?: string,
      @Query('sortOrder') sortOrder?: 'ASC' | 'DESC',
      @Query('filter') filter?: string,
    ) {
      return this.turnoService.findInactivos({ page, limit, sortBy, sortOrder, filter });
    }

  @Patch(':id/restaurar')
  @Roles(UserRole.ADMIN, UserRole.SECRETARIA)
  @ApiOperation({ summary: 'Restaurar turno eliminado', description: 'Restaura un turno marcado como inactivo.' })
  @ApiParam({ name: 'id', type: Number, description: 'ID del turno', example: 1 })
  @ApiResponse({ status: 200, description: 'Turno restaurado.' })
    /**
     * Restaurar turno eliminado (solo admin o secretaria)
     * @param id ID del turno
     * @returns Turno restaurado
     */
    @ApiBearerAuth()
    @ApiForbiddenResponse({ description: 'No autorizado. Solo el admin o secretaria puede acceder a este recurso.' })
    restore(@Param('id', ParseIntPipe) id: number) {
      return this.turnoService.restore(id);
    }
  @ApiResponse({ status: 400, description: 'Datos inválidos o faltantes.' })
  @ApiResponse({ status: 401, description: 'No autenticado.' })
  @ApiResponse({ status: 403, description: 'No autorizado.' })
  @ApiResponse({ status: 404, description: 'Turno no encontrado.' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateTurnoDto: UpdateTurnoDto) {
    return this.turnoService.update(id, updateTurnoDto);
  }

  @Patch(':id/confirmar')
  @Roles(UserRole.ADMIN, UserRole.SECRETARIA, UserRole.DOCTOR)
  @ApiOperation({ summary: 'Confirmar turno', description: 'Confirma un turno pendiente.' })
  @ApiParam({ name: 'id', type: Number, description: 'ID del turno', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Turno confirmado correctamente.',
    example: {
      message: 'Turno confirmado correctamente.'
    }
  })
  @ApiResponse({ status: 400, description: 'No se puede confirmar el turno.' })
  @ApiResponse({ status: 401, description: 'No autenticado.' })
  @ApiResponse({ status: 403, description: 'No autorizado.' })
  @ApiResponse({ status: 404, description: 'Turno no encontrado.' })
  confirmar(@Param('id', ParseIntPipe) id: number) {
    return this.turnoService.confirmarTurno(id);
  }

  @Patch(':id/cancelar')
  @Roles(UserRole.ADMIN, UserRole.SECRETARIA, UserRole.PACIENTE, UserRole.DOCTOR)
  @ApiOperation({ summary: 'Cancelar turno', description: 'Cancela un turno existente.' })
  @ApiParam({ name: 'id', type: Number, description: 'ID del turno', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Turno cancelado correctamente.',
    example: {
      message: 'Turno cancelado correctamente.'
    }
  })
  @ApiResponse({ status: 400, description: 'No se puede cancelar el turno.' })
  @ApiResponse({ status: 401, description: 'No autenticado.' })
  @ApiResponse({ status: 403, description: 'No autorizado.' })
  @ApiResponse({ status: 404, description: 'Turno no encontrado.' })
  cancelar(@Param('id', ParseIntPipe) id: number) {
    return this.turnoService.cancelarTurno(id);
  }

  @Patch(':id/completar')
  @Roles(UserRole.ADMIN, UserRole.SECRETARIA, UserRole.DOCTOR)
  @ApiOperation({ summary: 'Completar turno', description: 'Marca un turno como completado.' })
  @ApiParam({ name: 'id', type: Number, description: 'ID del turno', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Turno completado correctamente.',
    example: {
      message: 'Turno completado correctamente.'
    }
  })
  @ApiResponse({ status: 400, description: 'No se puede completar el turno.' })
  @ApiResponse({ status: 401, description: 'No autenticado.' })
  @ApiResponse({ status: 403, description: 'No autorizado.' })
  @ApiResponse({ status: 404, description: 'Turno no encontrado.' })
  completar(@Param('id', ParseIntPipe) id: number) {
    return this.turnoService.completarTurno(id);
  }
}
