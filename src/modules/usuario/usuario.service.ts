import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '@/modules/auth/entities/usuario.entity';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async findAll(): Promise<Usuario[]> {
    return this.usuarioRepository.find();
  }

  async findOne(id: number): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({ where: { idUsuario: id } });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');
    return usuario;
  }

  async create(data: Partial<Usuario>): Promise<Usuario> {
    const usuario = this.usuarioRepository.create(data);
    return this.usuarioRepository.save(usuario);
  }

  async update(id: number, data: Partial<Usuario>): Promise<Usuario> {
    const usuario = await this.findOne(id);
    Object.assign(usuario, data);
    return this.usuarioRepository.save(usuario);
  }

  async remove(id: number): Promise<void> {
    const usuario = await this.findOne(id);
    await this.usuarioRepository.remove(usuario);
  }
}
