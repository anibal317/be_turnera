import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PacienteService } from './paciente.service';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';

@Controller('pacientes')
export class PacienteController {
  constructor(private readonly pacienteService: PacienteService) {}

  @Post()
  create(@Body() createPacienteDto: CreatePacienteDto) {
    return this.pacienteService.create(createPacienteDto);
  }

  @Get()
  findAll() {
    return this.pacienteService.findAll();
  }

  @Get('activos')
  findActivos() {
    return this.pacienteService.findActivos();
  }

  @Get(':dni')
  findOne(@Param('dni') dni: string) {
    return this.pacienteService.findOne(dni);
  }

  @Patch(':dni')
  update(@Param('dni') dni: string, @Body() updatePacienteDto: UpdatePacienteDto) {
    return this.pacienteService.update(dni, updatePacienteDto);
  }

  @Delete(':dni')
  remove(@Param('dni') dni: string) {
    return this.pacienteService.remove(dni);
  }
}
