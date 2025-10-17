import { Especialidad } from './../../src/entities/especialidad.entity';
// src/database/seeds/especialidad.seeder.ts
import { DataSource } from 'typeorm';

export class EspecialidadSeeder {
  public static async run(dataSource: DataSource): Promise<void> {
    const especialidadRepo = dataSource.getRepository(Especialidad);

    const especialidadesData = [
      { nombreEspecialidad: 'Cardiología' },
      { nombreEspecialidad: 'Dermatología' },
      { nombreEspecialidad: 'Pediatría' },
      { nombreEspecialidad: 'Neurología' },
      { nombreEspecialidad: 'Oftalmología' },
    ];

    // Evita duplicados (opcional)
    const existing = await especialidadRepo
      .createQueryBuilder()
      .where('nombre_especialidad IN (:...nombres)', {
        nombres: especialidadesData.map(e => e.nombreEspecialidad),
      })
      .getMany();

    const existingNombres = new Set(existing.map(e => e.nombreEspecialidad));
    const nuevasEspecialidades = especialidadesData.filter(
      e => !existingNombres.has(e.nombreEspecialidad)
    );

    if (nuevasEspecialidades.length > 0) {
      await especialidadRepo.save(nuevasEspecialidades);
      console.log(`✅ ${nuevasEspecialidades.length} especialidades creadas.`);
    } else {
      console.log('ℹ️  Las especialidades ya existen. No se crearon duplicados.');
    }
  }
}