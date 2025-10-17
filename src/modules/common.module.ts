import { Module } from '@nestjs/common';
import { CoberturaModule } from './cobertura/cobertura.module';
import { ObraSocialModule } from './obra-social/obra-social.module';
import { ConsultorioModule } from './consultorio/consultorio.module';
import { HorarioDisponibleModule } from './horario-disponible/horario-disponible.module';

@Module({
  imports: [
    CoberturaModule,
    ObraSocialModule,
    ConsultorioModule,
    HorarioDisponibleModule,
  ],
  exports: [
    CoberturaModule,
    ObraSocialModule,
    ConsultorioModule,
    HorarioDisponibleModule,
  ],
})
export class CommonModule {}
