/**
 * MÓDULO DE HISTORIAL CLÍNICO — Sprint 3
 *
 * Registra las 3 capas (Controller, Service, Repository).
 * Implementa la unicidad mascotaId+fecha y consulta paginada por mascota.
 */
import { Module } from '@nestjs/common';
import { HistorialClinicoController } from './controller/historial-clinico.controller';
import { HistorialClinicoService } from './service/historial-clinico.service';
import { HistorialClinicoRepository } from './repository/historial-clinico.repository';

@Module({
  controllers: [HistorialClinicoController],
  providers: [HistorialClinicoService, HistorialClinicoRepository],
})
export class HistorialClinicoModule {}
