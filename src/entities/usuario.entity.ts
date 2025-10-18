import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('usuario')
export class Usuario {
  @PrimaryGeneratedColumn({ name: 'id_usuario' })
  idUsuario: number;

  @Column({ length: 100, unique: true, nullable: false })
  email: string;

  @Column({ length: 255, nullable: false, select: false })
  password: string;

  @Column({ length: 50, default: 'usuario' })
  nombre: string;

  @Column({ default: true })
  activo: boolean;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;
}
