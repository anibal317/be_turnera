// src/database/seeds/consultorio.seeder.ts
import { DataSource } from 'typeorm';
import { Consultorio } from '../../modules/consultorio/entities/consultorio.entity';

export class ConsultorioSeeder {
  public static async run(dataSource: DataSource): Promise<void> {
    const consultorioRepo = dataSource.getRepository(Consultorio);

    const consultoriosData = [
      { nombre: 'Consultorio A', activo: true },
      { nombre: 'Consultorio B', activo: true },
      { nombre: 'Consultorio C', activo: false },
      { nombre: 'Consultorio Central', activo: true },
      { nombre: 'Consultorio Norte', activo: true },
    ];

    // Evitar duplicados por nombre
    const existing = await consultorioRepo
      .createQueryBuilder()
      .where('nombre IN (:...nombres)', {
        nombres: consultoriosData.map(c => c.nombre),
      })
      .getMany();

    const existingNombres = new Set(existing.map(c => c.nombre));
    const nuevosConsultorios = consultoriosData.filter(
      c => !existingNombres.has(c.nombre)
    );

    if (nuevosConsultorios.length > 0) {
      await consultorioRepo.save(nuevosConsultorios);
      console.log(`✅ ${nuevosConsultorios.length} consultorios creados.`);
    } else {
      console.log('ℹ️  Todos los consultorios ya existen.');
    }
  }
}