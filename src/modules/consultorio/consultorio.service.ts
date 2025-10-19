import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Consultorio } from './entities/consultorio.entity';

@Injectable()
export class ConsultorioService {
  constructor(
    @InjectRepository(Consultorio)
    private readonly consultorioRepository: Repository<Consultorio>,
  ) {}

  async create(nombre: string): Promise<Consultorio> {
    const consultorio = this.consultorioRepository.create({ nombre });
    return await this.consultorioRepository.save(consultorio);
  }

  async findAll(): Promise<Consultorio[]> {
    return await this.consultorioRepository.find();
  }

  async findOne(id: number): Promise<Consultorio> {
    const consultorio = await this.consultorioRepository.findOne({
      where: { idConsultorio: id },
    });

    if (!consultorio) {
      throw new NotFoundException(`Consultorio con ID ${id} no encontrado`);
    }

    return consultorio;
  }

  async update(id: number, nombre: string, activo?: boolean): Promise<Consultorio> {
    const consultorio = await this.findOne(id);
    consultorio.nombre = nombre;
    if (activo !== undefined) {
      consultorio.activo = activo;
    }
    return await this.consultorioRepository.save(consultorio);
  }

  async remove(id: number): Promise<void> {
    const consultorio = await this.findOne(id);
    await this.consultorioRepository.remove(consultorio);
  }

  async findActivos(): Promise<Consultorio[]> {
    return await this.consultorioRepository.find({
      where: { activo: true },
    });
  }
}
