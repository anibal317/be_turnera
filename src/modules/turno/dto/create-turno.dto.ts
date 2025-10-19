import { EstadoTurno } from '../../../common/enums/estado-turno.enum';
import { IsString, IsInt, IsDateString, IsEnum, IsOptional } from 'class-validator';

export class CreateTurnoDto {
  @IsString()
  idPaciente: string;

  @IsInt()
  idDoctor: number;

  @IsInt()
  idConsultorio: number;

  @IsDateString()
  fechaHora: string;

  @IsInt()
  @IsOptional()
  duracionMinutos?: number;

  @IsEnum(EstadoTurno)
  @IsOptional()
  estado?: EstadoTurno;
}
