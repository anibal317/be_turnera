import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { Doctor } from './doctor.entity';
import { Paciente } from './paciente.entity';

export enum UserRole {
  ADMIN = 'admin',
  SECRETARIO = 'secretario',
  MEDICO = 'medico',
  PACIENTE = 'paciente',
}

@Entity('usuario')
export class Usuario {
  @PrimaryGeneratedColumn({ name: 'id_usuario' })
  idUsuario: number;

  @Column({ length: 100, unique: true, nullable: false })
  email: string;

  @Column({ length: 255, nullable: false, select: false })
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.PACIENTE,
  })
  rol: UserRole;

  @Column({ default: true })
  activo: boolean;

  @Column({ name: 'id_doctor', nullable: true })
  idDoctor: number;

  @Column({ name: 'dni_paciente', length: 9, nullable: true })
  dniPaciente: string;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_actualizacion' })
  fechaActualizacion: Date;

  @OneToOne(() => Doctor, { nullable: true })
  @JoinColumn({ name: 'id_doctor' })
  doctor: Doctor;

  @OneToOne(() => Paciente, { nullable: true })
  @JoinColumn({ name: 'dni_paciente' })
  paciente: Paciente;
}
