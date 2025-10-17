import { Entity, Column, PrimaryColumn, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { ObraSocial } from './obra-social.entity';
import { Cobertura } from './cobertura.entity';
import { Turno } from './turno.entity';

@Entity('paciente')
export class Paciente {
  @PrimaryColumn({ name: 'dni_paciente', length: 9 })
  dniPaciente: string;

  @Column({ length: 50 })
  nombre: string;

  @Column({ length: 50 })
  apellido: string;

  @Column({ name: 'fecha_nacimiento', type: 'date', nullable: false })
  fechaNacimiento: Date;

  @Column({ type: 'text', nullable: true })
  direccion: string;

  @Column({ length: 15, nullable: false })
  telefono: string;

  @Column({ length: 100, nullable: true, default: null })
  email: string;

  @CreateDateColumn({ name: 'fecha_registro' })
  fechaRegistro: Date;

  @Column({ default: true })
  activo: boolean;

  @Column({ name: 'id_obra_social', length: 6, nullable: false })
  idObraSocial: string;

  @Column({ name: 'numero_afiliado', length: 50, nullable: true })
  numeroAfiliado: string;

  @Column({ name: 'id_cobertura', nullable: false, default: 1 })
  idCobertura: number;

  @ManyToOne(() => ObraSocial, (obraSocial) => obraSocial.pacientes)
  @JoinColumn({ name: 'id_obra_social' })
  obraSocial: ObraSocial;

  @ManyToOne(() => Cobertura, (cobertura) => cobertura.pacientes)
  @JoinColumn({ name: 'id_cobertura' })
  cobertura: Cobertura;

  @OneToMany(() => Turno, (turno) => turno.paciente)
  turnos: Turno[];
}
