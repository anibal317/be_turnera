import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { CoberturaService } from './cobertura.service';
import { CreateCoberturaDto } from './dto/create-cobertura.dto';
import { UpdateCoberturaDto } from './dto/update-cobertura.dto';

@Controller('coberturas')
export class CoberturaController {
  constructor(private readonly coberturaService: CoberturaService) {}

  @Post()
  create(@Body() createCoberturaDto: CreateCoberturaDto) {
    return this.coberturaService.create(createCoberturaDto);
  }

  @Get()
  findAll() {
    return this.coberturaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.coberturaService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateCoberturaDto: UpdateCoberturaDto) {
    return this.coberturaService.update(id, updateCoberturaDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.coberturaService.remove(id);
  }
}
