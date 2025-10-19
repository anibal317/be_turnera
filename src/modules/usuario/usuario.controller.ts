import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { Usuario } from '@/modules/auth/entities/usuario.entity';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/entities/usuario.entity';

@ApiTags('Usuarios')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('usuarios')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Listar usuarios', description: 'Solo el admin puede ver todos los usuarios.' })
  @ApiResponse({ status: 200, description: 'Listado de usuarios.' })
  findAll(): Promise<Usuario[]> {
    return this.usuarioService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Obtener usuario', description: 'Solo el admin puede ver un usuario por ID.' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Usuario encontrado.' })
  findOne(@Param('id') id: number): Promise<Usuario> {
    return this.usuarioService.findOne(id);
  }

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Crear usuario', description: 'Solo el admin puede crear usuarios.' })
  @ApiResponse({ status: 201, description: 'Usuario creado.' })
  create(@Body() data: Partial<Usuario>): Promise<Usuario> {
    return this.usuarioService.create(data);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Actualizar usuario', description: 'Solo el admin puede actualizar usuarios.' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Usuario actualizado.' })
  update(@Param('id') id: number, @Body() data: Partial<Usuario>): Promise<Usuario> {
    return this.usuarioService.update(id, data);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Eliminar usuario', description: 'Solo el admin puede eliminar usuarios.' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Usuario eliminado.' })
  remove(@Param('id') id: number): Promise<void> {
    return this.usuarioService.remove(id);
  }
}
