import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Consultorio } from './entities/consultorio.entity';
import { ConsultorioController } from './consultorio.controller';
import { ConsultorioService } from './consultorio.service';
import { AppLogger } from '../../common/app-logger.service';

@Module({
  imports: [TypeOrmModule.forFeature([Consultorio])],
  controllers: [ConsultorioController],
  providers: [ConsultorioService, AppLogger],
  exports: [ConsultorioService],
})
export class ConsultorioModule {}
