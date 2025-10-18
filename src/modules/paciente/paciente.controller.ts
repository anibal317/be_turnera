import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PacienteService } from './paciente.service';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@/entities';

@Controller('pacientes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PacienteController {
  constructor(private readonly pacienteService: PacienteService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.SECRETARIA)
  create(@Body() createPacienteDto: CreatePacienteDto) {
    return this.pacienteService.create(createPacienteDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.SECRETARIA)
  findAll() {
    return this.pacienteService.findAll();
  }

  @Get('activos')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.SECRETARIA)
  findActivos() {
    return this.pacienteService.findActivos();
  }

  @Get(':dni')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.SECRETARIA)
  findOne(@Param('dni') dni: string) {
    return this.pacienteService.findOne(dni);
  }

  @Patch(':dni')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.SECRETARIA)
  update(@Param('dni') dni: string, @Body() updatePacienteDto: UpdatePacienteDto) {
    return this.pacienteService.update(dni, updatePacienteDto);
  }

  @Delete(':dni')
  @Roles(UserRole.ADMIN)
  remove(@Param('dni') dni: string) {
    return this.pacienteService.remove(dni);
  }
}
