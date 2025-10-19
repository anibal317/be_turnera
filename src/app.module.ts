import { LogsModule } from './modules/logs/logs.module';
import { AppLogger } from './common/app-logger.service';
import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { RequestLoggerMiddleware } from './common/request-logger.middleware';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { DoctorModule } from './modules/doctor/doctor.module';
import { PacienteModule } from './modules/paciente/paciente.module';
import { TurnoModule } from './modules/turno/turno.module';
import { EspecialidadModule } from './modules/especialidad/especialidad.module';
import { CommonModule } from './modules/common.module';

import { Usuario } from './modules/auth/entities/usuario.entity';
import { Doctor } from './modules/doctor/entities/doctor.entity';
import { Paciente } from './modules/paciente/entities/paciente.entity';
import { Turno } from './modules/turno/entities/turno.entity';
import { Especialidad } from './modules/especialidad/entities/especialidad.entity';
import { ObraSocial } from './modules/obra-social/entities/obra-social.entity';
import { Cobertura } from './modules/cobertura/entities/cobertura.entity';
import { Consultorio } from './modules/consultorio/entities/consultorio.entity';
import { HorarioDisponible } from './modules/horario-disponible/entities/horario-disponible.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 3306),
        username: configService.get('DB_USERNAME', 'root'),
        password: configService.get('DB_PASSWORD', ''),
        database: configService.get('DB_DATABASE', 'turnera'),
        entities: [
          Usuario,
          Doctor,
          Paciente,
          Turno,
          Especialidad,
          ObraSocial,
          Cobertura,
          Consultorio,
          HorarioDisponible,
        ],
        synchronize: true,
        logging: false,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    DoctorModule,
    PacienteModule,
    TurnoModule,
    EspecialidadModule,
  CommonModule,
  LogsModule,
  ],
  providers: [AppLogger],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
