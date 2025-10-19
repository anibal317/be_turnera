import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, getSchemaPath, ApiExtraModels } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query } from '@nestjs/common';
import { HorarioDisponibleService, CreateHorarioDisponibleDto, UpdateHorarioDisponibleDto } from './horario-disponible.service';
import { HorarioDisponible } from './entities/horario-disponible.entity';
import { DiaSemana } from '../../common/enums/dia-semana.enum';

@ApiTags('Horarios Disponibles')
@ApiExtraModels(HorarioDisponible)
@Controller('horarios-disponibles')
@ApiBearerAuth()
export class HorarioDisponibleController {
  constructor(private readonly horarioService: HorarioDisponibleService) {}

  @Post()
  @ApiOperation({ summary: 'Crear horario disponible', description: 'Registra un nuevo horario disponible.' })
  @ApiResponse({
    status: 201,
    description: 'Horario disponible creado correctamente.',
    content: {
      'application/json': {
        example: {
          idHorario: 1,
          idDoctor: 1,
          idConsultorio: 1,
          diaSemana: 'LUNES',
          horaInicio: '08:00',
          horaFin: '12:00',
          duracionTurno: 30,
          doctor: {
            idDoctor: 1,
            nombre: 'Ana',
            apellido: 'García',
            telefono: '123456789',
            email: 'ana.garcia@mail.com',
            matricula: 'MAT12345',
            activo: true,
            especialidades: [
              { idEspecialidad: 1, nombreEspecialidad: 'Cardiología' },
              { idEspecialidad: 2, nombreEspecialidad: 'Clínica Médica' }
            ]
          },
          consultorio: {
            idConsultorio: 1,
            nombre: 'Central',
            activo: true,
            horariosDisponibles: [
              { idHorario: 1, diaSemana: 'LUNES', horaInicio: '08:00', horaFin: '12:00', duracionTurno: 30 }
            ],
            turnos: [
              { idTurno: 1, fechaHora: '2025-10-19T09:00:00Z', estado: 'PENDIENTE' }
            ]
          }
        }
      }
    }
  })
  create(@Body() createDto: CreateHorarioDisponibleDto) {
    return this.horarioService.create(createDto);
  }

