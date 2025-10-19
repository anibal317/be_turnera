
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, getSchemaPath, ApiExtraModels } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards, Query } from '@nestjs/common';
import { EspecialidadService } from './especialidad.service';
import { CreateEspecialidadDto } from './dto/create-especialidad.dto';
import { UpdateEspecialidadDto } from './dto/update-especialidad.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/entities/usuario.entity';
import { Especialidad } from './entities/especialidad.entity';

@ApiTags('Especialidades')
@Controller('especialidades')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@ApiExtraModels(Especialidad)
export class EspecialidadController {
  constructor(private readonly especialidadService: EspecialidadService) {}


  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Crear especialidad', description: 'Registra una nueva especialidad médica.' })
  @ApiResponse({
    status: 201,
    description: 'Especialidad creada correctamente.',
    example: {
      idEspecialidad: 1,
      nombreEspecialidad: 'Cardiología',
      doctores: [
        {
          idDoctor: 1,
          nombre: 'Ana',
          apellido: 'García',
          telefono: '123456789',
          email: 'ana.garcia@mail.com',
          matricula: 'MAT12345',
          activo: true,
          fechaRegistro: '2025-10-19T12:00:00.000Z',
          especialidades: [
            { idEspecialidad: 1, nombreEspecialidad: 'Cardiología' },
            { idEspecialidad: 2, nombreEspecialidad: 'Pediatría' }
          ]
        }
      ]
    }
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos o faltantes.' })
  @ApiResponse({ status: 401, description: 'No autenticado.' })
  @ApiResponse({ status: 403, description: 'No autorizado.' })
  create(@Body() createEspecialidadDto: CreateEspecialidadDto) {
    return this.especialidadService.create(createEspecialidadDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar especialidades', description: 'Obtiene la lista de todas las especialidades médicas con paginación, filtrado y ordenamiento.' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1, description: 'Número de página' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10, description: 'Cantidad de resultados por página' })
  @ApiQuery({ name: 'sortBy', required: false, type: String, example: 'nombre', description: 'Campo por el cual ordenar' })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['ASC', 'DESC'], example: 'ASC', description: 'Dirección de ordenamiento' })
  @ApiQuery({ name: 'filter', required: false, type: String, example: 'cardio', description: 'Filtro por nombre de especialidad' })
  @ApiResponse({
    status: 200,
    description: 'Listado paginado de especialidades.',
    schema: {
      type: 'object',
      properties: {
        data: { type: 'array', items: { $ref: getSchemaPath(Especialidad) } },
        total: { type: 'number', example: 2 },
        page: { type: 'number', example: 1 },
        limit: { type: 'number', example: 10 }
      }
    },
    example: {
      data: [
        {
          idEspecialidad: 1,
          nombreEspecialidad: 'Cardiología',
          doctores: [
            {
              idDoctor: 1,
              nombre: 'Ana',
              apellido: 'García',
              telefono: '123456789',
              email: 'ana.garcia@mail.com',
              matricula: 'MAT12345',
              activo: true,
              fechaRegistro: '2025-10-19T12:00:00.000Z',
              especialidades: [
                { idEspecialidad: 1, nombreEspecialidad: 'Cardiología' },
                { idEspecialidad: 2, nombreEspecialidad: 'Pediatría' }
              ]
            }
          ]
        },
        {
          idEspecialidad: 2,
          nombreEspecialidad: 'Pediatría',
          doctores: []
        }
      ],
      total: 2,
      page: 1,
      limit: 10
    }
  })
  @ApiResponse({ status: 401, description: 'No autenticado.' })
  @ApiResponse({ status: 403, description: 'No autorizado.' })
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'ASC' | 'DESC',
    @Query('filter') filter?: string,
  ) {
    return this.especialidadService.findAll({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      sortBy,
      sortOrder,
      filter,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener especialidad por ID', description: 'Devuelve el detalle de una especialidad a partir de su ID.' })
  @ApiParam({ name: 'id', type: Number, description: 'ID de la especialidad' })
  @ApiResponse({
    status: 200,
    description: 'Detalle de la especialidad.',
    example: {
      idEspecialidad: 1,
      nombreEspecialidad: 'Cardiología',
      doctores: [
        {
          idDoctor: 1,
          nombre: 'Ana',
          apellido: 'García',
          telefono: '123456789',
          email: 'ana.garcia@mail.com',
          matricula: 'MAT12345',
          activo: true,
          fechaRegistro: '2025-10-19T12:00:00.000Z',
          especialidades: [
            { idEspecialidad: 1, nombreEspecialidad: 'Cardiología' },
            { idEspecialidad: 2, nombreEspecialidad: 'Pediatría' }
          ]
        }
      ]
    }
  })
  @ApiResponse({ status: 404, description: 'Especialidad no encontrada.' })
  @ApiResponse({ status: 401, description: 'No autenticado.' })
  @ApiResponse({ status: 403, description: 'No autorizado.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.especialidadService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Actualizar especialidad', description: 'Modifica los datos de una especialidad existente.' })
  @ApiParam({ name: 'id', type: Number, description: 'ID de la especialidad' })
  @ApiResponse({
    status: 200,
    description: 'Especialidad actualizada correctamente.',
    example: {
      idEspecialidad: 1,
      nombreEspecialidad: 'Cardiología',
      doctores: [
        {
          idDoctor: 1,
          nombre: 'Ana',
          apellido: 'García',
          telefono: '123456789',
          email: 'ana.garcia@mail.com',
          matricula: 'MAT12345',
          activo: true,
          fechaRegistro: '2025-10-19T12:00:00.000Z',
          especialidades: [
            { idEspecialidad: 1, nombreEspecialidad: 'Cardiología' },
            { idEspecialidad: 2, nombreEspecialidad: 'Pediatría' }
          ]
        }
      ]
    }
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos o faltantes.' })
  @ApiResponse({ status: 404, description: 'Especialidad no encontrada.' })
  @ApiResponse({ status: 401, description: 'No autenticado.' })
  @ApiResponse({ status: 403, description: 'No autorizado.' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateEspecialidadDto: UpdateEspecialidadDto) {
    return this.especialidadService.update(id, updateEspecialidadDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Eliminar especialidad', description: 'Elimina una especialidad médica por su ID.' })
  @ApiParam({ name: 'id', type: Number, description: 'ID de la especialidad' })
  @ApiResponse({
    status: 200,
    description: 'Especialidad eliminada correctamente.',
    example: {
      message: 'Especialidad eliminada correctamente.'
    }
  })
  @ApiResponse({ status: 404, description: 'Especialidad no encontrada.' })
  @ApiResponse({ status: 401, description: 'No autenticado.' })
  @ApiResponse({ status: 403, description: 'No autorizado.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.especialidadService.remove(id);
  }
}
