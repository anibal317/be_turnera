import { IsString, IsEmail, IsDateString, IsBoolean, IsOptional, MaxLength, IsInt } from 'class-validator';

export class CreatePacienteDto {
  @IsString()
  @MaxLength(9)
  dniPaciente: string;

  @IsString()
  @MaxLength(50)
  nombre: string;

  @IsString()
  @MaxLength(50)
  apellido: string;

  @IsDateString()
  fechaNacimiento: string;

  @IsString()
  @IsOptional()
  direccion?: string;

  @IsString()
  @MaxLength(15)
  telefono: string;

  @IsEmail()
  @MaxLength(100)
  @IsOptional()
  email?: string;

  @IsBoolean()
  @IsOptional()
  activo?: boolean;

  @IsString()
  @MaxLength(6)
  idObraSocial: string;

  @IsString()
  @MaxLength(50)
  @IsOptional()
  numeroAfiliado?: string;

  @IsInt()
  @IsOptional()
  idCobertura?: number;
}
