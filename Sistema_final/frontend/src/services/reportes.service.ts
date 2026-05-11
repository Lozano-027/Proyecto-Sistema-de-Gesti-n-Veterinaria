import { apiGet } from '@/lib/api';
import type { ResumenDashboard } from '@/interfaces/resumen.interface';
import type { Cita } from '@/interfaces/cita.interface';
import type { Mascota } from '@/interfaces/mascota.interface';
import type { HistorialClinico } from '@/interfaces/historial.interface';

/** Filtros para el endpoint /reportes/citas. Todos opcionales. */
export interface FiltrosCitas {
  fechaInicio?: string;
  fechaFin?: string;
  usuarioId?: number;
  estado?: 'programada' | 'completada' | 'cancelada';
}

/**
 * Estructura que retorna /reportes/historial-completo/:mascId
 * (Mascota con historiales, citas y todos sus tratamientos).
 */
export interface HistorialCompleto extends Mascota {
  historiales: Array<HistorialClinico & { tratamientos: any[] }>;
  citas: Array<Cita & { tratamientos: any[] }>;
}

export const reportesService = {
  // Sprint 4
  getResumen: () => apiGet<ResumenDashboard>('/reportes/resumen'),
  proximasCitas: (limit = 5) =>
    apiGet<Cita[]>(`/reportes/proximas-citas?limit=${limit}`),

  // Sprint 5
  reporteCitas: (filtros: FiltrosCitas = {}) => {
    const params = new URLSearchParams();
    if (filtros.fechaInicio) params.set('fechaInicio', filtros.fechaInicio);
    if (filtros.fechaFin) params.set('fechaFin', filtros.fechaFin);
    if (filtros.usuarioId) params.set('usuarioId', String(filtros.usuarioId));
    if (filtros.estado) params.set('estado', filtros.estado);
    const qs = params.toString();
    return apiGet<Cita[]>(`/reportes/citas${qs ? `?${qs}` : ''}`);
  },

  historialCompleto: (mascotaId: number) =>
    apiGet<HistorialCompleto>(`/reportes/historial-completo/${mascotaId}`),
};
