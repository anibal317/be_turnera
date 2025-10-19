import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
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
@Controller('turnos')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class TurnoController {
  constructor(private readonly turnoService: TurnoService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.SECRETARIA, UserRole.PACIENTE)
  @ApiOperation({ summary: 'Crear un nuevo turno', description: 'Crea un turno para un paciente, validando disponibilidad y reglas de negocio.' })
  @ApiResponse({ status: 201, description: 'Turno creado correctamente.' })
  @ApiResponse({ status: 400, description: 'Ya existe un turno confirmado en ese horario.' })
  create(@Body() createTurnoDto: CreateTurnoDto, @GetUser() user: any) {
    return this.turnoService.create(createTurnoDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.SECRETARIA)
  @ApiOperation({ summary: 'Listar todos los turnos', description: 'Obtiene la lista completa de turnos registrados en el sistema.' })
  @ApiResponse({ status: 200, description: 'Listado de turnos.' })
  findAll() {
    return this.turnoService.findAll();
  }

  @Get('mis-turnos')
  @Roles(UserRole.DOCTOR, UserRole.PACIENTE)
  @ApiOperation({ summary: 'Obtener mis turnos', description: 'Devuelve los turnos asociados al usuario autenticado (doctor o paciente).' })
  @ApiResponse({ status: 200, description: 'Listado de turnos del usuario.' })
  async getMisTurnos(@GetUser() user: any) {
    if (user.rol === UserRole.DOCTOR) {
      return this.turnoService.findByDoctor(parseInt(user.idReferencia));
    } else if (user.rol === UserRole.PACIENTE) {
      return this.turnoService.findByPaciente(user.idReferencia);
    }
  }

  @Get('estado/:estado')
  @Roles(UserRole.ADMIN, UserRole.SECRETARIA, UserRole.DOCTOR)
  @ApiOperation({ summary: 'Buscar turnos por estado', description: 'Filtra los turnos según su estado (pendiente, confirmado, etc.).' })
  @ApiParam({ name: 'estado', enum: EstadoTurno, description: 'Estado del turno' })
  @ApiResponse({ status: 200, description: 'Listado de turnos filtrados por estado.' })
  findByEstado(@Param('estado') estado: EstadoTurno) {
    return this.turnoService.findByEstado(estado);
  }

  @Get('paciente/:dni')
  @Roles(UserRole.ADMIN, UserRole.SECRETARIA)
  @ApiOperation({ summary: 'Buscar turnos por paciente', description: 'Obtiene todos los turnos asociados a un paciente por su DNI.' })
  @ApiParam({ name: 'dni', type: String, description: 'DNI del paciente' })
  @ApiResponse({ status: 200, description: 'Listado de turnos del paciente.' })
  findByPaciente(@Param('dni') dni: string) {
    return this.turnoService.findByPaciente(dni);
  }

  @Get('doctor/:id')
  @Roles(UserRole.ADMIN, UserRole.SECRETARIA, UserRole.DOCTOR)
  @ApiOperation({ summary: 'Buscar turnos por doctor', description: 'Obtiene todos los turnos asociados a un doctor por su ID.' })
  @ApiParam({ name: 'id', type: Number, description: 'ID del doctor' })
  @ApiResponse({ status: 200, description: 'Listado de turnos del doctor.' })
  findByDoctor(@Param('id', ParseIntPipe) id: number, @GetUser() user: any) {
    if (user.rol === UserRole.DOCTOR && parseInt(user.idReferencia) !== id) {
      throw new Error('No tiene permisos para ver turnos de otros médicos');
    }
    return this.turnoService.findByDoctor(id);
  }

  @Get('fecha')
  @Roles(UserRole.ADMIN, UserRole.SECRETARIA, UserRole.DOCTOR)
  @ApiOperation({ summary: 'Buscar turnos por fecha', description: 'Filtra los turnos por una fecha específica.' })
  @ApiQuery({ name: 'fecha', type: String, description: 'Fecha en formato ISO (YYYY-MM-DD)' })
  @ApiResponse({ status: 200, description: 'Listado de turnos en la fecha indicada.' })
  findByFecha(@Query('fecha') fecha: string) {
    return this.turnoService.findByFecha(new Date(fecha));
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.SECRETARIA, UserRole.DOCTOR, UserRole.PACIENTE)
  @ApiOperation({ summary: 'Obtener un turno por ID', description: 'Devuelve el detalle de un turno específico.' })
  @ApiParam({ name: 'id', type: Number, description: 'ID del turno' })
  @ApiResponse({ status: 200, description: 'Detalle del turno.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.turnoService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.SECRETARIA)
  @ApiOperation({ summary: 'Actualizar un turno', description: 'Permite modificar los datos de un turno existente.' })
  @ApiParam({ name: 'id', type: Number, description: 'ID del turno' })
  @ApiResponse({ status: 200, description: 'Turno actualizado correctamente.' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateTurnoDto: UpdateTurnoDto) {
    return this.turnoService.update(id, updateTurnoDto);
  }

  @Patch(':id/confirmar')
  @Roles(UserRole.ADMIN, UserRole.SECRETARIA, UserRole.DOCTOR)
  confirmar(@Param('id', ParseIntPipe) id: number) {
    return this.turnoService.confirmarTurno(id);
  }

  @Patch(':id/cancelar')
  @Roles(UserRole.ADMIN, UserRole.SECRETARIA, UserRole.PACIENTE, UserRole.DOCTOR)
  cancelar(@Param('id', ParseIntPipe) id: number) {
    return this.turnoService.cancelarTurno(id);
  }

  @Patch(':id/completar')
  @Roles(UserRole.ADMIN, UserRole.SECRETARIA, UserRole.DOCTOR)
  completar(@Param('id', ParseIntPipe) id: number) {
    return this.turnoService.completarTurno(id);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.SECRETARIA)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.turnoService.remove(id);
  }
}
