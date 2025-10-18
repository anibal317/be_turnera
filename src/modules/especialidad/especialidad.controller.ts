import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { EspecialidadService } from './especialidad.service';
import { CreateEspecialidadDto } from './dto/create-especialidad.dto';
import { UpdateEspecialidadDto } from './dto/update-especialidad.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@/entities/user.entity';
import { Public } from '../auth/decorators/public.decorator';

@Controller('especialidades')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EspecialidadController {
  constructor(private readonly especialidadService: EspecialidadService) {}

  @Post()
  @Roles(UserRole.SECRETARIO)
  create(@Body() createEspecialidadDto: CreateEspecialidadDto) {
    return this.especialidadService.create(createEspecialidadDto);
  }

  @Get()
  @Public()
  findAll() {
    return this.especialidadService.findAll();
  }

  @Get(':id')
  @Public()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.especialidadService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.SECRETARIO)
  update(@Param('id', ParseIntPipe) id: number, @Body() updateEspecialidadDto: UpdateEspecialidadDto) {
    return this.especialidadService.update(id, updateEspecialidadDto);
  }

  @Delete(':id')
  @Roles(UserRole.SECRETARIO)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.especialidadService.remove(id);
  }
}
