/**
 * SERVICIO DE REPORTES — Sprint 4 + Sprint 5
 *
 * historialCompletoMascota() lanza 404 si la mascota no existe;
 * los demás métodos delegan al repository.
 */
import { Injectable, NotFoundException } from '@nestjs/common';
import { ReportesRepository } from '../repository/reportes.repository';
import { FiltroReporteCitasDto } from '../dto/filtro-reporte-citas.dto';

@Injectable()
export class ReportesService {
  constructor(private readonly reportesRepository: ReportesRepository) {}

  getResumen() {
    return this.reportesRepository.getResumen();
  }

  proximasCitas(limit = 5) {
    return this.reportesRepository.proximasCitas(limit);
  }

  reporteCitas(filtros: FiltroReporteCitasDto) {
    return this.reportesRepository.reporteCitas(filtros);
  }

  async historialCompletoMascota(mascotaId: number) {
    const mascota =
      await this.reportesRepository.historialCompletoMascota(mascotaId);
    if (!mascota) {
      throw new NotFoundException(`Mascota con ID ${mascotaId} no encontrada`);
    }
    return mascota;
  }
}
