// src/database/seeds/seed-all.ts
import { DataSource } from 'typeorm';
import { EspecialidadSeeder } from './especialidad.seeder';
import { ConsultorioSeeder } from './consultorio.seeder';
import 'dotenv/config';

export class SeedAll {
  public static async run(dataSource: DataSource): Promise<void> {
    console.log('🌱 Iniciando seeders...');

    try {
      await ConsultorioSeeder.run(dataSource);
      await EspecialidadSeeder.run(dataSource);

      console.log('✅ Todos los seeders ejecutados correctamente.');
    } catch (error) {
      console.error('❌ Error al ejecutar los seeders:', error);
      throw error;
    }
  }
}

// 👇 Bloque de ejecución autocontenida
if (require.main === module) {
  (async () => {
    const dataSource = new DataSource({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || 'turnera',
      entities: ['src/entities/*.entity{.ts,.js}'],
      synchronize: false,
      logging: false,
    });

    try {
      // 🔑 ¡Espera la conexión!
      await dataSource.initialize();
      console.log('✅ Conectado a la base de datos');

      // Ejecuta los seeders
      await SeedAll.run(dataSource);
    } catch (error) {
      console.error('💥 Error de conexión o en seeders:', error);
      process.exit(1);
    } finally {
      // Solo destruye si está inicializada
      if (dataSource.isInitialized) {
        await dataSource.destroy();
        console.log('🔌 Conexión cerrada');
      }
    }
  })();
}