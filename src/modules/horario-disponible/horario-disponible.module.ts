import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HorarioDisponible } from './entities/horario-disponible.entity';
import { HorarioDisponibleController } from './horario-disponible.controller';
import { HorarioDisponibleService } from './horario-disponible.service';

@Module({
  imports: [TypeOrmModule.forFeature([HorarioDisponible])],
  controllers: [HorarioDisponibleController],
  providers: [HorarioDisponibleService],
  exports: [HorarioDisponibleService],
})
export class HorarioDisponibleModule {}
