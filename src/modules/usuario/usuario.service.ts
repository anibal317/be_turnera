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


  async findAll(isAdmin = false): Promise<Usuario[]> {
    if (isAdmin) {
      return this.usuarioRepository.find();
    }
    return this.usuarioRepository.find({ where: { activo: true } });
  }

  async findAllInactivos(): Promise<Usuario[]> {
    return this.usuarioRepository.find({ where: { activo: false } });
  }

  async findOne(id: number, isAdmin = false): Promise<Usuario> {
    const where: any = { idUsuario: id };
    if (!isAdmin) where.activo = true;
    const usuario = await this.usuarioRepository.findOne({ where });
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
    usuario.activo = false;
    await this.usuarioRepository.save(usuario);
  }

  async restore(id: number): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({ where: { idUsuario: id, activo: false } });
    if (!usuario) throw new NotFoundException('Usuario inactivo no encontrado');
    usuario.activo = true;
    return this.usuarioRepository.save(usuario);
  }
}
