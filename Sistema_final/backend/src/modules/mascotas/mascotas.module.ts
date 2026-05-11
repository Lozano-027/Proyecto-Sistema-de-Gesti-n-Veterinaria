/**
 * MÓDULO DE MASCOTAS — Sprint 2
 *
 * Registra las 3 capas (Controller, Service, Repository).
 * Las mascotas tienen FK a Propietario (un propietario puede tener N mascotas).
 */
import { Module } from '@nestjs/common';
import { MascotasController } from './controller/mascotas.controller';
import { MascotasService } from './service/mascotas.service';
import { MascotasRepository } from './repository/mascotas.repository';

@Module({
  controllers: [MascotasController],
  providers: [MascotasService, MascotasRepository],
})
export class MascotasModule {}
