import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Doctor } from './entities/doctor.entity';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { Especialidad } from '../especialidad/entities/especialidad.entity';

@Injectable()
export class DoctorService {
  constructor(
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
    @InjectRepository(Especialidad)
    private readonly especialidadRepository: Repository<Especialidad>,
  ) {}

  async create(createDoctorDto: CreateDoctorDto): Promise<Doctor> {
    const { especialidades, ...rest } = createDoctorDto;
    const doctor = this.doctorRepository.create(rest);
    if (especialidades && Array.isArray(especialidades) && especialidades.length > 0) {
      doctor.especialidades = await this.especialidadRepository.findByIds(especialidades);
    }
    return await this.doctorRepository.save(doctor);
  }

  async findAll(options: {
    page?: number;
    limit?: number;
    sort?: string;
    order?: 'ASC' | 'DESC';
    nombre?: string;
    apellido?: string;
    matricula?: string;
    activo?: boolean;
  } = {}): Promise<{ data: Doctor[]; total: number; page: number; limit: number }> {
    const {
      page = 1,
      limit = 10,
      sort = 'apellido',
      order = 'ASC',
      nombre,
      apellido,
      matricula,
      activo
    } = options;

    const where: any = {};
    if (nombre) where.nombre = nombre;
    if (apellido) where.apellido = apellido;
    if (matricula) where.matricula = matricula;
    if (typeof activo === 'boolean') where.activo = activo;

    const [data, total] = await this.doctorRepository.findAndCount({
      where,
      order: { [sort]: order },
      skip: (page - 1) * limit,
      take: limit,
      relations: ['especialidades', 'horariosDisponibles'],
    });
    return { data, total, page, limit };
  }

  async findOne(id: number): Promise<Doctor> {
    const doctor = await this.doctorRepository.findOne({
      where: { idDoctor: id },
      relations: ['especialidades', 'horariosDisponibles'],
    });

    if (!doctor) {
      throw new NotFoundException(`Doctor con ID ${id} no encontrado`);
    }

    return doctor;
  }

  async update(id: number, updateDoctorDto: UpdateDoctorDto): Promise<Doctor> {
    const { especialidades, ...rest } = updateDoctorDto;
    const doctor = await this.findOne(id);
    Object.assign(doctor, rest);
    if (especialidades && Array.isArray(especialidades)) {
      doctor.especialidades = await this.especialidadRepository.findByIds(especialidades);
    }
    return await this.doctorRepository.save(doctor);
  }

  async remove(id: number): Promise<void> {
    const doctor = await this.findOne(id);
    await this.doctorRepository.remove(doctor);
  }

  async findActivos(options: {
    page?: number;
    limit?: number;
    sort?: string;
    order?: 'ASC' | 'DESC';
    nombre?: string;
    apellido?: string;
    matricula?: string;
  } = {}): Promise<{ data: Doctor[]; total: number; page: number; limit: number }> {
    const {
      page = 1,
      limit = 10,
      sort = 'apellido',
      order = 'ASC',
      nombre,
      apellido,
      matricula
    } = options;

    const where: any = { activo: true };
    if (nombre) where.nombre = nombre;
    if (apellido) where.apellido = apellido;
    if (matricula) where.matricula = matricula;

    const [data, total] = await this.doctorRepository.findAndCount({
      where,
      order: { [sort]: order },
      skip: (page - 1) * limit,
      take: limit,
      relations: ['especialidades'],
    });
    return { data, total, page, limit };
  }
}
