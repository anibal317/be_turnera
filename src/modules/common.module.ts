import { Module, Global } from '@nestjs/common';
import { AppLogger } from '../common/app-logger.service';
import { RequestLoggerMiddleware } from '../common/request-logger.middleware';
import { CoberturaModule } from './cobertura/cobertura.module';
import { ObraSocialModule } from './obra-social/obra-social.module';
import { ConsultorioModule } from './consultorio/consultorio.module';
import { HorarioDisponibleModule } from './horario-disponible/horario-disponible.module';

@Global()
@Module({
  imports: [
    CoberturaModule,
    ObraSocialModule,
    ConsultorioModule,
    HorarioDisponibleModule,
  ],
  providers: [AppLogger, RequestLoggerMiddleware],
  exports: [
    CoberturaModule,
    ObraSocialModule,
    ConsultorioModule,
    HorarioDisponibleModule,
  AppLogger,
  RequestLoggerMiddleware,
  ],
})
export class CommonModule {}
