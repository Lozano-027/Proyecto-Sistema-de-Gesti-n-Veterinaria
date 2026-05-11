/**
 * ============================================================
 * MÓDULO RAÍZ DE LA APLICACIÓN (AppModule)
 * ============================================================
 *
 * Este es el módulo principal que registra TODOS los módulos del sistema.
 * NestJS lo usa como punto de partida para construir el árbol de dependencias.
 *
 * ARQUITECTURA MODULAR:
 *   AppModule
 *   ├── PrismaModule              → Conexión a la base de datos (Global)
 *   ├── UsuariosModule            → CRUD de usuarios (personal veterinario)
 *   ├── PropietariosModule        → CRUD de propietarios (clientes)
 *   ├── MascotasModule            → CRUD de mascotas
 *   ├── CitasModule               → CRUD de citas + validación de disponibilidad
 *   ├── HistorialClinicoModule    → CRUD de historial clínico (unicidad mascota+fecha)
 *   ├── TratamientosModule        → CRUD de tratamientos (asociados a citas e historial)
 *   └── ReportesModule            → Reportes de citas (Sprint 5)
 *
 * NOTA: PrismaModule es @Global(), por lo que PrismaService está disponible
 * en TODOS los módulos sin necesidad de importarlo explícitamente.
 *
 * NOTA IMPORTANTE: Este proyecto NO incluye el módulo Auth (autenticación JWT).
 *   Se omitió intencionalmente para mantener el proyecto sencillo.
 */
import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UsuariosModule } from './modules/usuarios/usuarios.module';
import { PropietariosModule } from './modules/propietarios/propietarios.module';
import { MascotasModule } from './modules/mascotas/mascotas.module';
import { CitasModule } from './modules/citas/citas.module';
import { HistorialClinicoModule } from './modules/historial-clinico/historial-clinico.module';
import { TratamientosModule } from './modules/tratamientos/tratamientos.module';
import { ReportesModule } from './modules/reportes/reportes.module';

@Module({
  imports: [
    PrismaModule,
    UsuariosModule,
    PropietariosModule,
    MascotasModule,
    CitasModule,
    HistorialClinicoModule,
    TratamientosModule,
    ReportesModule,
  ],
})
export class AppModule {}
