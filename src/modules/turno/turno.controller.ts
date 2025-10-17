import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query } from '@nestjs/common';
import { TurnoService } from './turno.service';
import { CreateTurnoDto } from './dto/create-turno.dto';
import { UpdateTurnoDto } from './dto/update-turno.dto';
import { EstadoTurno } from '@/common/enums';

@Controller('turnos')
export class TurnoController {
  constructor(private readonly turnoService: TurnoService) {}

  @Post()
  create(@Body() createTurnoDto: CreateTurnoDto) {
    return this.turnoService.create(createTurnoDto);
  }

  @Get()
  findAll() {
    return this.turnoService.findAll();
  }

  @Get('estado/:estado')
  findByEstado(@Param('estado') estado: EstadoTurno) {
    return this.turnoService.findByEstado(estado);
  }

  @Get('paciente/:dni')
  findByPaciente(@Param('dni') dni: string) {
    return this.turnoService.findByPaciente(dni);
  }

  @Get('doctor/:id')
  findByDoctor(@Param('id', ParseIntPipe) id: number) {
    return this.turnoService.findByDoctor(id);
  }

  @Get('fecha')
  findByFecha(@Query('fecha') fecha: string) {
    return this.turnoService.findByFecha(new Date(fecha));
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.turnoService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateTurnoDto: UpdateTurnoDto) {
    return this.turnoService.update(id, updateTurnoDto);
  }

  @Patch(':id/confirmar')
  confirmar(@Param('id', ParseIntPipe) id: number) {
    return this.turnoService.confirmarTurno(id);
  }

  @Patch(':id/cancelar')
  cancelar(@Param('id', ParseIntPipe) id: number) {
    return this.turnoService.cancelarTurno(id);
  }

  @Patch(':id/completar')
  completar(@Param('id', ParseIntPipe) id: number) {
    return this.turnoService.completarTurno(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.turnoService.remove(id);
  }
}
