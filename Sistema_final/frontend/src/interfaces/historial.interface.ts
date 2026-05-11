import type { Mascota } from './mascota.interface';

export interface HistorialClinico {
  id: number;
  mascotaId: number;
  fecha: string;
  diagnostico: string;
  observaciones: string | null;
  /** Solo viene cuando el backend hace include. */
  mascota?: Mascota;
  /** Conteo de tratamientos asociados (Sprint 4). */
  _count?: { tratamientos: number };
  createdAt: string;
  updatedAt: string;
}

/** Estructura que retorna el endpoint paginado /historial-clinico/mascota/:id */
export interface HistorialPaginado {
  items: HistorialClinico[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
