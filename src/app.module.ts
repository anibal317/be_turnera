import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './modules/auth/auth.module';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from './modules/auth/guards/roles.guard';
import { DoctorModule } from './modules/doctor/doctor.module';
import { PacienteModule } from './modules/paciente/paciente.module';
import { TurnoModule } from './modules/turno/turno.module';
import { EspecialidadModule } from './modules/especialidad/especialidad.module';
import { CommonModule } from './modules/common.module';
import * as entities from './entities';

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
        entities: Object.values(entities),
        synchronize: false, // En producción siempre debe ser false
        logging: true,
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
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
