import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Especialidad } from '@/entities/especialidad.entity';
import { EspecialidadController } from './especialidad.controller';
import { EspecialidadService } from './especialidad.service';

@Module({
  imports: [TypeOrmModule.forFeature([Especialidad])],
  controllers: [EspecialidadController],
  providers: [EspecialidadService],
  exports: [EspecialidadService],
})
export class EspecialidadModule {}
