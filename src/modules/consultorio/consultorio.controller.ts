import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ConsultorioService } from './consultorio.service';

@Controller('consultorios')
export class ConsultorioController {
  constructor(private readonly consultorioService: ConsultorioService) {}

  @Post()
  create(@Body('nombre') nombre: string) {
    return this.consultorioService.create(nombre);
  }

  @Get()
  findAll() {
    return this.consultorioService.findAll();
  }

  @Get('activos')
  findActivos() {
    return this.consultorioService.findActivos();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.consultorioService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body('nombre') nombre: string,
    @Body('activo') activo?: boolean,
  ) {
    return this.consultorioService.update(id, nombre, activo);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.consultorioService.remove(id);
  }
}
