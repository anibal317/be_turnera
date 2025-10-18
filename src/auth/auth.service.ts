import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario, UserRole } from '@/entities/usuario.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    // Verificar si el email ya existe
    const existingUser = await this.usuarioRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException('El email ya está registrado');
    }

    // Validar que si es médico tenga idDoctor
    if (registerDto.rol === UserRole.MEDICO && !registerDto.idDoctor) {
      throw new BadRequestException('Un médico debe tener asociado un ID de doctor');
    }

    // Validar que si es paciente tenga dniPaciente
    if (registerDto.rol === UserRole.PACIENTE && !registerDto.dniPaciente) {
      throw new BadRequestException('Un paciente debe tener asociado un DNI');
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Crear el usuario
    const usuario = this.usuarioRepository.create({
      email: registerDto.email,
      password: hashedPassword,
      rol: registerDto.rol,
      idDoctor: registerDto.idDoctor,
      dniPaciente: registerDto.dniPaciente,
    });

    await this.usuarioRepository.save(usuario);

    // Retornar sin la contraseña
    const { password, ...result } = usuario;
    return result;
  }

  async login(loginDto: LoginDto) {
    // Buscar usuario con contraseña
    const usuario = await this.usuarioRepository
      .createQueryBuilder('usuario')
      .addSelect('usuario.password')
      .where('usuario.email = :email', { email: loginDto.email })
      .getOne();

    if (!usuario) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    if (!usuario.activo) {
      throw new UnauthorizedException('Usuario inactivo');
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(loginDto.password, usuario.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Generar token JWT
    const payload = {
      sub: usuario.idUsuario,
      email: usuario.email,
      rol: usuario.rol,
      idDoctor: usuario.idDoctor,
      dniPaciente: usuario.dniPaciente,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        idUsuario: usuario.idUsuario,
        email: usuario.email,
        rol: usuario.rol,
        idDoctor: usuario.idDoctor,
        dniPaciente: usuario.dniPaciente,
      },
    };
  }

  async validateUser(email: string, password: string): Promise<any> {
    const usuario = await this.usuarioRepository
      .createQueryBuilder('usuario')
      .addSelect('usuario.password')
      .where('usuario.email = :email', { email })
      .getOne();

    if (usuario && (await bcrypt.compare(password, usuario.password))) {
      const { password, ...result } = usuario;
      return result;
    }
    return null;
  }

  async getProfile(idUsuario: number) {
    const usuario = await this.usuarioRepository.findOne({
      where: { idUsuario },
      relations: ['doctor', 'paciente'],
    });

    if (!usuario) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    const { password, ...result } = usuario;
    return result;
  }
}
