import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from '@/modules/auth/entities/usuario.entity';
import { UsuarioService } from './usuario.service';
import { AppLogger } from '../../common/app-logger.service';
import { UsuarioController } from './usuario.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario])],
  controllers: [UsuarioController],
  providers: [UsuarioService, AppLogger],
  exports: [UsuarioService],
})
export class UsuarioModule {}
