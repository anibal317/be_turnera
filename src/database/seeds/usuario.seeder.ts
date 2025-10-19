import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario, UserRole } from '../../modules/auth/entities/usuario.entity';

export class UsuarioSeeder {
  public static async run(dataSource: DataSource): Promise<void> {
    const usuarioRepo = dataSource.getRepository(Usuario);

    // Contraseña por defecto para todos los usuarios de prueba
    const defaultPassword = await bcrypt.hash('123456', 10);

    const usuariosData = [
      {
        email: 'admin@turnera.com',
        password: defaultPassword,
        nombre: 'Admin Sistema',
        rol: UserRole.ADMIN,
        idReferencia: null,
        activo: true,
      },
      {
        email: 'doctor@turnera.com',
        password: defaultPassword,
        nombre: 'Dr. Juan Pérez',
        rol: UserRole.DOCTOR,
        idReferencia: '1', // ID del doctor en la tabla doctor
        activo: true,
      },
      {
        email: 'secretaria@turnera.com',
        password: defaultPassword,
        nombre: 'María González',
        rol: UserRole.SECRETARIA,
        idReferencia: null,
        activo: true,
      },
      {
        email: 'paciente@turnera.com',
        password: defaultPassword,
        nombre: 'Carlos López',
        rol: UserRole.PACIENTE,
        idReferencia: '12345678', // DNI del paciente
        activo: true,
      },
    ];

    // Evita duplicados
    const existing = await usuarioRepo
      .createQueryBuilder()
      .where('email IN (:...emails)', {
        emails: usuariosData.map(u => u.email),
      })
      .getMany();

    const existingEmails = new Set(existing.map(u => u.email));
    const nuevosUsuarios = usuariosData.filter(
      u => !existingEmails.has(u.email)
    );

    if (nuevosUsuarios.length > 0) {
      await usuarioRepo.save(nuevosUsuarios);
      console.log(`✅ ${nuevosUsuarios.length} usuarios creados.`);
      console.log('📋 Usuarios de prueba:');
      usuariosData.forEach(u => {
        console.log(`   - ${u.email} (${u.rol}) - Password: 123456`);
      });
    } else {
      console.log('ℹ️  Los usuarios ya existen. No se crearon duplicados.');
    }
  }
}
