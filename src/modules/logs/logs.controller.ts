import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiQuery, ApiTags, ApiForbiddenResponse } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/entities/usuario.entity';
import { AppLogger } from '../../common/app-logger.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@ApiTags('Logs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('logs')
export class LogsController {
  constructor(private readonly logger: AppLogger) {}

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Consultar logs de la aplicación', description: 'Permite al admin consultar los logs de errores y warnings.' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Cantidad máxima de líneas a mostrar', example: 100 })
  @ApiResponse({ status: 200, description: 'Listado de logs.' })
  @ApiForbiddenResponse({ description: 'No autorizado. Solo el admin puede acceder a este recurso.' })
  getLogs(@Query('limit') limit = 100) {
    return { logs: AppLogger.getLogs(Number(limit) || 100) };
  }
}
