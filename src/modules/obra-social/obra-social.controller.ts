import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ObraSocialService, CreateObraSocialDto, UpdateObraSocialDto } from './obra-social.service';

@Controller('obras-sociales')
export class ObraSocialController {
  constructor(private readonly obraSocialService: ObraSocialService) {}

  @Post()
  create(@Body() createDto: CreateObraSocialDto) {
    return this.obraSocialService.create(createDto);
  }

  @Get()
  findAll() {
    return this.obraSocialService.findAll();
  }

  @Get('activas')
  findActivas() {
    return this.obraSocialService.findActivas();
  }

  @Get(':codigo')
  findOne(@Param('codigo') codigo: string) {
    return this.obraSocialService.findOne(codigo);
  }

  @Patch(':codigo')
  update(@Param('codigo') codigo: string, @Body() updateDto: UpdateObraSocialDto) {
    return this.obraSocialService.update(codigo, updateDto);
  }

  @Delete(':codigo')
  remove(@Param('codigo') codigo: string) {
    return this.obraSocialService.remove(codigo);
  }
}
