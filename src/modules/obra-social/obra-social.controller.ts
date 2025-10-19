import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, getSchemaPath, ApiExtraModels } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ObraSocialService, CreateObraSocialDto, UpdateObraSocialDto } from './obra-social.service';
import { ObraSocial } from './entities/obra-social.entity';

@ApiTags('Obras Sociales')
@Controller('obras-sociales')
@ApiBearerAuth()
@ApiExtraModels(ObraSocial)
export class ObraSocialController {
  constructor(private readonly obraSocialService: ObraSocialService) {}

  @Post()
  @ApiOperation({ summary: 'Crear obra social', description: 'Registra una nueva obra social.' })
  @ApiResponse({
    status: 201,
    description: 'Obra social creada correctamente.',
    example: {
      codigo: 'PAMI',
      nombre: 'PAMI',
      telefono: '123456',
      email: 'info@pami.com',
      idCobertura: 1,
      activa: true,
      cobertura: { idCobertura: 1, nombre: 'Prepaga X' },
      pacientes: [
        { dniPaciente: '12345678', nombre: 'Juan', apellido: 'Pérez', email: 'juan.perez@mail.com', activo: true }
      ]
    }
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos o faltantes.' })
  @ApiResponse({ status: 401, description: 'No autenticado.' })
  @ApiResponse({ status: 403, description: 'No autorizado.' })
  create(@Body() createDto: CreateObraSocialDto) {
    return this.obraSocialService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar obras sociales', description: 'Obtiene la lista de todas las obras sociales con paginación, filtrado y ordenamiento.' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1, description: 'Número de página' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10, description: 'Cantidad de resultados por página' })
  @ApiQuery({ name: 'sortBy', required: false, type: String, example: 'nombre', description: 'Campo por el cual ordenar' })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['ASC', 'DESC'], example: 'ASC', description: 'Dirección de ordenamiento' })
  @ApiQuery({ name: 'filter', required: false, type: String, example: 'pami', description: 'Filtro por nombre de obra social' })
  @ApiResponse({
    status: 200,
    description: 'Listado paginado de obras sociales.',
    schema: {
      type: 'object',
      properties: {
        data: { type: 'array', items: { $ref: getSchemaPath(ObraSocial) } },
        total: { type: 'number', example: 2 },
        page: { type: 'number', example: 1 },
        limit: { type: 'number', example: 10 }
      }
    },
    example: {
      data: [
        {
          codigo: 'PAMI',
          nombre: 'PAMI',
          telefono: '123456',
          email: 'info@pami.com',
          idCobertura: 1,
          activa: true,
          cobertura: { idCobertura: 1, nombre: 'Prepaga X' },
          pacientes: [
            { dniPaciente: '12345678', nombre: 'Juan', apellido: 'Pérez', email: 'juan.perez@mail.com', activo: true }
          ]
        },
        {
          codigo: 'OSDE',
          nombre: 'OSDE',
          telefono: '654321',
          email: 'info@osde.com',
          idCobertura: 2,
          activa: true,
          cobertura: { idCobertura: 2, nombre: 'Obra Social Y' },
          pacientes: []
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
    return this.obraSocialService.findAll({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      sortBy,
      sortOrder,
      filter,
    });
  }

  @Get('activas')
  @ApiOperation({ summary: 'Listar obras sociales activas', description: 'Obtiene las obras sociales que están activas.' })
  @ApiResponse({
    status: 200,
    description: 'Listado de obras sociales activas.',
    example: [
      {
        codigo: 'PAMI',
        nombre: 'PAMI',
        telefono: '123456',
        email: 'info@pami.com',
        idCobertura: 1,
        activa: true,
        cobertura: { idCobertura: 1, nombre: 'Prepaga X' },
        pacientes: [
          { dniPaciente: '12345678', nombre: 'Juan', apellido: 'Pérez', email: 'juan.perez@mail.com', activo: true }
        ]
      }
    ]
  })
  @ApiResponse({ status: 401, description: 'No autenticado.' })
  @ApiResponse({ status: 403, description: 'No autorizado.' })
  findActivas() {
    return this.obraSocialService.findActivas();
  }

  @Get(':codigo')
  @ApiOperation({ summary: 'Obtener obra social por código', description: 'Devuelve el detalle de una obra social a partir de su código.' })
  @ApiParam({ name: 'codigo', type: String, description: 'Código de la obra social' })
  @ApiResponse({
    status: 200,
    description: 'Detalle de la obra social.',
    example: {
      codigo: 'PAMI',
      nombre: 'PAMI',
      telefono: '123456',
      email: 'info@pami.com',
      idCobertura: 1,
      activa: true,
      cobertura: { idCobertura: 1, nombre: 'Prepaga X' },
      pacientes: [
        { dniPaciente: '12345678', nombre: 'Juan', apellido: 'Pérez', email: 'juan.perez@mail.com', activo: true }
      ]
    }
  })
  @ApiResponse({ status: 404, description: 'Obra social no encontrada.' })
  @ApiResponse({ status: 401, description: 'No autenticado.' })
  @ApiResponse({ status: 403, description: 'No autorizado.' })
  findOne(@Param('codigo') codigo: string) {
    return this.obraSocialService.findOne(codigo);
  }

  @Patch(':codigo')
  @ApiOperation({ summary: 'Actualizar obra social', description: 'Modifica los datos de una obra social existente.' })
  @ApiParam({ name: 'codigo', type: String, description: 'Código de la obra social' })
  @ApiResponse({
    status: 200,
    description: 'Obra social actualizada correctamente.',
    example: {
      codigo: 'PAMI',
      nombre: 'PAMI',
      telefono: '123456',
      email: 'info@pami.com',
      idCobertura: 1,
      activa: false,
      cobertura: { idCobertura: 1, nombre: 'Prepaga X' },
      pacientes: [
        { dniPaciente: '12345678', nombre: 'Juan', apellido: 'Pérez', email: 'juan.perez@mail.com', activo: true }
      ]
    }
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos o faltantes.' })
  @ApiResponse({ status: 404, description: 'Obra social no encontrada.' })
  @ApiResponse({ status: 401, description: 'No autenticado.' })
  @ApiResponse({ status: 403, description: 'No autorizado.' })
  update(@Param('codigo') codigo: string, @Body() updateDto: UpdateObraSocialDto) {
    return this.obraSocialService.update(codigo, updateDto);
  }

  @Delete(':codigo')
  @ApiOperation({ summary: 'Eliminar obra social', description: 'Elimina una obra social por su código.' })
  @ApiParam({ name: 'codigo', type: String, description: 'Código de la obra social' })
  @ApiResponse({
    status: 200,
    description: 'Obra social eliminada correctamente.',
    example: {
      message: 'Obra social eliminada correctamente.'
    }
  })
  @ApiResponse({ status: 404, description: 'Obra social no encontrada.' })
  @ApiResponse({ status: 401, description: 'No autenticado.' })
  @ApiResponse({ status: 403, description: 'No autorizado.' })
  remove(@Param('codigo') codigo: string) {
    return this.obraSocialService.remove(codigo);
  }
}
