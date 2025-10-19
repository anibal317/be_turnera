import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { AppLogger } from '../../common/app-logger.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Turno } from './entities/turno.entity';
import { CreateTurnoDto } from './dto/create-turno.dto';
import { UpdateTurnoDto } from './dto/update-turno.dto';
import { EstadoTurno } from '../../common/enums/estado-turno.enum';


@Injectable()
export class TurnoService {
  constructor(
    @InjectRepository(Turno)
    private readonly turnoRepository: Repository<Turno>,
    private readonly logger: AppLogger,
  ) {}

  async create(createTurnoDto: CreateTurnoDto): Promise<Turno> {
    // Verificar disponibilidad del turno
    const fechaHora = new Date(createTurnoDto.fechaHora);
    const turnoExistente = await this.turnoRepository.findOne({
      where: {
        idDoctor: createTurnoDto.idDoctor,
        idConsultorio: createTurnoDto.idConsultorio,
        fechaHora: fechaHora,
        estado: EstadoTurno.CONFIRMADO,
      },
    });

    if (turnoExistente) {
      this.logger.warn(`Intento de crear turno duplicado para doctor ${createTurnoDto.idDoctor} en horario ${createTurnoDto.fechaHora}`);
      throw new BadRequestException('Ya existe un turno confirmado en ese horario');
    }

    const turno = this.turnoRepository.create({
      ...createTurnoDto,
      fechaHora: fechaHora,
      estado: createTurnoDto.estado || EstadoTurno.PENDIENTE,
    });

    return await this.turnoRepository.save(turno);
  }

  async findAll(options: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
    filter?: string;
    isAdmin?: boolean;
  } = {}): Promise<{ data: Turno[]; total: number; page: number; limit: number }> {
    const { page = 1, limit = 10, sortBy = 'fechaHora', sortOrder = 'ASC', filter, isAdmin = false } = options;
    const skip = (page - 1) * limit;
    const query = this.turnoRepository.createQueryBuilder('turno')
      .leftJoinAndSelect('turno.paciente', 'paciente')
      .leftJoinAndSelect('turno.doctor', 'doctor')
      .leftJoinAndSelect('turno.consultorio', 'consultorio');

    if (!isAdmin) {
      query.andWhere('turno.activo = :activo', { activo: true });
    }

    if (filter) {
      query.andWhere('LOWER(paciente.nombre) LIKE :filter OR LOWER(doctor.nombre) LIKE :filter OR LOWER(consultorio.nombre) LIKE :filter', { filter: `%${filter.toLowerCase()}%` });
    }

    query.orderBy(`turno.${sortBy}`, sortOrder as any)
      .skip(skip)
      .take(limit);

    const [data, total] = await query.getManyAndCount();
    return { data, total, page, limit };
  }

  async findOne(id: number, isAdmin = false): Promise<Turno> {
    const where: any = { idTurno: id };
    if (!isAdmin) where.activo = true;
    const turno = await this.turnoRepository.findOne({
      where,
      relations: ['paciente', 'doctor', 'consultorio'],
    });
    if (!turno) {
      this.logger.error(`Turno con ID ${id} no encontrado`);
      throw new NotFoundException(`Turno con ID ${id} no encontrado`);
    }
    return turno;
  }

  async update(id: number, updateTurnoDto: UpdateTurnoDto): Promise<Turno> {
    const turno = await this.findOne(id);
    
    if (updateTurnoDto.fechaHora) {
      const nuevaFecha = new Date(updateTurnoDto.fechaHora);
      Object.assign(turno, { ...updateTurnoDto, fechaHora: nuevaFecha });
    } else {
      Object.assign(turno, updateTurnoDto);
    }

    return await this.turnoRepository.save(turno);
  }


  async remove(id: number): Promise<void> {
    const turno = await this.findOne(id);
    turno.activo = false;
    await this.turnoRepository.save(turno);
  }

  async findInactivos(options: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
    filter?: string;
  } = {}): Promise<{ data: Turno[]; total: number; page: number; limit: number }> {
    const { page = 1, limit = 10, sortBy = 'fechaHora', sortOrder = 'ASC', filter } = options;
    const skip = (page - 1) * limit;
    const query = this.turnoRepository.createQueryBuilder('turno')
      .leftJoinAndSelect('turno.paciente', 'paciente')
      .leftJoinAndSelect('turno.doctor', 'doctor')
      .leftJoinAndSelect('turno.consultorio', 'consultorio')
      .where('turno.activo = :activo', { activo: false });

    if (filter) {
      query.andWhere('LOWER(paciente.nombre) LIKE :filter OR LOWER(doctor.nombre) LIKE :filter OR LOWER(consultorio.nombre) LIKE :filter', { filter: `%${filter.toLowerCase()}%` });
    }

    query.orderBy(`turno.${sortBy}`, sortOrder as any)
      .skip(skip)
      .take(limit);

    const [data, total] = await query.getManyAndCount();
    return { data, total, page, limit };
  }

  async restore(id: number): Promise<Turno> {
    const turno = await this.turnoRepository.findOne({ where: { idTurno: id, activo: false } });
    if (!turno) throw new NotFoundException('Turno inactivo no encontrado');
    turno.activo = true;
    return this.turnoRepository.save(turno);
  }

  async findByPaciente(dniPaciente: string, isAdmin = false): Promise<Turno[]> {
    const where: any = { idPaciente: dniPaciente };
    if (!isAdmin) where.activo = true;
    return await this.turnoRepository.find({
      where,
      relations: ['doctor', 'consultorio'],
      order: { fechaHora: 'DESC' },
    });
  }

  async findByDoctor(idDoctor: number, isAdmin = false): Promise<Turno[]> {
    const where: any = { idDoctor };
    if (!isAdmin) where.activo = true;
    return await this.turnoRepository.find({
      where,
      relations: ['paciente', 'consultorio'],
      order: { fechaHora: 'ASC' },
    });
  }

  async findByEstado(estado: EstadoTurno, isAdmin = false): Promise<Turno[]> {
    const where: any = { estado };
    if (!isAdmin) where.activo = true;
    return await this.turnoRepository.find({
      where,
      relations: ['paciente', 'doctor', 'consultorio'],
      order: { fechaHora: 'ASC' },
    });
  }

  async findByFecha(fecha: Date, isAdmin = false): Promise<Turno[]> {
    const inicioDelDia = new Date(fecha);
    inicioDelDia.setHours(0, 0, 0, 0);
    const finDelDia = new Date(fecha);
    finDelDia.setHours(23, 59, 59, 999);
    const where: any = { fechaHora: Between(inicioDelDia, finDelDia) };
    if (!isAdmin) where.activo = true;
    return await this.turnoRepository.find({
      where,
      relations: ['paciente', 'doctor', 'consultorio'],
      order: { fechaHora: 'ASC' },
    });
  }

  async confirmarTurno(id: number): Promise<Turno> {
    const turno = await this.findOne(id);
    turno.estado = EstadoTurno.CONFIRMADO;
    return await this.turnoRepository.save(turno);
  }

  async cancelarTurno(id: number): Promise<Turno> {
    const turno = await this.findOne(id);
    turno.estado = EstadoTurno.CANCELADO;
    return await this.turnoRepository.save(turno);
  }

  async completarTurno(id: number): Promise<Turno> {
    const turno = await this.findOne(id);
    turno.estado = EstadoTurno.COMPLETADO;
    return await this.turnoRepository.save(turno);
  }
}
