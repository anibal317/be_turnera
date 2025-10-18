import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { DoctorModule } from './modules/doctor/doctor.module';
import { PacienteModule } from './modules/paciente/paciente.module';
import { TurnoModule } from './modules/turno/turno.module';
import { EspecialidadModule } from './modules/especialidad/especialidad.module';
import { CommonModule } from './modules/common.module';
import {
  Usuario,
  Doctor,
  Paciente,
  Turno,
  Especialidad,
  ObraSocial,
  Cobertura,
  Consultorio,
  HorarioDisponible,
} from './entities';

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
  ],
})
export class AppModule {}
