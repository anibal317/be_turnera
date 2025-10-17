import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Cobertura } from './cobertura.entity';
import { Paciente } from './paciente.entity';

@Entity('obra_social')
export class ObraSocial {
  @PrimaryColumn({ length: 6 })
  codigo: string;

  @Column({ length: 100, nullable: false })
  nombre: string;

  @Column({ length: 15, nullable: false })
  telefono: string;

  @Column({ length: 100, unique: true, nullable: false })
  email: string;

  @Column({ name: 'id_cobertura', nullable: false })
  idCobertura: number;

  @Column({ default: true })
  activa: boolean;

  @ManyToOne(() => Cobertura, (cobertura) => cobertura.obrasSociales)
  @JoinColumn({ name: 'id_cobertura' })
  cobertura: Cobertura;

  @OneToMany(() => Paciente, (paciente) => paciente.obraSocial)
  pacientes: Paciente[];
}
