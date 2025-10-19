import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Registro', description: 'Registra un nuevo usuario en el sistema.' })
  @ApiBody({
    type: RegisterDto,
    examples: {
      ejemplo: {
        summary: 'Ejemplo de registro',
        value: {
          email: 'juan.perez@mail.com',
          password: '123456',
          nombre: 'Juan',
          rol: 'PACIENTE',
          idReferencia: '12345678'
        }
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'Usuario registrado correctamente.',
    schema: {
      type: 'object',
      properties: {
        access_token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            email: { type: 'string', example: 'juan.perez@mail.com' },
            nombre: { type: 'string', example: 'Juan' },
            rol: { type: 'string', example: 'PACIENTE' },
            idReferencia: { type: 'string', example: '12345678' },
            paciente: {
              type: 'object',
              properties: {
                dniPaciente: { type: 'string', example: '12345678' },
                nombre: { type: 'string', example: 'Juan' },
                apellido: { type: 'string', example: 'Pérez' },
                obraSocial: {
                  type: 'object',
                  properties: {
                    codigo: { type: 'string', example: 'OS001' },
                    nombre: { type: 'string', example: 'OSDE' }
                  }
                },
                cobertura: {
                  type: 'object',
                  properties: {
                    idCobertura: { type: 'number', example: 1 },
                    nombre: { type: 'string', example: 'Plan 210' }
                  }
                }
              }
            }
          }
        }
      },
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: {
          id: 1,
          email: 'juan.perez@mail.com',
          nombre: 'Juan',
          rol: 'PACIENTE',
          idReferencia: '12345678',
          paciente: {
            dniPaciente: '12345678',
            nombre: 'Juan',
            apellido: 'Pérez',
            obraSocial: {
              codigo: 'OS001',
              nombre: 'OSDE'
            },
            cobertura: {
              idCobertura: 1,
              nombre: 'Plan 210'
            }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos o faltantes.' })
  @ApiResponse({ status: 401, description: 'No autenticado.' })
  @ApiResponse({ status: 403, description: 'No autorizado.' })
  @ApiResponse({ status: 404, description: 'Recurso no encontrado.' })
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login', description: 'Autentica un usuario y devuelve un token JWT.' })
  @ApiBody({
    type: LoginDto,
    examples: {
      ejemplo: {
        summary: 'Ejemplo de login',
        value: {
          email: 'juan.perez@mail.com',
          password: '123456'
        }
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'Usuario autenticado correctamente.',
    schema: {
      type: 'object',
      properties: {
        access_token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            email: { type: 'string', example: 'juan.perez@mail.com' },
            nombre: { type: 'string', example: 'Juan' },
            rol: { type: 'string', example: 'PACIENTE' },
            idReferencia: { type: 'string', example: '12345678' },
            paciente: {
              type: 'object',
              properties: {
                dniPaciente: { type: 'string', example: '12345678' },
                nombre: { type: 'string', example: 'Juan' },
                apellido: { type: 'string', example: 'Pérez' },
                obraSocial: {
                  type: 'object',
                  properties: {
                    codigo: { type: 'string', example: 'OS001' },
                    nombre: { type: 'string', example: 'OSDE' }
                  }
                },
                cobertura: {
                  type: 'object',
                  properties: {
                    idCobertura: { type: 'number', example: 1 },
                    nombre: { type: 'string', example: 'Plan 210' }
                  }
                }
              }
            }
          }
        }
      },
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: {
          id: 1,
          email: 'juan.perez@mail.com',
          nombre: 'Juan',
          rol: 'PACIENTE',
          idReferencia: '12345678',
          paciente: {
            dniPaciente: '12345678',
            nombre: 'Juan',
            apellido: 'Pérez',
            obraSocial: {
              codigo: 'OS001',
              nombre: 'OSDE'
            },
            cobertura: {
              idCobertura: 1,
              nombre: 'Plan 210'
            }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos o faltantes.' })
  @ApiResponse({ status: 401, description: 'No autenticado.' })
  @ApiResponse({ status: 403, description: 'No autorizado.' })
  @ApiResponse({ status: 404, description: 'Recurso no encontrado.' })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener usuario actual', description: 'Devuelve la información del usuario autenticado.' })
  @ApiResponse({
    status: 200,
    description: 'Usuario autenticado.',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        email: { type: 'string', example: 'juan.perez@mail.com' },
        nombre: { type: 'string', example: 'Juan' },
        rol: { type: 'string', example: 'PACIENTE' },
        idReferencia: { type: 'string', example: '12345678' },
        paciente: {
          type: 'object',
          properties: {
            dniPaciente: { type: 'string', example: '12345678' },
            nombre: { type: 'string', example: 'Juan' },
            apellido: { type: 'string', example: 'Pérez' },
            obraSocial: {
              type: 'object',
              properties: {
                codigo: { type: 'string', example: 'OS001' },
                nombre: { type: 'string', example: 'OSDE' }
              }
            },
            cobertura: {
              type: 'object',
              properties: {
                idCobertura: { type: 'number', example: 1 },
                nombre: { type: 'string', example: 'Plan 210' }
              }
            }
          }
        }
      },
      example: {
        id: 1,
        email: 'juan.perez@mail.com',
        nombre: 'Juan',
        rol: 'PACIENTE',
        idReferencia: '12345678',
        paciente: {
          dniPaciente: '12345678',
          nombre: 'Juan',
          apellido: 'Pérez',
          obraSocial: {
            codigo: 'OS001',
            nombre: 'OSDE'
          },
          cobertura: {
            idCobertura: 1,
            nombre: 'Plan 210'
          }
        }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos o faltantes.' })
  @ApiResponse({ status: 401, description: 'No autenticado.' })
  @ApiResponse({ status: 403, description: 'No autorizado.' })
  @ApiResponse({ status: 404, description: 'Recurso no encontrado.' })
  getMe(@CurrentUser() user: any) {
    return user;
  }
}
