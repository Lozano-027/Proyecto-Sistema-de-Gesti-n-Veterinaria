/**
 * ============================================================
 * CONTROLADOR DE REPORTES — Sprint 4 + Sprint 5
 * ============================================================
 *
 * ENDPOINTS:
 *   GET /api/v1/reportes/resumen                       → Sprint 4
 *   GET /api/v1/reportes/proximas-citas?limit=N        → Sprint 4
 *   GET /api/v1/reportes/citas?fechaInicio=...&...     → Sprint 5
 *   GET /api/v1/reportes/historial-completo/:mascId    → Sprint 5
 */
import { Controller, Get, Param, Query, ParseIntPipe } from '@nestjs/common';
import { ReportesService } from '../service/reportes.service';
import { FiltroReporteCitasDto } from '../dto/filtro-reporte-citas.dto';

@Controller('reportes')
export class ReportesController {
  constructor(private readonly reportesService: ReportesService) {}

  @Get('resumen')
  getResumen() {
    return this.reportesService.getResumen();
  }

  @Get('proximas-citas')
  proximasCitas(@Query('limit') limit?: string) {
    const parsed = limit ? Number(limit) : 5;
    return this.reportesService.proximasCitas(
      Number.isFinite(parsed) && parsed > 0 ? parsed : 5,
    );
  }

  @Get('citas')
  reporteCitas(@Query() filtros: FiltroReporteCitasDto) {
    return this.reportesService.reporteCitas(filtros);
  }

  @Get('historial-completo/:mascId')
  historialCompleto(@Param('mascId', ParseIntPipe) mascId: number) {
    return this.reportesService.historialCompletoMascota(mascId);
  }
}
