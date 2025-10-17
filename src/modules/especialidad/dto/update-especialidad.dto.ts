import { PartialType } from '@nestjs/mapped-types';
import { CreateEspecialidadDto } from './create-especialidad.dto';

export class UpdateEspecialidadDto extends PartialType(CreateEspecialidadDto) {}
