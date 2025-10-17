import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorModule } from './modules/doctor/doctor.module';
import { PacienteModule } from './modules/paciente/paciente.module';
import { TurnoModule } from './modules/turno/turno.module';
import { EspecialidadModule } from './modules/especialidad/especialidad.module';
import { CommonModule } from './modules/common.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 3306),
        username: configService.get('DB_USERNAME', 'root'),
        password: configService.get('DB_PASSWORD', ''),
        database: configService.get('DB_DATABASE', 'turnera'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'], // ✅ Seguro y limpio
        synchronize: true,
        logging: true,
      }),
      inject: [ConfigService],
    }),
    DoctorModule,
    PacienteModule,
    TurnoModule,
    EspecialidadModule,
    CommonModule,
  ],
})
export class AppModule {}