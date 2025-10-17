import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ObraSocial } from '@/entities/obra-social.entity';

export class CreateObraSocialDto {
  codigo: string;
  nombre: string;
  telefono: string;
  email: string;
  idCobertura: number;
  activa?: boolean;
}

export class UpdateObraSocialDto {
  nombre?: string;
  telefono?: string;
  email?: string;
  idCobertura?: number;
  activa?: boolean;
}

@Injectable()
export class ObraSocialService {
  constructor(
    @InjectRepository(ObraSocial)
    private readonly obraSocialRepository: Repository<ObraSocial>,
  ) {}

  async create(createDto: CreateObraSocialDto): Promise<ObraSocial> {
    const obraSocial = this.obraSocialRepository.create(createDto);
    return await this.obraSocialRepository.save(obraSocial);
  }

  async findAll(): Promise<ObraSocial[]> {
    return await this.obraSocialRepository.find({
      relations: ['cobertura'],
    });
  }

  async findOne(codigo: string): Promise<ObraSocial> {
    const obraSocial = await this.obraSocialRepository.findOne({
      where: { codigo },
      relations: ['cobertura'],
    });

    if (!obraSocial) {
      throw new NotFoundException(`Obra Social con código ${codigo} no encontrada`);
    }

    return obraSocial;
  }

  async update(codigo: string, updateDto: UpdateObraSocialDto): Promise<ObraSocial> {
    const obraSocial = await this.findOne(codigo);
    Object.assign(obraSocial, updateDto);
    return await this.obraSocialRepository.save(obraSocial);
  }

  async remove(codigo: string): Promise<void> {
    const obraSocial = await this.findOne(codigo);
    await this.obraSocialRepository.remove(obraSocial);
  }

  async findActivas(): Promise<ObraSocial[]> {
    return await this.obraSocialRepository.find({
      where: { activa: true },
      relations: ['cobertura'],
    });
  }
}
