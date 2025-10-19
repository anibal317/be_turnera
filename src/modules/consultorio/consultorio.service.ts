import { Injectable, NotFoundException } from '@nestjs/common';
import { AppLogger } from '../../common/app-logger.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Consultorio } from './entities/consultorio.entity';


@Injectable()
export class ConsultorioService {
  constructor(
    @InjectRepository(Consultorio) private readonly consultorioRepository: Repository<Consultorio>,
    private readonly logger: AppLogger
  ) {}

  async create(nombre: string): Promise<Consultorio> {
    const consultorio = this.consultorioRepository.create({ nombre });
    return await this.consultorioRepository.save(consultorio);
  }

  async findAll(options: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
    filter?: string;
    isAdmin?: boolean;
  } = {}): Promise<{ data: Consultorio[]; total: number; page: number; limit: number }> {
    const { page = 1, limit = 10, sortBy = 'idConsultorio', sortOrder = 'ASC', filter, isAdmin = false } = options;
    const skip = (page - 1) * limit;
    const query = this.consultorioRepository.createQueryBuilder('consultorio');
    if (!isAdmin) {
      query.andWhere('consultorio.activo = :activo', { activo: true });
    }
    if (filter) {
      query.andWhere('LOWER(consultorio.nombre) LIKE :filter', { filter: `%${filter.toLowerCase()}%` });
    }
    query.orderBy(`consultorio.${sortBy}`, sortOrder as any)
      .skip(skip)
      .take(limit);
    const [data, total] = await query.getManyAndCount();
    return { data, total, page, limit };
  }

  async findOne(id: number, isAdmin = false): Promise<Consultorio> {
    const where: any = { idConsultorio: id };
    if (!isAdmin) where.activo = true;
    const consultorio = await this.consultorioRepository.findOne({ where });
    if (!consultorio) {
      this.logger.error(`Consultorio con ID ${id} no encontrado`);
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
    consultorio.activo = false;
    await this.consultorioRepository.save(consultorio);
  }

  async findInactivos(): Promise<Consultorio[]> {
    return await this.consultorioRepository.find({ where: { activo: false } });
  }

  async restore(id: number): Promise<Consultorio> {
    const consultorio = await this.consultorioRepository.findOne({ where: { idConsultorio: id, activo: false } });
    if (!consultorio) throw new NotFoundException('Consultorio inactivo no encontrado');
    consultorio.activo = true;
    return this.consultorioRepository.save(consultorio);
  }

  async findActivos(): Promise<Consultorio[]> {
    return await this.consultorioRepository.find({
      where: { activo: true },
    });
  }
}
