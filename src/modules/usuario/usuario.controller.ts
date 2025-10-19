import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { UsuarioService } from './usuario.service';
import { Usuario } from '@/modules/auth/entities/usuario.entity';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiParam, ApiForbiddenResponse } from '@nestjs/swagger';
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
  @ApiOperation({ summary: 'Listar usuarios activos', description: 'Solo el admin puede ver todos los usuarios activos.' })
  @ApiResponse({ status: 200, description: 'Listado de usuarios activos.' })
  findAll(@GetUser() user?: any): Promise<Usuario[]> {
    const isAdmin = user && user.rol === UserRole.ADMIN;
    return this.usuarioService.findAll(isAdmin);
  }

  /**
   * Listar usuarios eliminados (solo admin)
   * @returns Listado de usuarios marcados como inactivos (soft delete)
   */
  @Get('inactivos')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Listar usuarios eliminados', description: 'Obtiene los usuarios marcados como inactivos. Solo accesible para administradores.' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Listado de usuarios inactivos.' })
  @ApiForbiddenResponse({ description: 'No autorizado. Solo el admin puede acceder a este recurso.' })
  findAllInactivos(): Promise<Usuario[]> {
    return this.usuarioService.findAllInactivos();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Obtener usuario', description: 'Solo el admin puede ver un usuario por ID.' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Usuario encontrado.' })
  findOne(@Param('id') id: number, @GetUser() user?: any): Promise<Usuario> {
    const isAdmin = user && user.rol === UserRole.ADMIN;
    return this.usuarioService.findOne(id, isAdmin);
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
  @ApiOperation({ summary: 'Eliminar usuario (soft delete)', description: 'Solo el admin puede eliminar usuarios. El usuario se marca como inactivo.' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Usuario marcado como inactivo.' })
  remove(@Param('id') id: number): Promise<void> {
    return this.usuarioService.remove(id);
  }

  /**
   * Restaurar usuario eliminado (solo admin)
   * @param id ID del usuario
   * @returns Usuario restaurado
   */
  @Patch(':id/restaurar')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Restaurar usuario eliminado', description: 'Restaura un usuario marcado como inactivo. Solo accesible para administradores.' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', type: Number, description: 'ID del usuario', example: 1 })
  @ApiResponse({ status: 200, description: 'Usuario restaurado.' })
  @ApiForbiddenResponse({ description: 'No autorizado. Solo el admin puede acceder a este recurso.' })
  restore(@Param('id') id: number): Promise<Usuario> {
    return this.usuarioService.restore(id);
  }
}
