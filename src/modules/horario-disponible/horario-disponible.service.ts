import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HorarioDisponible } from '@/entities/horario-disponible.entity';
import { DiaSemana } from '@/common/enums';

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

  async findAll(): Promise<HorarioDisponible[]> {
    return await this.horarioRepository.find({
      relations: ['doctor', 'consultorio'],
    });
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
