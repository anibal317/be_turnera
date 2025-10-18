import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '@/entities/usuario.entity';

export interface JwtPayload {
  sub: number;
  email: string;
  rol: string;
  idReferencia?: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET', 'secret-key-change-in-production'),
    });
  }

  async validate(payload: JwtPayload) {
    const usuario = await this.usuarioRepository.findOne({
      where: { idUsuario: payload.sub, activo: true },
    });

    if (!usuario) {
      throw new UnauthorizedException('Usuario no válido o inactivo');
    }

    return {
      idUsuario: payload.sub,
      email: payload.email,
      rol: payload.rol,
      idReferencia: payload.idReferencia,
    };
  }
}
