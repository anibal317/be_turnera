import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
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

  async register(registerDto: RegisterDto): Promise<{ access_token: string; user: Partial<Usuario> }> {
    // Verificar si el usuario ya existe
    const existingUser = await this.usuarioRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException('El email ya está en uso');
    }

    // Validar que si es medico tenga idDoctor, si es paciente tenga dniPaciente
    if (registerDto.rol === 'medico' && !registerDto.idDoctor) {
      throw new BadRequestException('Un médico debe tener un idDoctor asociado');
    }

    if (registerDto.rol === 'paciente' && !registerDto.dniPaciente) {
      throw new BadRequestException('Un paciente debe tener un DNI asociado');
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

    // Generar token
    const payload = {
      sub: usuario.idUsuario,
      email: usuario.email,
      rol: usuario.rol,
      idDoctor: usuario.idDoctor,
      dniPaciente: usuario.dniPaciente,
    };
    const access_token = await this.jwtService.signAsync(payload);

    // Remover password de la respuesta
    const { password, ...userWithoutPassword } = usuario;

    return {
      access_token,
      user: userWithoutPassword,
    };
  }

  async login(loginDto: LoginDto): Promise<{ access_token: string; user: Partial<Usuario> }> {
    // Buscar usuario (incluir password para validación)
    const usuario = await this.usuarioRepository.findOne({
      where: { email: loginDto.email },
      select: ['idUsuario', 'email', 'password', 'rol', 'activo', 'idDoctor', 'dniPaciente'],
    });

    if (!usuario) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(loginDto.password, usuario.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Verificar si el usuario está activo
    if (!usuario.activo) {
      throw new UnauthorizedException('Usuario inactivo');
    }

    // Generar token
    const payload = {
      sub: usuario.idUsuario,
      email: usuario.email,
      rol: usuario.rol,
      idDoctor: usuario.idDoctor,
      dniPaciente: usuario.dniPaciente,
    };
    const access_token = await this.jwtService.signAsync(payload);

    // Remover password de la respuesta
    const { password, ...userWithoutPassword } = usuario;

    return {
      access_token,
      user: userWithoutPassword,
    };
  }

  async validateUser(userId: number): Promise<Usuario | null> {
    return await this.usuarioRepository.findOne({
      where: { idUsuario: userId, activo: true },
    });
  }

  async findOne(id: number): Promise<Usuario> {
    return await this.usuarioRepository.findOne({
      where: { idUsuario: id },
      relations: ['doctor', 'paciente'],
    });
  }
}
