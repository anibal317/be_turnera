import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { TurnoService } from './turno.service';
import { CreateTurnoDto } from './dto/create-turno.dto';
import { UpdateTurnoDto } from './dto/update-turno.dto';
import { EstadoTurno } from '@/entities/turno.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@/entities/user.entity';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('turnos')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TurnoController {
  constructor(private readonly turnoService: TurnoService) {}

  @Post()
  @Roles(UserRole.SECRETARIO, UserRole.PACIENTE)
  create(@Body() createTurnoDto: CreateTurnoDto, @CurrentUser() user: any) {
    return this.turnoService.create(createTurnoDto);
  }

  @Get()
  @Roles(UserRole.SECRETARIO)
  findAll() {
    return this.turnoService.findAll();
  }

  @Get('mis-turnos')
  @Roles(UserRole.MEDICO, UserRole.PACIENTE)
  async getMisTurnos(@CurrentUser() user: any) {
    if (user.rol === UserRole.MEDICO) {
      // El idReferencia del médico debe corresponder al id_doctor
      return this.turnoService.findByDoctor(parseInt(user.idReferencia));
    } else if (user.rol === UserRole.PACIENTE) {
      // El idReferencia del paciente debe corresponder al dni_paciente
      return this.turnoService.findByPaciente(user.idReferencia);
    }
  }

  @Get('estado/:estado')
  @Roles(UserRole.SECRETARIO, UserRole.MEDICO)
  findByEstado(@Param('estado') estado: EstadoTurno) {
    return this.turnoService.findByEstado(estado);
  }

  @Get('paciente/:dni')
  @Roles(UserRole.SECRETARIO)
  findByPaciente(@Param('dni') dni: string) {
    return this.turnoService.findByPaciente(dni);
  }

  @Get('doctor/:id')
  @Roles(UserRole.SECRETARIO, UserRole.MEDICO)
  findByDoctor(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: any) {
    // Si es médico, solo puede ver sus propios turnos
    if (user.rol === UserRole.MEDICO && parseInt(user.idReferencia) !== id) {
      throw new Error('No tiene permisos para ver turnos de otros médicos');
    }
    return this.turnoService.findByDoctor(id);
  }

  @Get('fecha')
  @Roles(UserRole.SECRETARIO, UserRole.MEDICO)
  findByFecha(@Query('fecha') fecha: string) {
    return this.turnoService.findByFecha(new Date(fecha));
  }

  @Get(':id')
  @Roles(UserRole.SECRETARIO, UserRole.MEDICO, UserRole.PACIENTE)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.turnoService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.SECRETARIO)
  update(@Param('id', ParseIntPipe) id: number, @Body() updateTurnoDto: UpdateTurnoDto) {
    return this.turnoService.update(id, updateTurnoDto);
  }

  @Patch(':id/confirmar')
  @Roles(UserRole.SECRETARIO, UserRole.MEDICO)
  confirmar(@Param('id', ParseIntPipe) id: number) {
    return this.turnoService.confirmarTurno(id);
  }

  @Patch(':id/cancelar')
  @Roles(UserRole.SECRETARIO, UserRole.PACIENTE, UserRole.MEDICO)
  cancelar(@Param('id', ParseIntPipe) id: number) {
    return this.turnoService.cancelarTurno(id);
  }

  @Patch(':id/completar')
  @Roles(UserRole.SECRETARIO, UserRole.MEDICO)
  completar(@Param('id', ParseIntPipe) id: number) {
    return this.turnoService.completarTurno(id);
  }

  @Delete(':id')
  @Roles(UserRole.SECRETARIO)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.turnoService.remove(id);
  }
}
