import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Especialidad } from './entities/especialidad.entity';
import { CreateEspecialidadDto } from './dto/create-especialidad.dto';
import { UpdateEspecialidadDto } from './dto/update-especialidad.dto';

@Injectable()
export class EspecialidadService {
  constructor(
    @InjectRepository(Especialidad)
    private readonly especialidadRepository: Repository<Especialidad>,
  ) {}

  async create(createEspecialidadDto: CreateEspecialidadDto): Promise<Especialidad> {
    const especialidad = this.especialidadRepository.create(createEspecialidadDto);
    return await this.especialidadRepository.save(especialidad);
  }

  async findAll(options: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
    filter?: string;
  } = {}): Promise<{ data: Especialidad[]; total: number; page: number; limit: number }> {
    const { page = 1, limit = 10, sortBy = 'idEspecialidad', sortOrder = 'ASC', filter } = options;
    const skip = (page - 1) * limit;
    const query = this.especialidadRepository.createQueryBuilder('especialidad')
      .leftJoinAndSelect('especialidad.doctores', 'doctor');

    if (filter) {
      query.andWhere('LOWER(especialidad.nombre) LIKE :filter', { filter: `%${filter.toLowerCase()}%` });
    }

    query.orderBy(`especialidad.${sortBy}`, sortOrder as any)
      .skip(skip)
      .take(limit);

    const [data, total] = await query.getManyAndCount();
    return { data, total, page, limit };
  }

  async findOne(id: number): Promise<Especialidad> {
    const especialidad = await this.especialidadRepository.findOne({
      where: { idEspecialidad: id },
      relations: ['doctores'],
    });

    if (!especialidad) {
      throw new NotFoundException(`Especialidad con ID ${id} no encontrada`);
    }

    return especialidad;
  }

  async update(id: number, updateEspecialidadDto: UpdateEspecialidadDto): Promise<Especialidad> {
    const especialidad = await this.findOne(id);
    Object.assign(especialidad, updateEspecialidadDto);
    return await this.especialidadRepository.save(especialidad);
  }

  async remove(id: number): Promise<void> {
    const especialidad = await this.findOne(id);
    await this.especialidadRepository.remove(especialidad);
  }
}
