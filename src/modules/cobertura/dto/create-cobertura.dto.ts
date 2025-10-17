import { IsString, MaxLength } from 'class-validator';

export class CreateCoberturaDto {
  @IsString()
  @MaxLength(50)
  nombre: string;
}
