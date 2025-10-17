import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cobertura } from '@/entities/cobertura.entity';
import { CreateCoberturaDto } from './dto/create-cobertura.dto';
import { UpdateCoberturaDto } from './dto/update-cobertura.dto';

@Injectable()
export class CoberturaService {
  constructor(
    @InjectRepository(Cobertura)
    private readonly coberturaRepository: Repository<Cobertura>,
  ) {}

  async create(createCoberturaDto: CreateCoberturaDto): Promise<Cobertura> {
    const cobertura = this.coberturaRepository.create(createCoberturaDto);
    return await this.coberturaRepository.save(cobertura);
  }

  async findAll(): Promise<Cobertura[]> {
    return await this.coberturaRepository.find({
      relations: ['obrasSociales'],
    });
  }

  async findOne(id: number): Promise<Cobertura> {
    const cobertura = await this.coberturaRepository.findOne({
      where: { idCobertura: id },
      relations: ['obrasSociales'],
    });

    if (!cobertura) {
      throw new NotFoundException(`Cobertura con ID ${id} no encontrada`);
    }

    return cobertura;
  }

  async update(id: number, updateCoberturaDto: UpdateCoberturaDto): Promise<Cobertura> {
    const cobertura = await this.findOne(id);
    Object.assign(cobertura, updateCoberturaDto);
    return await this.coberturaRepository.save(cobertura);
  }

  async remove(id: number): Promise<void> {
    const cobertura = await this.findOne(id);
    await this.coberturaRepository.remove(cobertura);
  }
}
