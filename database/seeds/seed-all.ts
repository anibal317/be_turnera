// src/database/seeds/seed-all.ts
import { DataSource } from "typeorm";
import { EspecialidadSeeder } from "./especialidad.seeder";
import { ConsultorioSeeder } from "./consultorio.seeder";

export class SeedAll {
  public static async run(dataSource: DataSource): Promise<void> {
    console.log("🌱 Iniciando seeders...");

    try {
      await ConsultorioSeeder.run(dataSource); // 👈 Primero
      await EspecialidadSeeder.run(dataSource);

      console.log("✅ Todos los seeders ejecutados correctamente.");
    } catch (error) {
      console.error("❌ Error al ejecutar los seeders:", error);
      throw error;
    }
  }
}
