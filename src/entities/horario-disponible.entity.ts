import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Doctor } from './doctor.entity';
import { Consultorio } from './consultorio.entity';
import { DiaSemana } from '@/common/enums';

@Entity('horario_disponible')
export class HorarioDisponible {
  @PrimaryGeneratedColumn({ name: 'id_horario' })
  idHorario: number;

  @Column({ name: 'id_doctor', nullable: false })
  idDoctor: number;

  @Column({ name: 'id_consultorio', nullable: false })
  idConsultorio: number;

  @Column({
    name: 'dia_semana',
    type: 'enum',
    enum: DiaSemana,
    nullable: false,
  })
  diaSemana: DiaSemana;

  @Column({ name: 'hora_inicio', type: 'time', nullable: false })
  horaInicio: string;

  @Column({ name: 'hora_fin', type: 'time', nullable: false })
  horaFin: string;

  @Column({ name: 'duracion_turno', default: 30 })
  duracionTurno: number;

  @ManyToOne(() => Doctor, (doctor) => doctor.horariosDisponibles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_doctor' })
  doctor: Doctor;

  @ManyToOne(() => Consultorio, (consultorio) => consultorio.horariosDisponibles)
  @JoinColumn({ name: 'id_consultorio' })
  consultorio: Consultorio;
}
