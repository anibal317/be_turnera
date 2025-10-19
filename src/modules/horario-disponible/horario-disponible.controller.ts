import { ApiBearerAuth } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query } from '@nestjs/common';
import { HorarioDisponibleService, CreateHorarioDisponibleDto, UpdateHorarioDisponibleDto } from './horario-disponible.service';
import { DiaSemana } from '../../common/enums/dia-semana.enum';

@Controller('horarios-disponibles')
  @ApiBearerAuth()
export class HorarioDisponibleController {
  constructor(private readonly horarioService: HorarioDisponibleService) {}

  @Post()
  create(@Body() createDto: CreateHorarioDisponibleDto) {
    return this.horarioService.create(createDto);
  }

  @Get()
  findAll() {
    return this.horarioService.findAll();
  }

  @Get('doctor/:id')
  findByDoctor(@Param('id', ParseIntPipe) id: number) {
    return this.horarioService.findByDoctor(id);
  }

  @Get('consultorio/:id')
  findByConsultorio(@Param('id', ParseIntPipe) id: number) {
    return this.horarioService.findByConsultorio(id);
  }

  @Get('dia')
  findByDia(@Query('dia') dia: DiaSemana) {
    return this.horarioService.findByDia(dia);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.horarioService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateHorarioDisponibleDto) {
    return this.horarioService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.horarioService.remove(id);
  }
}
