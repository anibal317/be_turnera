import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HorarioDisponible } from './entities/horario-disponible.entity';
import { DiaSemana } from '../../common/enums/dia-semana.enum';

export class CreateHorarioDisponibleDto {
  idDoctor: number;
  idConsultorio: number;
  diaSemana: DiaSemana;
  horaInicio: string;
  horaFin: string;
  duracionTurno?: number;
}

export class UpdateHorarioDisponibleDto {
  idDoctor?: number;
  idConsultorio?: number;
  diaSemana?: DiaSemana;
  horaInicio?: string;
  horaFin?: string;
  duracionTurno?: number;
}

@Injectable()
export class HorarioDisponibleService {
  constructor(
    @InjectRepository(HorarioDisponible)
    private readonly horarioRepository: Repository<HorarioDisponible>,
  ) {}

  async create(createDto: CreateHorarioDisponibleDto): Promise<HorarioDisponible> {
    const horario = this.horarioRepository.create(createDto);
    return await this.horarioRepository.save(horario);
  }

  async findAll(options: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
    filter?: string;
  } = {}): Promise<{ data: HorarioDisponible[]; total: number; page: number; limit: number }> {
    const { page = 1, limit = 10, sortBy = 'idHorario', sortOrder = 'ASC', filter } = options;
    const skip = (page - 1) * limit;
    const query = this.horarioRepository.createQueryBuilder('horario')
      .leftJoinAndSelect('horario.doctor', 'doctor')
      .leftJoinAndSelect('horario.consultorio', 'consultorio');

    if (filter) {
      query.andWhere('LOWER(doctor.nombre) LIKE :filter OR LOWER(consultorio.nombre) LIKE :filter', { filter: `%${filter.toLowerCase()}%` });
    }

    query.orderBy(`horario.${sortBy}`, sortOrder as any)
      .skip(skip)
      .take(limit);

    const [data, total] = await query.getManyAndCount();
    return { data, total, page, limit };
  }

  async findOne(id: number): Promise<HorarioDisponible> {
    const horario = await this.horarioRepository.findOne({
      where: { idHorario: id },
      relations: ['doctor', 'consultorio'],
    });

    if (!horario) {
      throw new NotFoundException(`Horario con ID ${id} no encontrado`);
    }

    return horario;
  }

  async update(id: number, updateDto: UpdateHorarioDisponibleDto): Promise<HorarioDisponible> {
    const horario = await this.findOne(id);
    Object.assign(horario, updateDto);
    return await this.horarioRepository.save(horario);
  }

  async remove(id: number): Promise<void> {
    const horario = await this.findOne(id);
    await this.horarioRepository.remove(horario);
  }

  async findByDoctor(idDoctor: number): Promise<HorarioDisponible[]> {
    return await this.horarioRepository.find({
      where: { idDoctor },
      relations: ['consultorio'],
    });
  }

  async findByConsultorio(idConsultorio: number): Promise<HorarioDisponible[]> {
    return await this.horarioRepository.find({
      where: { idConsultorio },
      relations: ['doctor'],
    });
  }

  async findByDia(dia: DiaSemana): Promise<HorarioDisponible[]> {
    return await this.horarioRepository.find({
      where: { diaSemana: dia },
      relations: ['doctor', 'consultorio'],
    });
  }
}