  @Get('doctor/:id')
  @ApiOperation({ summary: 'Listar horarios por doctor', description: 'Obtiene los horarios disponibles de un doctor específico.' })
  @ApiParam({ name: 'id', type: Number, description: 'ID del doctor' })
        @ApiResponse({
    status: 200,
    description: 'Listado de horarios activos.',
    content: {
      'application/json': {
        example: [
          {
            idHorario: 1,
            idDoctor: 1,
            idConsultorio: 1,
            diaSemana: 'LUNES',
            horaInicio: '08:00',
            horaFin: '12:00',
            duracionTurno: 30,
            doctor: {
              idDoctor: 1,
              nombre: 'Ana',
              apellido: 'García',
              telefono: '123456789',
              email: 'ana.garcia@mail.com',
              matricula: 'MAT12345',
              activo: true,
              especialidades: [
                { idEspecialidad: 1, nombreEspecialidad: 'Cardiología' },
                { idEspecialidad: 2, nombreEspecialidad: 'Clínica Médica' }
              ]
            },
            consultorio: {
              idConsultorio: 1,
              nombre: 'Central',
              activo: true,
              horariosDisponibles: [
                { idHorario: 1, diaSemana: 'LUNES', horaInicio: '08:00', horaFin: '12:00', duracionTurno: 30 }
              ],
              turnos: [
                { idTurno: 1, fechaHora: '2025-10-19T09:00:00Z', estado: 'PENDIENTE' }
              ]
            }
          }
        ]
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Doctor no encontrado.' })
  @ApiResponse({ status: 401, description: 'No autenticado.' })
  @ApiResponse({ status: 403, description: 'No autorizado.' })
  findByDoctor(@Param('id', ParseIntPipe) id: number) {
    return this.horarioService.findByDoctor(id);
  }

  @Get('consultorio/:id')
  @ApiOperation({ summary: 'Listar horarios por consultorio', description: 'Obtiene los horarios disponibles de un consultorio específico.' })
  @ApiParam({ name: 'id', type: Number, description: 'ID del consultorio' })
  @ApiResponse({
    status: 200,
    description: 'Listado de horarios del consultorio.',
    content: {
      'application/json': {
        example: [
          {
            idHorario: 1,
            idDoctor: 1,
            idConsultorio: 1,
            diaSemana: 'LUNES',
            horaInicio: '08:00',
            horaFin: '12:00',
            duracionTurno: 30,
            doctor: {
              idDoctor: 1,
              nombre: 'Ana',
              apellido: 'García',
              telefono: '123456789',
              email: 'ana.garcia@mail.com',
              matricula: 'MAT12345',
              activo: true,
              especialidades: [
                { idEspecialidad: 1, nombreEspecialidad: 'Cardiología' },
                { idEspecialidad: 2, nombreEspecialidad: 'Clínica Médica' }
              ],
              horariosDisponibles: [
                { idHorario: 1, diaSemana: 'LUNES', horaInicio: '08:00', horaFin: '12:00', duracionTurno: 30 }
              ],
              turnos: [
                { idTurno: 1, fechaHora: '2025-10-19T09:00:00Z', estado: 'PENDIENTE' }
              ]
            },
            consultorio: {
              idConsultorio: 1,
              nombre: 'Central',
              activo: true,
              horariosDisponibles: [
                { idHorario: 1, diaSemana: 'LUNES', horaInicio: '08:00', horaFin: '12:00', duracionTurno: 30 }
              ],
              turnos: [
                { idTurno: 1, fechaHora: '2025-10-19T09:00:00Z', estado: 'PENDIENTE' }
              ]
            }
          }
        ]
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Consultorio no encontrado.' })
  @ApiResponse({ status: 401, description: 'No autenticado.' })
  @ApiResponse({ status: 403, description: 'No autorizado.' })
  findByConsultorio(@Param('id', ParseIntPipe) id: number) {
    return this.horarioService.findByConsultorio(id);
  }

  @Get('dia')
  @ApiOperation({ summary: 'Listar horarios por día', description: 'Obtiene los horarios disponibles para un día específico.' })
  @ApiQuery({ name: 'dia', enum: DiaSemana, description: 'Día de la semana' })
  @ApiResponse({ status: 200, description: 'Listado de horarios del día.' })
  @ApiResponse({ status: 400, description: 'Día inválido.' })
  @ApiResponse({ status: 401, description: 'No autenticado.' })
  @ApiResponse({ status: 403, description: 'No autorizado.' })
  findByDia(@Query('dia') dia: DiaSemana) {
    return this.horarioService.findByDia(dia);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener horario disponible por ID', description: 'Devuelve el detalle de un horario disponible a partir de su ID.' })
  @ApiParam({ name: 'id', type: Number, description: 'ID del horario disponible' })
  @ApiResponse({
    status: 200,
    description: 'Detalle del horario disponible.',
    schema: { $ref: getSchemaPath(HorarioDisponible) },
    content: {
      'application/json': {
        example: {
          idHorario: 1,
          idDoctor: 1,
          idConsultorio: 1,
          diaSemana: 'LUNES',
          horaInicio: '08:00',
          horaFin: '12:00',
          duracionTurno: 30,
          doctor: {
            idDoctor: 1,
            nombre: 'Ana',
            apellido: 'García',
            telefono: '123456789',
            email: 'ana.garcia@mail.com',
            matricula: 'MAT12345',
            activo: true,
            especialidades: [
              { idEspecialidad: 1, nombreEspecialidad: 'Cardiología' },
              { idEspecialidad: 2, nombreEspecialidad: 'Clínica Médica' }
            ]
          },
          consultorio: {
            idConsultorio: 1,
            nombre: 'Central',
            activo: true
          }
        }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Horario no encontrado.' })
  @ApiResponse({ status: 401, description: 'No autenticado.' })
  @ApiResponse({ status: 403, description: 'No autorizado.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.horarioService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar horario disponible', description: 'Modifica los datos de un horario disponible existente.' })
  @ApiParam({ name: 'id', type: Number, description: 'ID del horario disponible' })
        @ApiResponse({
    status: 200,
    description: 'Horario disponible actualizado correctamente.',
    content: {
      'application/json': {
        example: {
          idHorario: 1,
          idDoctor: 1,
          idConsultorio: 1,
          diaSemana: 'LUNES',
          horaInicio: '08:00',
          horaFin: '12:00',
          duracionTurno: 45,
          doctor: {
            idDoctor: 1,
            nombre: 'Ana',
            apellido: 'García',
            telefono: '123456789',
            email: 'ana.garcia@mail.com',
            matricula: 'MAT12345',
            activo: true,
            especialidades: [
              { idEspecialidad: 1, nombreEspecialidad: 'Cardiología' },
              { idEspecialidad: 2, nombreEspecialidad: 'Clínica Médica' }
            ]
          },
          consultorio: {
            idConsultorio: 1,
            nombre: 'Central',
            activo: true,
            horariosDisponibles: [
              { idHorario: 1, diaSemana: 'LUNES', horaInicio: '08:00', horaFin: '12:00', duracionTurno: 30 }
            ],
            turnos: [
              { idTurno: 1, fechaHora: '2025-10-19T09:00:00Z', estado: 'PENDIENTE' }
            ]
          }
        }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos o faltantes.' })
  @ApiResponse({ status: 404, description: 'Horario no encontrado.' })
  @ApiResponse({ status: 401, description: 'No autenticado.' })
  @ApiResponse({ status: 403, description: 'No autorizado.' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateHorarioDisponibleDto) {
    return this.horarioService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar horario disponible', description: 'Elimina un horario disponible por su ID.' })
  @ApiParam({ name: 'id', type: Number, description: 'ID del horario disponible' })
        @ApiResponse({
    status: 200,
    description: 'Horario disponible eliminado correctamente.',
    content: {
      'application/json': {
        example: {
          message: 'Horario disponible eliminado correctamente.'
        }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Horario no encontrado.' })
  @ApiResponse({ status: 401, description: 'No autenticado.' })
  @ApiResponse({ status: 403, description: 'No autorizado.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.horarioService.remove(id);
  }
}
