import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, getSchemaPath, ApiExtraModels } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query } from '@nestjs/common';
import { CoberturaService } from './cobertura.service';
import { CreateCoberturaDto } from './dto/create-cobertura.dto';
import { UpdateCoberturaDto } from './dto/update-cobertura.dto';
import { Cobertura } from './entities/cobertura.entity';

@ApiTags('Coberturas')
@Controller('coberturas')
@ApiBearerAuth()
@ApiExtraModels(Cobertura)
export class CoberturaController {
  constructor(private readonly coberturaService: CoberturaService) {}

  @Post()
  @ApiOperation({ summary: 'Crear cobertura', description: 'Registra una nueva cobertura médica.' })
  @ApiResponse({
    status: 201,
    description: 'Cobertura creada correctamente.',
    example: {
      idCobertura: 1,
      nombre: 'Prepaga X',
      obrasSociales: [
        { codigo: 'OS1234', nombre: 'OSDE', telefono: '1122334455', email: 'osde@mail.com', activa: true }
      ],
      pacientes: [
        { dniPaciente: '12345678', nombre: 'Juan', apellido: 'Pérez', email: 'juan.perez@mail.com', activo: true }
      ]
    }
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos o faltantes.' })
  @ApiResponse({ status: 401, description: 'No autenticado.' })
  @ApiResponse({ status: 403, description: 'No autorizado.' })
  create(@Body() createCoberturaDto: CreateCoberturaDto) {
    return this.coberturaService.create(createCoberturaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar coberturas', description: 'Obtiene la lista de todas las coberturas médicas con paginación, filtrado y ordenamiento.' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1, description: 'Número de página' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10, description: 'Cantidad de resultados por página' })
  @ApiQuery({ name: 'sortBy', required: false, type: String, example: 'nombre', description: 'Campo por el cual ordenar' })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['ASC', 'DESC'], example: 'ASC', description: 'Dirección de ordenamiento' })
  @ApiQuery({ name: 'filter', required: false, type: String, example: 'prepaga', description: 'Filtro por nombre de cobertura' })
  @ApiResponse({
    status: 200,
    description: 'Listado paginado de coberturas.',
    schema: {
      type: 'object',
      properties: {
        data: { type: 'array', items: { $ref: getSchemaPath(Cobertura) } },
        total: { type: 'number', example: 2 },
        page: { type: 'number', example: 1 },
        limit: { type: 'number', example: 10 }
      }
    },
    example: {
      data: [
        {
          idCobertura: 1,
          nombre: 'Prepaga X',
          obrasSociales: [
            { codigo: 'OS1234', nombre: 'OSDE', telefono: '1122334455', email: 'osde@mail.com', activa: true }
          ],
          pacientes: [
            { dniPaciente: '12345678', nombre: 'Juan', apellido: 'Pérez', email: 'juan.perez@mail.com', activo: true }
          ]
        },
        {
          idCobertura: 2,
          nombre: 'Obra Social Y',
          obrasSociales: [],
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
    return this.coberturaService.findAll({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      sortBy,
      sortOrder,
      filter,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener cobertura por ID', description: 'Devuelve el detalle de una cobertura a partir de su ID.' })
  @ApiParam({ name: 'id', type: Number, description: 'ID de la cobertura' })
  @ApiResponse({
    status: 200,
    description: 'Detalle de la cobertura.',
    example: {
      idCobertura: 1,
      nombre: 'Prepaga X',
      obrasSociales: [
        { codigo: 'OS1234', nombre: 'OSDE', telefono: '1122334455', email: 'osde@mail.com', activa: true }
      ],
      pacientes: [
        { dniPaciente: '12345678', nombre: 'Juan', apellido: 'Pérez', email: 'juan.perez@mail.com', activo: true }
      ]
    }
  })
  @ApiResponse({ status: 404, description: 'Cobertura no encontrada.' })
  @ApiResponse({ status: 401, description: 'No autenticado.' })
  @ApiResponse({ status: 403, description: 'No autorizado.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.coberturaService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar cobertura', description: 'Modifica los datos de una cobertura existente.' })
  @ApiParam({ name: 'id', type: Number, description: 'ID de la cobertura' })
  @ApiResponse({
    status: 200,
    description: 'Cobertura actualizada correctamente.',
    example: {
      idCobertura: 1,
      nombre: 'Prepaga X',
      obrasSociales: [
        { codigo: 'OS1234', nombre: 'OSDE', telefono: '1122334455', email: 'osde@mail.com', activa: true }
      ],
      pacientes: [
        { dniPaciente: '12345678', nombre: 'Juan', apellido: 'Pérez', email: 'juan.perez@mail.com', activo: true }
      ]
    }
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos o faltantes.' })
  @ApiResponse({ status: 404, description: 'Cobertura no encontrada.' })
  @ApiResponse({ status: 401, description: 'No autenticado.' })
  @ApiResponse({ status: 403, description: 'No autorizado.' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateCoberturaDto: UpdateCoberturaDto) {
    return this.coberturaService.update(id, updateCoberturaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar cobertura', description: 'Elimina una cobertura médica por su ID.' })
  @ApiParam({ name: 'id', type: Number, description: 'ID de la cobertura' })
  @ApiResponse({
    status: 200,
    description: 'Cobertura eliminada correctamente.',
    example: {
      message: 'Cobertura eliminada correctamente.'
    }
  })
  @ApiResponse({ status: 404, description: 'Cobertura no encontrada.' })
  @ApiResponse({ status: 401, description: 'No autenticado.' })
  @ApiResponse({ status: 403, description: 'No autorizado.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.coberturaService.remove(id);
  }
}
