import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PacienteService } from './paciente.service';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/entities/usuario.entity';

@ApiTags('Pacientes')
@Controller('pacientes')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class PacienteController {
  constructor(private readonly pacienteService: PacienteService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.SECRETARIA)
  @ApiOperation({ summary: 'Crear paciente', description: 'Registra un nuevo paciente en el sistema.' })
  @ApiResponse({ status: 201, description: 'Paciente creado correctamente.' })
  create(@Body() createPacienteDto: CreatePacienteDto) {
    return this.pacienteService.create(createPacienteDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.SECRETARIA)
  @ApiOperation({ summary: 'Listar pacientes', description: 'Obtiene la lista de todos los pacientes registrados.' })
  @ApiResponse({ status: 200, description: 'Listado de pacientes.' })
  findAll() {
    return this.pacienteService.findAll();
  }

  @Get('activos')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.SECRETARIA)
  @ApiOperation({ summary: 'Listar pacientes activos', description: 'Obtiene los pacientes que están activos en el sistema.' })
  @ApiResponse({ status: 200, description: 'Listado de pacientes activos.' })
  findActivos() {
    return this.pacienteService.findActivos();
  }

  @Get(':dni')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.SECRETARIA)
  @ApiOperation({ summary: 'Obtener paciente por DNI', description: 'Devuelve el detalle de un paciente a partir de su DNI.' })
  @ApiParam({ name: 'dni', type: String, description: 'DNI del paciente' })
  @ApiResponse({ status: 200, description: 'Detalle del paciente.' })
  findOne(@Param('dni') dni: string) {
    return this.pacienteService.findOne(dni);
  }

  @Patch(':dni')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.SECRETARIA)
  @ApiOperation({ summary: 'Actualizar paciente', description: 'Modifica los datos de un paciente existente.' })
  @ApiParam({ name: 'dni', type: String, description: 'DNI del paciente' })
  @ApiResponse({ status: 200, description: 'Paciente actualizado correctamente.' })
  update(@Param('dni') dni: string, @Body() updatePacienteDto: UpdatePacienteDto) {
    return this.pacienteService.update(dni, updatePacienteDto);
  }

  @Delete(':dni')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Eliminar paciente', description: 'Elimina un paciente del sistema por su DNI.' })
  @ApiParam({ name: 'dni', type: String, description: 'DNI del paciente' })
  @ApiResponse({ status: 200, description: 'Paciente eliminado correctamente.' })
  remove(@Param('dni') dni: string) {
    return this.pacienteService.remove(dni);
  }
}
