import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario } from '@/entities/usuario.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    // Verificar si el email ya existe
    const existing = await this.usuarioRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existing) {
      throw new ConflictException('El email ya está registrado');
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Crear usuario
    const usuario = this.usuarioRepository.create({
      email: registerDto.email,
      password: hashedPassword,
      nombre: registerDto.nombre || 'Usuario',
    });

    await this.usuarioRepository.save(usuario);

    // Generar token
    const token = this.jwtService.sign({
      sub: usuario.idUsuario,
      email: usuario.email,
    });

    return {
      access_token: token,
      user: {
        id: usuario.idUsuario,
        email: usuario.email,
        nombre: usuario.nombre,
      },
    };
  }

  async login(loginDto: LoginDto) {
    // Buscar usuario
    const usuario = await this.usuarioRepository.findOne({
      where: { email: loginDto.email },
      select: ['idUsuario', 'email', 'password', 'nombre', 'activo'],
    });

    if (!usuario) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Verificar contraseña
    const isValid = await bcrypt.compare(loginDto.password, usuario.password);
    if (!isValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Verificar si está activo
    if (!usuario.activo) {
      throw new UnauthorizedException('Usuario inactivo');
    }

    // Generar token
    const token = this.jwtService.sign({
      sub: usuario.idUsuario,
      email: usuario.email,
    });

    return {
      access_token: token,
      user: {
        id: usuario.idUsuario,
        email: usuario.email,
        nombre: usuario.nombre,
      },
    };
  }

  async validateUser(userId: number) {
    return await this.usuarioRepository.findOne({
      where: { idUsuario: userId, activo: true },
    });
  }
}
