import { PartialType } from '@nestjs/mapped-types';
import { CreateCoberturaDto } from './create-cobertura.dto';

export class UpdateCoberturaDto extends PartialType(CreateCoberturaDto) {}
