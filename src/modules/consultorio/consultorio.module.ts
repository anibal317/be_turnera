import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Consultorio } from '@/entities/consultorio.entity';
import { ConsultorioController } from './consultorio.controller';
import { ConsultorioService } from './consultorio.service';

@Module({
  imports: [TypeOrmModule.forFeature([Consultorio])],
  controllers: [ConsultorioController],
  providers: [ConsultorioService],
  exports: [ConsultorioService],
})
export class ConsultorioModule {}
