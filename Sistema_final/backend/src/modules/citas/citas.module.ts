/**
 * MÓDULO DE CITAS — Sprint 2
 *
 * Registra las 3 capas (Controller, Service, Repository).
 * El Service implementa la validación de disponibilidad horaria.
 */
import { Module } from '@nestjs/common';
import { CitasController } from './controller/citas.controller';
import { CitasService } from './service/citas.service';
import { CitasRepository } from './repository/citas.repository';

@Module({
  controllers: [CitasController],
  providers: [CitasService, CitasRepository],
})
export class CitasModule {}
