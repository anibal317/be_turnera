import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Turno } from '@/entities/turno.entity';
import { CreateTurnoDto } from './dto/create-turno.dto';
import { UpdateTurnoDto } from './dto/update-turno.dto';
import { EstadoTurno } from '@/common/enums';

@Injectable()
export class TurnoService {
  constructor(
    @InjectRepository(Turno)
    private readonly turnoRepository: Repository<Turno>,
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
      throw new BadRequestException('Ya existe un turno confirmado en ese horario');
    }

    const turno = this.turnoRepository.create({
      ...createTurnoDto,
      fechaHora: fechaHora,
      estado: createTurnoDto.estado || EstadoTurno.PENDIENTE,
    });

    return await this.turnoRepository.save(turno);
  }

  async findAll(): Promise<Turno[]> {
    return await this.turnoRepository.find({
      relations: ['paciente', 'doctor', 'consultorio'],
      order: { fechaHora: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Turno> {
    const turno = await this.turnoRepository.findOne({
      where: { idTurno: id },
      relations: ['paciente', 'doctor', 'consultorio'],
    });

    if (!turno) {
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
    await this.turnoRepository.remove(turno);
  }

  async findByPaciente(dniPaciente: string): Promise<Turno[]> {
    return await this.turnoRepository.find({
      where: { idPaciente: dniPaciente },
      relations: ['doctor', 'consultorio'],
      order: { fechaHora: 'DESC' },
    });
  }

  async findByDoctor(idDoctor: number): Promise<Turno[]> {
    return await this.turnoRepository.find({
      where: { idDoctor },
      relations: ['paciente', 'consultorio'],
      order: { fechaHora: 'ASC' },
    });
  }

  async findByEstado(estado: EstadoTurno): Promise<Turno[]> {
    return await this.turnoRepository.find({
      where: { estado },
      relations: ['paciente', 'doctor', 'consultorio'],
      order: { fechaHora: 'ASC' },
    });
  }

  async findByFecha(fecha: Date): Promise<Turno[]> {
    const inicioDelDia = new Date(fecha);
    inicioDelDia.setHours(0, 0, 0, 0);
    
    const finDelDia = new Date(fecha);
    finDelDia.setHours(23, 59, 59, 999);

    return await this.turnoRepository.find({
      where: {
        fechaHora: Between(inicioDelDia, finDelDia),
      },
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
