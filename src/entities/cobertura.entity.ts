import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ObraSocial } from './obra-social.entity';
import { Paciente } from './paciente.entity';

@Entity('cobertura')
export class Cobertura {
  @PrimaryGeneratedColumn({ name: 'id_cobertura' })
  idCobertura: number;

  @Column({ length: 50, unique: true, nullable: false })
  nombre: string;

  @OneToMany(() => ObraSocial, (obraSocial) => obraSocial.cobertura)
  obrasSociales: ObraSocial[];

  @OneToMany(() => Paciente, (paciente) => paciente.cobertura)
  pacientes: Paciente[];
}
