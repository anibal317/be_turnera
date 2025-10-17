import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToMany, OneToMany } from 'typeorm';
import { Especialidad } from './especialidad.entity';
import { HorarioDisponible } from './horario-disponible.entity';
import { Turno } from './turno.entity';

@Entity('doctor')
export class Doctor {
  @PrimaryGeneratedColumn({ name: 'id_doctor' })
  idDoctor: number;

  @Column({ length: 50, nullable: false })
  nombre: string;

  @Column({ length: 50, nullable: false })
  apellido: string;

  @Column({ length: 15, nullable: false })
  telefono: string;

  @Column({ length: 100, unique: true, nullable: false })
  email: string;

  @Column({ length: 20, unique: true, nullable: false })
  matricula: string;

  @Column({ default: true })
  activo: boolean;

  @CreateDateColumn({ name: 'fecha_registro' })
  fechaRegistro: Date;

  @ManyToMany(() => Especialidad, (especialidad) => especialidad.doctores)
  especialidades: Especialidad[];

  @OneToMany(() => HorarioDisponible, (horario) => horario.doctor)
  horariosDisponibles: HorarioDisponible[];

  @OneToMany(() => Turno, (turno) => turno.doctor)
  turnos: Turno[];
}
