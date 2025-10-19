import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { Doctor } from '../../doctor/entities/doctor.entity';

@Entity('especialidad')
export class Especialidad {
  @PrimaryGeneratedColumn({ name: 'id_especialidad' })
  idEspecialidad: number;

  @Column({ name: 'nombre_especialidad', length: 50 })
  nombreEspecialidad: string;

  @ManyToMany(() => Doctor, (doctor) => doctor.especialidades)
  @JoinTable({
    name: 'doctor_especialidad',
    joinColumn: { name: 'id_especialidad', referencedColumnName: 'idEspecialidad' },
    inverseJoinColumn: { name: 'id_doctor', referencedColumnName: 'idDoctor' },
  })
  doctores: Doctor[];
}
