import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Paciente } from './paciente.entity';
import { Doctor } from './doctor.entity';
import { Consultorio } from './consultorio.entity';
import { EstadoTurno } from '@/common/enums';


@Entity('turno')
export class Turno {
  @PrimaryGeneratedColumn({ name: 'id_turno' })
  idTurno: number;

  @Column({ name: 'id_paciente', length: 9, nullable: false })
  idPaciente: string;

  @Column({ name: 'id_doctor', nullable: false })
  idDoctor: number;

  @Column({ name: 'id_consultorio', nullable: false })
  idConsultorio: number;

  @Column({ name: 'fecha_hora', type: 'datetime', nullable: false })
  fechaHora: Date;

  @CreateDateColumn({ name: 'fecha_solicitud' })
  fechaSolicitud: Date;

  @Column({ name: 'duracion_minutos', default: 30, nullable: false })
  duracionMinutos: number;

  @Column({
    type: 'enum',
    enum: EstadoTurno,
  })
  estado: EstadoTurno;

  @ManyToOne(() => Paciente, (paciente) => paciente.turnos)
  @JoinColumn({ name: 'id_paciente' })
  paciente: Paciente;

  @ManyToOne(() => Doctor, (doctor) => doctor.turnos)
  @JoinColumn({ name: 'id_doctor' })
  doctor: Doctor;

  @ManyToOne(() => Consultorio, (consultorio) => consultorio.turnos)
  @JoinColumn({ name: 'id_consultorio' })
  consultorio: Consultorio;
}
