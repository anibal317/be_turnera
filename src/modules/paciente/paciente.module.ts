import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Paciente } from './entities/paciente.entity';
import { PacienteController } from './paciente.controller';
import { PacienteService } from './paciente.service';
import { AppLogger } from '../../common/app-logger.service';

@Module({
  imports: [TypeOrmModule.forFeature([Paciente])],
  controllers: [PacienteController],
  providers: [PacienteService, AppLogger],
  exports: [PacienteService],
})
export class PacienteModule {}
