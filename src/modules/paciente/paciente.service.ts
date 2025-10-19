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

  async findAll(): Promise<Paciente[]> {
    return await this.pacienteRepository.find({
      relations: ['obraSocial', 'cobertura'],
    });
  }

  async findOne(dni: string): Promise<Paciente> {
    const paciente = await this.pacienteRepository.findOne({
      where: { dniPaciente: dni },
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
    await this.pacienteRepository.remove(paciente);
  }

  async findActivos(): Promise<Paciente[]> {
    return await this.pacienteRepository.find({
      where: { activo: true },
      relations: ['obraSocial', 'cobertura'],
    });
  }
}
