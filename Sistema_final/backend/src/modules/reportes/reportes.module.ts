/**
 * MÓDULO DE REPORTES — Sprint 4 (base) + Sprint 5 (extensión)
 *
 * Sprint 4: dashboard resumen + próximas citas.
 * Sprint 5: agregará reporte de citas con filtros e historial completo.
 */
import { Module } from '@nestjs/common';
import { ReportesController } from './controller/reportes.controller';
import { ReportesService } from './service/reportes.service';
import { ReportesRepository } from './repository/reportes.repository';

@Module({
  controllers: [ReportesController],
  providers: [ReportesService, ReportesRepository],
})
export class ReportesModule {}
