import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Paciente } from './entities/paciente.entity';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';

@Injectable()
export class PacienteService {
  constructor(
    @InjectRepository(Paciente)
    private readonly pacienteRepository: Repository<Paciente>,
  ) {}

  async create(createPacienteDto: CreatePacienteDto): Promise<Paciente> {
    const paciente = this.pacienteRepository.create(createPacienteDto);
    return await this.pacienteRepository.save(paciente);
  }

  async findAll(options: {
    page?: number;
    limit?: number;
    sort?: string;
    order?: 'ASC' | 'DESC';
    nombre?: string;
    apellido?: string;
    dniPaciente?: string;
    activo?: boolean;
    isAdmin?: boolean;
  } = {}): Promise<{ data: Paciente[]; total: number; page: number; limit: number }> {
    const {
      page = 1,
      limit = 10,
      sort = 'apellido',
      order = 'ASC',
      nombre,
      apellido,
      dniPaciente,
      activo,
      isAdmin = false
    } = options;

    const where: any = {};
    if (nombre) where.nombre = nombre;
    if (apellido) where.apellido = apellido;
    if (dniPaciente) where.dniPaciente = dniPaciente;
    if (!isAdmin) {
      if (typeof activo === 'boolean') {
        where.activo = activo;
      } else {
        where.activo = true;
      }
    } else if (typeof activo === 'boolean') {
      where.activo = activo;
    }

    const [data, total] = await this.pacienteRepository.findAndCount({
      where,
      order: { [sort]: order },
      skip: (page - 1) * limit,
      take: limit,
      relations: ['obraSocial', 'cobertura'],
    });
    return { data, total, page, limit };
  }

  async findOne(dni: string, isAdmin = false): Promise<Paciente> {
    const where: any = { dniPaciente: dni };
    if (!isAdmin) where.activo = true;
    const paciente = await this.pacienteRepository.findOne({
      where,
      relations: ['obraSocial', 'cobertura', 'turnos'],
    });
    if (!paciente) {
      throw new NotFoundException(`Paciente con DNI ${dni} no encontrado`);
    }
    return paciente;
  }

  async update(dni: string, updatePacienteDto: UpdatePacienteDto): Promise<Paciente> {
    const paciente = await this.findOne(dni);
    Object.assign(paciente, updatePacienteDto);
    return await this.pacienteRepository.save(paciente);
  }


  async remove(dni: string): Promise<void> {
    const paciente = await this.findOne(dni);
    paciente.activo = false;
    await this.pacienteRepository.save(paciente);
  }

  async findInactivos(): Promise<Paciente[]> {
    return await this.pacienteRepository.find({
      where: { activo: false },
      relations: ['obraSocial', 'cobertura'],
    });
  }

  async restore(dni: string): Promise<Paciente> {
    const paciente = await this.pacienteRepository.findOne({ where: { dniPaciente: dni, activo: false } });
    if (!paciente) throw new NotFoundException('Paciente inactivo no encontrado');
    paciente.activo = true;
    return this.pacienteRepository.save(paciente);
  }

  async findActivos(): Promise<Paciente[]> {
    return await this.pacienteRepository.find({
      where: { activo: true },
      relations: ['obraSocial', 'cobertura'],
    });
  }
}
