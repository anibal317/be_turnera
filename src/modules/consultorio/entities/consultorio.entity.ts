import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { HorarioDisponible } from '../../horario-disponible/entities/horario-disponible.entity';
import { Turno } from '../../turno/entities/turno.entity';

@Entity('consultorio')
export class Consultorio {
  @PrimaryGeneratedColumn({ name: 'id_consultorio' })
  idConsultorio: number;

  @Column({ length: 20 })
  nombre: string;

  @Column({ default: true })
  activo: boolean;

  @OneToMany(() => HorarioDisponible, (horario) => horario.consultorio)
  horariosDisponibles: HorarioDisponible[];

  @OneToMany(() => Turno, (turno) => turno.consultorio)
  turnos: Turno[];
}
