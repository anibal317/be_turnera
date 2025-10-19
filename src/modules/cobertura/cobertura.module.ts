import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cobertura } from './entities/cobertura.entity';
import { CoberturaController } from './cobertura.controller';
import { CoberturaService } from './cobertura.service';

@Module({
  imports: [TypeOrmModule.forFeature([Cobertura])],
  controllers: [CoberturaController],
  providers: [CoberturaService],
  exports: [CoberturaService],
})
export class CoberturaModule {}
