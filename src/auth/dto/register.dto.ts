import { IsEmail, IsString, MinLength, IsEnum, IsOptional } from 'class-validator';
import { UserRole } from '@/entities/usuario.entity';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @IsOptional()
  nombre?: string;

  @IsEnum(UserRole)
  rol: UserRole;

  @IsString()
  @IsOptional()
  idReferencia?: string;
}
