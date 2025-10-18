import { IsEmail, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';
import { UserRole } from '@/entities';

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
  @IsOptional()
  rol?: UserRole;

  @IsString()
  @IsOptional()
  idReferencia?: string;
}
