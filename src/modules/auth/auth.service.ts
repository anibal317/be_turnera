import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { AppLogger } from '../../common/app-logger.service';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario, UserRole } from './entities/usuario.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    private readonly jwtService: JwtService,
    private readonly logger: AppLogger,
  ) {}

  async register(registerDto: RegisterDto) {
    // Verificar si el email ya existe
    const existing = await this.usuarioRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existing) {
      this.logger.error(`Intento de registro con email ya existente: ${registerDto.email}`);
      throw new ConflictException('El email ya está registrado');
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Crear usuario (por defecto será PACIENTE si no se especifica rol)
    const usuario = this.usuarioRepository.create({
      email: registerDto.email,
      password: hashedPassword,
      nombre: registerDto.nombre || 'Usuario',
      rol: registerDto.rol || UserRole.PACIENTE,
      idReferencia: registerDto.idReferencia || null,
    });

    await this.usuarioRepository.save(usuario);

    // Generar token con rol
    const token = this.jwtService.sign({
      sub: usuario.idUsuario,
      email: usuario.email,
      rol: usuario.rol,
      idReferencia: usuario.idReferencia,
    });

    return {
      access_token: token,
      user: {
        id: usuario.idUsuario,
        email: usuario.email,
        nombre: usuario.nombre,
        rol: usuario.rol,
        idReferencia: usuario.idReferencia,
      },
    };
  }

  async login(loginDto: LoginDto) {
    // Buscar usuario
    const usuario = await this.usuarioRepository.findOne({
      where: { email: loginDto.email },
      select: ['idUsuario', 'email', 'password', 'nombre', 'rol', 'idReferencia', 'activo'],
    });

    if (!usuario) {
      this.logger.error(`Login fallido: usuario no encontrado (${loginDto.email})`);
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Verificar contraseña
    const isValid = await bcrypt.compare(loginDto.password, usuario.password);
    if (!isValid) {
      this.logger.error(`Login fallido: contraseña incorrecta para ${loginDto.email}`);
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Verificar si está activo
    if (!usuario.activo) {
      this.logger.error(`Login fallido: usuario inactivo (${loginDto.email})`);
      throw new UnauthorizedException('Usuario inactivo');
    }

    // Generar token con rol
    const token = this.jwtService.sign({
      sub: usuario.idUsuario,
      email: usuario.email,
      rol: usuario.rol,
      idReferencia: usuario.idReferencia,
    });

    return {
      access_token: token,
      user: {
        id: usuario.idUsuario,
        email: usuario.email,
        nombre: usuario.nombre,
        rol: usuario.rol,
        idReferencia: usuario.idReferencia,
      },
    };
  }

  async validateUser(userId: number) {
    return await this.usuarioRepository.findOne({
      where: { idUsuario: userId, activo: true },
    });
  }
}
