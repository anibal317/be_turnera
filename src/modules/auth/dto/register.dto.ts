import { IsEmail, IsString, MinLength, IsEnum, IsOptional, IsInt } from 'class-validator';
import { UserRole } from '@/entities/usuario.entity';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  @IsEnum(UserRole)
  rol: UserRole;

  @IsInt()
  @IsOptional()
  idDoctor?: number;

  @IsString()
  @IsOptional()
  dniPaciente?: string;
}
