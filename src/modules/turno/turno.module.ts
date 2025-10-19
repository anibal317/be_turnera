import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Turno } from './entities/turno.entity';
import { TurnoController } from './turno.controller';
import { TurnoService } from './turno.service';
import { AppLogger } from '../../common/app-logger.service';

@Module({
  imports: [TypeOrmModule.forFeature([Turno])],
  controllers: [TurnoController],
  providers: [TurnoService, AppLogger],
  exports: [TurnoService],
})
export class TurnoModule {}
