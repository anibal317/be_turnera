import { IsString, IsEmail, IsBoolean, IsOptional, Length, MaxLength } from 'class-validator';

export class CreateDoctorDto {
  @IsString()
  @MaxLength(50)
  nombre: string;

  @IsString()
  @MaxLength(50)
  apellido: string;

  @IsString()
  @MaxLength(15)
  telefono: string;

  @IsEmail()
  @MaxLength(100)
  email: string;

  @IsString()
  @MaxLength(20)
  matricula: string;

  @IsBoolean()
  @IsOptional()
  activo?: boolean;
}
