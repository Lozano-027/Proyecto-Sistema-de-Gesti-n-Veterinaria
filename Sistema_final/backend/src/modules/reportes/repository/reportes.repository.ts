/**
 * ============================================================
 * REPOSITORIO DE REPORTES — Sprint 4 + Sprint 5
 * ============================================================
 *
 * MÉTODOS:
 *   - getResumen()                  → Conteos para el dashboard (Sprint 4)
 *   - proximasCitas()               → Próximas N citas (Sprint 4)
 *   - reporteCitas(filtros)         → Citas filtradas (Sprint 5)
 *   - historialCompletoMascota(id)  → Mascota + historial + tratamientos (Sprint 5)
 *
 * CONSTRUCCIÓN DEL WHERE EN reporteCitas():
 *   Se construye un objeto `where` dinámico añadiendo solo las claves
 *   que el frontend envió. Si fechaInicio y fechaFin vienen, se combinan
 *   en un único filtro de rango: { fecha: { gte, lte } }.
 *
 * historialCompletoMascota():
 *   Una sola query con `include` anidado retorna todo lo necesario:
 *   - datos de la mascota
 *   - propietario
 *   - historiales (ordenados por fecha desc)
 *   - tratamientos de cada historial
 *   - citas (ordenadas por fecha desc)
 *   - tratamientos de cada cita
 *   - veterinario que atendió cada cita
 *
 *   Esto evita el problema de N+1 queries: una sola petición SQL
 *   trae todo gracias al planner de Prisma.
 */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { FiltroReporteCitasDto } from '../dto/filtro-reporte-citas.dto';

@Injectable()
export class ReportesRepository {
  constructor(private readonly prisma: PrismaService) {}

  // ── SPRINT 4 ────────────────────────────────────────────

  async getResumen() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalPropietarios,
      totalMascotas,
      totalCitas,
      citasHoy,
      citasProgramadas,
      totalHistoriales,
    ] = await this.prisma.$transaction([
      this.prisma.propietario.count(),
      this.prisma.mascota.count(),
      this.prisma.cita.count(),
      this.prisma.cita.count({ where: { fecha: today } }),
      this.prisma.cita.count({ where: { estado: 'programada' } }),
      this.prisma.historialClinico.count(),
    ]);

    return {
      totalPropietarios,
      totalMascotas,
      totalCitas,
      citasHoy,
      citasProgramadas,
      totalHistoriales,
    };
  }

  proximasCitas(limit = 5) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return this.prisma.cita.findMany({
      where: {
        fecha: { gte: today },
        estado: { not: 'cancelada' },
      },
      include: {
        mascota: { include: { propietario: true } },
        usuario: true,
      },
      orderBy: [{ fecha: 'asc' }, { hora: 'asc' }],
      take: limit,
    });
  }

  // ── SPRINT 5 ────────────────────────────────────────────

  /**
   * Reporte de citas con filtros opcionales.
   * Cualquier filtro ausente significa "no filtrar por ese campo".
   */
  reporteCitas(filtros: FiltroReporteCitasDto) {
    const where: Record<string, unknown> = {};

    // Rango de fechas: combina fechaInicio y fechaFin si vienen
    if (filtros.fechaInicio || filtros.fechaFin) {
      const fechaWhere: { gte?: Date; lte?: Date } = {};
      if (filtros.fechaInicio) {
        fechaWhere.gte = new Date(filtros.fechaInicio);
      }
      if (filtros.fechaFin) {
        // fechaFin INCLUSIVA: hasta las 23:59:59 del día indicado
        const fin = new Date(filtros.fechaFin);
        fin.setHours(23, 59, 59, 999);
        fechaWhere.lte = fin;
      }
      where.fecha = fechaWhere;
    }

    if (filtros.usuarioId) where.usuarioId = filtros.usuarioId;
    if (filtros.estado) where.estado = filtros.estado;

    return this.prisma.cita.findMany({
      where,
      include: {
        mascota: { include: { propietario: true } },
        usuario: true,
        tratamientos: true,
      },
      orderBy: [{ fecha: 'asc' }, { hora: 'asc' }],
    });
  }

  /**
   * Historial clínico completo de una mascota:
   *   - datos de la mascota + propietario
   *   - todos sus historiales (con tratamientos incluidos)
   *   - todas sus citas (con tratamientos y veterinario incluidos)
   */
  historialCompletoMascota(mascotaId: number) {
    return this.prisma.mascota.findUnique({
      where: { id: mascotaId },
      include: {
        propietario: true,
        historiales: {
          orderBy: { fecha: 'desc' },
          include: { tratamientos: true },
        },
        citas: {
          orderBy: [{ fecha: 'desc' }, { hora: 'desc' }],
          include: {
            usuario: true,
            tratamientos: true,
          },
        },
      },
    });
  }
}
