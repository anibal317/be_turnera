import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiExtraModels, getSchemaPath, ApiQuery } from '@nestjs/swagger';
import { ApiForbiddenResponse } from '@nestjs/swagger';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { PacienteService } from './paciente.service';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/entities/usuario.entity';

@ApiTags('Pacientes')
@ApiExtraModels(CreatePacienteDto)
@ApiExtraModels(UpdatePacienteDto)
@Controller('pacientes')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class PacienteController {
  constructor(private readonly pacienteService: PacienteService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.SECRETARIA)
  @ApiOperation({ summary: 'Crear paciente', description: 'Registra un nuevo paciente en el sistema.' })
  @ApiBody({
    type: CreatePacienteDto,
    examples: {
      ejemplo: {
        summary: 'Ejemplo de creación',
        value: {
          dniPaciente: '12345678',
          nombre: 'Juan',
          apellido: 'Pérez',
          fechaNacimiento: '1990-01-01',
          direccion: 'Calle Falsa 123',
          telefono: '1122334455',
          email: 'juan.perez@mail.com',
          activo: true,
          idObraSocial: 'OS1234',
          numeroAfiliado: 'A123456',
          idCobertura: 1
        }
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'Paciente creado correctamente.',
    schema: {
      type: 'object',
      properties: {
        dniPaciente: { type: 'string', example: '12345678' },
        nombre: { type: 'string', example: 'Juan' },
        apellido: { type: 'string', example: 'Pérez' },
        fechaNacimiento: { type: 'string', example: '1990-01-01' },
        direccion: { type: 'string', example: 'Calle Falsa 123' },
        telefono: { type: 'string', example: '1122334455' },
        email: { type: 'string', example: 'juan.perez@mail.com' },
        activo: { type: 'boolean', example: true },
        idObraSocial: { type: 'string', example: 'OS1234' },
        numeroAfiliado: { type: 'string', example: 'A123456' },
        idCobertura: { type: 'number', example: 1 },
        obraSocial: {
          type: 'object',
          properties: {
            codigo: { type: 'string', example: 'OS1234' },
            nombre: { type: 'string', example: 'OSDE' }
          }
        },
        cobertura: {
          type: 'object',
          properties: {
            idCobertura: { type: 'number', example: 1 },
            nombre: { type: 'string', example: 'Plan 210' }
          }
        }
      },
      example: {
        dniPaciente: '12345678',
        nombre: 'Juan',
        apellido: 'Pérez',
        fechaNacimiento: '1990-01-01',
        direccion: 'Calle Falsa 123',
        telefono: '1122334455',
        email: 'juan.perez@mail.com',
        activo: true,
        idObraSocial: 'OS1234',
        numeroAfiliado: 'A123456',
        idCobertura: 1,
        obraSocial: {
          codigo: 'OS1234',
          nombre: 'OSDE'
        },
        cobertura: {
          idCobertura: 1,
          nombre: 'Plan 210'
        }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos o faltantes.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos o faltantes.' })
  @ApiResponse({ status: 401, description: 'No autenticado.' })
  @ApiResponse({ status: 403, description: 'No autorizado.' })
  @ApiResponse({ status: 404, description: 'Recurso no encontrado.' })
  create(@Body() createPacienteDto: CreatePacienteDto) {
    return this.pacienteService.create(createPacienteDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.SECRETARIA)
  @ApiOperation({ summary: 'Listar pacientes', description: 'Obtiene la lista de todos los pacientes registrados, con soporte de paginación, filtrado y ordenamiento.' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Número de página', example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Cantidad de resultados por página', example: 10 })
  @ApiQuery({ name: 'sort', required: false, type: String, description: 'Campo para ordenar', example: 'apellido' })
  @ApiQuery({ name: 'order', required: false, enum: ['ASC', 'DESC'], description: 'Dirección de ordenamiento', example: 'ASC' })
  @ApiQuery({ name: 'nombre', required: false, type: String, description: 'Filtrar por nombre', example: 'Juan' })
  @ApiQuery({ name: 'apellido', required: false, type: String, description: 'Filtrar por apellido', example: 'Pérez' })
  @ApiQuery({ name: 'dniPaciente', required: false, type: String, description: 'Filtrar por DNI', example: '12345678' })
  @ApiQuery({ name: 'activo', required: false, type: Boolean, description: 'Filtrar por estado activo', example: true })
  @ApiResponse({
    status: 200,
    description: 'Listado de pacientes paginado.',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              dniPaciente: { type: 'string', example: '12345678' },
              nombre: { type: 'string', example: 'Juan' },
              apellido: { type: 'string', example: 'Pérez' },
              fechaNacimiento: { type: 'string', example: '1990-01-01' },
              direccion: { type: 'string', example: 'Calle Falsa 123' },
              telefono: { type: 'string', example: '1122334455' },
              email: { type: 'string', example: 'juan.perez@mail.com' },
              activo: { type: 'boolean', example: true },
              idObraSocial: { type: 'string', example: 'OS1234' },
              numeroAfiliado: { type: 'string', example: 'A123456' },
              idCobertura: { type: 'number', example: 1 },
              obraSocial: {
                type: 'object',
                properties: {
                  codigo: { type: 'string', example: 'OS1234' },
                  nombre: { type: 'string', example: 'OSDE' }
                }
              },
              cobertura: {
                type: 'object',
                properties: {
                  idCobertura: { type: 'number', example: 1 },
                  nombre: { type: 'string', example: 'Plan 210' }
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
            dniPaciente: '12345678',
            nombre: 'Juan',
            apellido: 'Pérez',
            fechaNacimiento: '1990-01-01',
            direccion: 'Calle Falsa 123',
            telefono: '1122334455',
            email: 'juan.perez@mail.com',
            activo: true,
            idObraSocial: 'OS1234',
            numeroAfiliado: 'A123456',
            idCobertura: 1,
            obraSocial: {
              codigo: 'OS1234',
              nombre: 'OSDE'
            },
            cobertura: {
              idCobertura: 1,
              nombre: 'Plan 210'
            }
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
    @Query('dniPaciente') dniPaciente?: string,
    @Query('activo') activo?: boolean,
    @GetUser() user?: any
  ) {
    const isAdmin = user && user.rol === UserRole.ADMIN;
    return this.pacienteService.findAll({ page, limit, sort, order, nombre, apellido, dniPaciente, activo, isAdmin });
  }

  @Get('activos')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.SECRETARIA)
  @ApiOperation({ summary: 'Listar pacientes activos', description: 'Obtiene los pacientes que están activos en el sistema.' })
  @ApiResponse({
    status: 200,
    description: 'Listado de pacientes activos.',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          dniPaciente: { type: 'string', example: '12345678' },
          nombre: { type: 'string', example: 'Juan' },
          apellido: { type: 'string', example: 'Pérez' },
          fechaNacimiento: { type: 'string', example: '1990-01-01' },
          direccion: { type: 'string', example: 'Calle Falsa 123' },
          telefono: { type: 'string', example: '1122334455' },
          email: { type: 'string', example: 'juan.perez@mail.com' },
          activo: { type: 'boolean', example: true },
          idObraSocial: { type: 'string', example: 'OS1234' },
          numeroAfiliado: { type: 'string', example: 'A123456' },
          idCobertura: { type: 'number', example: 1 },
          obraSocial: {
            type: 'object',
            properties: {
              codigo: { type: 'string', example: 'OS1234' },
              nombre: { type: 'string', example: 'OSDE' }
            }
          },
          cobertura: {
            type: 'object',
            properties: {
              idCobertura: { type: 'number', example: 1 },
              nombre: { type: 'string', example: 'Plan 210' }
            }
          }
        }
      },
      example: [
        {
          dniPaciente: '12345678',
          nombre: 'Juan',
          apellido: 'Pérez',
          fechaNacimiento: '1990-01-01',
          direccion: 'Calle Falsa 123',
          telefono: '1122334455',
          email: 'juan.perez@mail.com',
          activo: true,
          idObraSocial: 'OS1234',
          numeroAfiliado: 'A123456',
          idCobertura: 1,
          obraSocial: {
            codigo: 'OS1234',
            nombre: 'OSDE'
          },
          cobertura: {
            idCobertura: 1,
            nombre: 'Plan 210'
          }
        }
      ]
    }
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos o faltantes.' })
  @ApiResponse({ status: 401, description: 'No autenticado.' })
  @ApiResponse({ status: 403, description: 'No autorizado.' })
  @ApiResponse({ status: 404, description: 'Recurso no encontrado.' })
  findActivos() {
    return this.pacienteService.findActivos();
  }

  @Get(':dni')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.SECRETARIA)
  @ApiOperation({ summary: 'Obtener paciente por DNI', description: 'Devuelve el detalle de un paciente a partir de su DNI.' })
  @ApiParam({ name: 'dni', type: String, description: 'DNI del paciente', example: '12345678' })
  @ApiResponse({
    status: 200,
    description: 'Detalle del paciente.',
    schema: {
      type: 'object',
      properties: {
        dniPaciente: { type: 'string', example: '12345678' },
        nombre: { type: 'string', example: 'Juan' },
        apellido: { type: 'string', example: 'Pérez' },
        fechaNacimiento: { type: 'string', example: '1990-01-01' },
        direccion: { type: 'string', example: 'Calle Falsa 123' },
        telefono: { type: 'string', example: '1122334455' },
        email: { type: 'string', example: 'juan.perez@mail.com' },
        activo: { type: 'boolean', example: true },
        idObraSocial: { type: 'string', example: 'OS1234' },
        numeroAfiliado: { type: 'string', example: 'A123456' },
        idCobertura: { type: 'number', example: 1 },
        obraSocial: {
          type: 'object',
          properties: {
            codigo: { type: 'string', example: 'OS1234' },
            nombre: { type: 'string', example: 'OSDE' }
          }
        },
        cobertura: {
          type: 'object',
          properties: {
            idCobertura: { type: 'number', example: 1 },
            nombre: { type: 'string', example: 'Plan 210' }
          }
        }
      },
      example: {
        dniPaciente: '12345678',
        nombre: 'Juan',
        apellido: 'Pérez',
        fechaNacimiento: '1990-01-01',
        direccion: 'Calle Falsa 123',
        telefono: '1122334455',
        email: 'juan.perez@mail.com',
        activo: true,
        idObraSocial: 'OS1234',
        numeroAfiliado: 'A123456',
        idCobertura: 1,
        obraSocial: {
          codigo: 'OS1234',
          nombre: 'OSDE'
        },
        cobertura: {
          idCobertura: 1,
          nombre: 'Plan 210'
        }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos o faltantes.' })
  @ApiResponse({ status: 401, description: 'No autenticado.' })
  @ApiResponse({ status: 403, description: 'No autorizado.' })
  @ApiResponse({ status: 404, description: 'Paciente no encontrado.' })
  findOne(@Param('dni') dni: string, @GetUser() user?: any) {
    const isAdmin = user && user.rol === UserRole.ADMIN;
    return this.pacienteService.findOne(dni, isAdmin);
  }

  @Patch(':dni')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.SECRETARIA)
  @ApiOperation({ summary: 'Actualizar paciente', description: 'Modifica los datos de un paciente existente.' })
  @ApiParam({ name: 'dni', type: String, description: 'DNI del paciente', example: '12345678' })
  @ApiBody({
    type: UpdatePacienteDto,
    examples: {
      ejemplo: {
        summary: 'Ejemplo de actualización',
        value: {
          nombre: 'Juan',
          apellido: 'Pérez',
          telefono: '1122334455',
          direccion: 'Calle Falsa 123',
          email: 'juan.perez@mail.com',
          activo: false
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Paciente actualizado correctamente.',
    schema: {
      type: 'object',
      properties: {
        dniPaciente: { type: 'string', example: '12345678' },
        nombre: { type: 'string', example: 'Juan' },
        apellido: { type: 'string', example: 'Pérez' },
        fechaNacimiento: { type: 'string', example: '1990-01-01' },
        direccion: { type: 'string', example: 'Calle Falsa 123' },
        telefono: { type: 'string', example: '1122334455' },
        email: { type: 'string', example: 'juan.perez@mail.com' },
        activo: { type: 'boolean', example: false },
        idObraSocial: { type: 'string', example: 'OS1234' },
        numeroAfiliado: { type: 'string', example: 'A123456' },
        idCobertura: { type: 'number', example: 1 },
        obraSocial: {
          type: 'object',
          properties: {
            codigo: { type: 'string', example: 'OS1234' },
            nombre: { type: 'string', example: 'OSDE' }
          }
        },
        cobertura: {
          type: 'object',
          properties: {
            idCobertura: { type: 'number', example: 1 },
            nombre: { type: 'string', example: 'Plan 210' }
          }
        }
      },
      example: {
        dniPaciente: '12345678',
        nombre: 'Juan',
        apellido: 'Pérez',
        fechaNacimiento: '1990-01-01',
        direccion: 'Calle Falsa 123',
        telefono: '1122334455',
        email: 'juan.perez@mail.com',
        activo: false,
        idObraSocial: 'OS1234',
        numeroAfiliado: 'A123456',
        idCobertura: 1,
        obraSocial: {
          codigo: 'OS1234',
          nombre: 'OSDE'
        },
        cobertura: {
          idCobertura: 1,
          nombre: 'Plan 210'
        }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos o faltantes.' })
  @ApiResponse({ status: 401, description: 'No autenticado.' })
  @ApiResponse({ status: 403, description: 'No autorizado.' })
  @ApiResponse({ status: 404, description: 'Paciente no encontrado.' })
  update(@Param('dni') dni: string, @Body() updatePacienteDto: UpdatePacienteDto) {
    return this.pacienteService.update(dni, updatePacienteDto);
  }


  @Delete(':dni')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Eliminar paciente (soft delete)', description: 'Elimina un paciente del sistema por su DNI (soft delete).' })
  @ApiParam({ name: 'dni', type: String, description: 'DNI del paciente', example: '12345678' })
  @ApiResponse({
    status: 200,
    description: 'Paciente marcado como inactivo.',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Paciente marcado como inactivo.' }
      },
      example: {
        message: 'Paciente marcado como inactivo.'
      }
    }
  })
  remove(@Param('dni') dni: string) {
    return this.pacienteService.remove(dni);
  }

  @Get('inactivos')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Listar pacientes eliminados', description: 'Obtiene los pacientes marcados como inactivos.' })
  @ApiResponse({ status: 200, description: 'Listado de pacientes inactivos.' })
    /**
     * Listar pacientes eliminados (solo admin)
     * @returns Listado de pacientes marcados como inactivos (soft delete)
     */
    @ApiBearerAuth()
    @ApiForbiddenResponse({ description: 'No autorizado. Solo el admin puede acceder a este recurso.' })
    findInactivos() {
      return this.pacienteService.findInactivos();
    }

  @Patch(':dni/restaurar')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Restaurar paciente eliminado', description: 'Restaura un paciente marcado como inactivo.' })
  @ApiParam({ name: 'dni', type: String, description: 'DNI del paciente', example: '12345678' })
  @ApiResponse({ status: 200, description: 'Paciente restaurado.' })
    /**
     * Restaurar paciente eliminado (solo admin)
     * @param dni DNI del paciente
     * @returns Paciente restaurado
     */
    @ApiBearerAuth()
    @ApiForbiddenResponse({ description: 'No autorizado. Solo el admin puede acceder a este recurso.' })
    restore(@Param('dni') dni: string) {
      return this.pacienteService.restore(dni);
    }
}
