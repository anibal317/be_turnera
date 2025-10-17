import { IsString, MaxLength } from 'class-validator';

export class CreateEspecialidadDto {
  @IsString()
  @MaxLength(50)
  nombreEspecialidad: string;
}
