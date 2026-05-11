/**
 * ============================================================
 * SERVICIO DE PRISMA (Conexión a Base de Datos)
 * ============================================================
 *
 * ¿QUÉ HACE?
 *   Gestiona la conexión con PostgreSQL usando Prisma ORM.
 *   Actúa como el "puente" entre la aplicación y la base de datos.
 *
 * ¿CÓMO FUNCIONA?
 *   1. Extiende PrismaClient → hereda TODOS los métodos de consulta
 *      (this.prisma.mascota.findMany(), this.prisma.cita.create(), etc.)
 *   2. La URL de conexión se lee del schema.prisma (env("DATABASE_URL"))
 *
 * CICLO DE VIDA:
 *   - onModuleInit()    → Se conecta a la BD cuando arranca el módulo
 *   - onModuleDestroy() → Cierra la conexión cuando se detiene la app
 *
 * ¿POR QUÉ ES @Global()? (definido en PrismaModule)
 *   Porque TODOS los módulos necesitan acceso a la BD. Al ser global,
 *   cualquier Repository puede inyectar PrismaService sin importar
 *   PrismaModule explícitamente.
 *
 * VARIABLE DE ENTORNO:
 *   DATABASE_URL = postgresql://admin:admin123@db:5432/veterinaria_db
 */
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
