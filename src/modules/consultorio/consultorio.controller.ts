import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, getSchemaPath, ApiExtraModels, ApiForbiddenResponse } from '@nestjs/swagger';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { UserRole } from '../auth/entities/usuario.entity';
import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query } from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { ConsultorioService } from './consultorio.service';
import { Consultorio } from './entities/consultorio.entity';

@ApiTags('Consultorios')
@Controller('consultorios')
@ApiBearerAuth()
@ApiExtraModels(Consultorio)
export class ConsultorioController {
  constructor(private readonly consultorioService: ConsultorioService) {}

  @Post()
  @ApiOperation({ summary: 'Crear consultorio', description: 'Registra un nuevo consultorio.' })
  @ApiResponse({
    status: 201,
    description: 'Consultorio creado correctamente.',
    example: {
      idConsultorio: 1,
      nombre: 'Central',
      activo: true,
      horariosDisponibles: [
        {
          idHorario: 1,
          diaSemana: 'LUNES',
          horaInicio: '08:00',
          horaFin: '12:00',
          duracionTurno: 30
        }
      ],
      turnos: [
        {
          idTurno: 1,
          fechaHora: '2025-10-19T09:00:00Z',
          estado: 'PENDIENTE'
        }
      ]
    }
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos o faltantes.' })
  @ApiResponse({ status: 401, description: 'No autenticado.' })
  @ApiResponse({ status: 403, description: 'No autorizado.' })
  create(@Body('nombre') nombre: string) {
    return this.consultorioService.create(nombre);
  }

  @Get()
  @ApiOperation({ summary: 'Listar consultorios', description: 'Obtiene la lista de todos los consultorios con paginación, filtrado y ordenamiento.' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1, description: 'Número de página' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10, description: 'Cantidad de resultados por página' })
  @ApiQuery({ name: 'sortBy', required: false, type: String, example: 'nombre', description: 'Campo por el cual ordenar' })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['ASC', 'DESC'], example: 'ASC', description: 'Dirección de ordenamiento' })
  @ApiQuery({ name: 'filter', required: false, type: String, example: 'central', description: 'Filtro por nombre de consultorio' })
  @ApiResponse({
    status: 200,
    description: 'Listado paginado de consultorios.',
    schema: {
      type: 'object',
      properties: {
        data: { type: 'array', items: { $ref: getSchemaPath(Consultorio) } },
        total: { type: 'number', example: 2 },
        page: { type: 'number', example: 1 },
        limit: { type: 'number', example: 10 }
      }
    },
    example: {
      data: [
        {
          idConsultorio: 1,
          nombre: 'Central',
          activo: true,
          horariosDisponibles: [
            {
              idHorario: 1,
              diaSemana: 'LUNES',
              horaInicio: '08:00',
              horaFin: '12:00',
              duracionTurno: 30
            }
          ],
          turnos: [
            {
              idTurno: 1,
              fechaHora: '2025-10-19T09:00:00Z',
              estado: 'PENDIENTE'
            }
          ]
        },
        {
          idConsultorio: 2,
          nombre: 'Anexo',
          activo: false,
          horariosDisponibles: [],
          turnos: []
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
    @GetUser() user?: any
  ) {
    const isAdmin = user && user.rol === UserRole.ADMIN;
    return this.consultorioService.findAll({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      sortBy,
      sortOrder,
      filter,
      isAdmin,
    });
  }

  @Get('activos')
  @ApiOperation({ summary: 'Listar consultorios activos', description: 'Obtiene los consultorios que están activos.' })
  @ApiResponse({
    status: 200,
    description: 'Listado de consultorios activos.',
    example: [
      {
        idConsultorio: 1,
        nombre: 'Central',
        activo: true,
        horariosDisponibles: [
          {
            idHorario: 1,
            diaSemana: 'LUNES',
            horaInicio: '08:00',
            horaFin: '12:00',
            duracionTurno: 30
          }
        ],
        turnos: [
          {
            idTurno: 1,
            fechaHora: '2025-10-19T09:00:00Z',
            estado: 'PENDIENTE'
          }
        ]
      }
    ]
  })
  @ApiResponse({ status: 401, description: 'No autenticado.' })
  @ApiResponse({ status: 403, description: 'No autorizado.' })
  findActivos() {
    return this.consultorioService.findActivos();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener consultorio por ID', description: 'Devuelve el detalle de un consultorio a partir de su ID.' })
  @ApiParam({ name: 'id', type: Number, description: 'ID del consultorio' })
  @ApiResponse({
    status: 200,
    description: 'Detalle del consultorio.',
    example: {
      idConsultorio: 1,
      nombre: 'Central',
      activo: true,
      horariosDisponibles: [
        {
          idHorario: 1,
          diaSemana: 'LUNES',
          horaInicio: '08:00',
          horaFin: '12:00',
          duracionTurno: 30
        }
      ],
      turnos: [
        {
          idTurno: 1,
          fechaHora: '2025-10-19T09:00:00Z',
          estado: 'PENDIENTE'
        }
      ]
    }
  })
  @ApiResponse({ status: 404, description: 'Consultorio no encontrado.' })
  @ApiResponse({ status: 401, description: 'No autenticado.' })
  @ApiResponse({ status: 403, description: 'No autorizado.' })
  findOne(@Param('id', ParseIntPipe) id: number, @GetUser() user?: any) {
    const isAdmin = user && user.rol === UserRole.ADMIN;
    return this.consultorioService.findOne(id, isAdmin);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar consultorio', description: 'Modifica los datos de un consultorio existente.' })
  @ApiParam({ name: 'id', type: Number, description: 'ID del consultorio' })
  @ApiResponse({
    status: 200,
    description: 'Consultorio actualizado correctamente.',
    example: {
      idConsultorio: 1,
      nombre: 'Central',
      activo: false,
      horariosDisponibles: [
        {
          idHorario: 1,
          diaSemana: 'LUNES',
          horaInicio: '08:00',
          horaFin: '12:00',
          duracionTurno: 30
        }
      ],
      turnos: [
        {
          idTurno: 1,
          fechaHora: '2025-10-19T09:00:00Z',
          estado: 'PENDIENTE'
        }
      ]
    }
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos o faltantes.' })
  @ApiResponse({ status: 404, description: 'Consultorio no encontrado.' })
  @ApiResponse({ status: 401, description: 'No autenticado.' })
  @ApiResponse({ status: 403, description: 'No autorizado.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body('nombre') nombre: string,
    @Body('activo') activo?: boolean,
  ) {
    return this.consultorioService.update(id, nombre, activo);
  }


  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar consultorio (soft delete)', description: 'Marca un consultorio como inactivo.' })
  @ApiParam({ name: 'id', type: Number, description: 'ID del consultorio' })
  @ApiResponse({
    status: 200,
    description: 'Consultorio marcado como inactivo.',
    example: {
      message: 'Consultorio marcado como inactivo.'
    }
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.consultorioService.remove(id);
  }


  /**
   * Listar consultorios eliminados (solo admin)
   * @returns Listado de consultorios marcados como inactivos (soft delete)
   */
  @Get('inactivos')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Listar consultorios eliminados', description: 'Obtiene los consultorios marcados como inactivos. Solo accesible para administradores.' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Listado de consultorios inactivos.' })
  @ApiForbiddenResponse({ description: 'No autorizado. Solo el admin puede acceder a este recurso.' })
  findInactivos() {
    return this.consultorioService.findInactivos();
  }


  /**
   * Restaurar consultorio eliminado (solo admin)
   * @param id ID del consultorio
   * @returns Consultorio restaurado
   */
  @Patch(':id/restaurar')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Restaurar consultorio eliminado', description: 'Restaura un consultorio marcado como inactivo. Solo accesible para administradores.' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', type: Number, description: 'ID del consultorio', example: 1 })
  @ApiResponse({ status: 200, description: 'Consultorio restaurado.' })
  @ApiForbiddenResponse({ description: 'No autorizado. Solo el admin puede acceder a este recurso.' })
  restore(@Param('id', ParseIntPipe) id: number) {
    return this.consultorioService.restore(id);
  }
}
