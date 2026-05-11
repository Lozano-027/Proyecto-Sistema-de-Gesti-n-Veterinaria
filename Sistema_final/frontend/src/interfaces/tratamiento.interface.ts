import type { Cita } from './cita.interface';
import type { HistorialClinico } from './historial.interface';

export interface Tratamiento {
  id: number;
  historialClinicoId: number | null;
  citaId: number | null;
  medicamento: string;
  dosis: string;
  duracion: string;
  indicaciones: string | null;
  /** Solo viene cuando el backend hace include. */
  cita?: Cita | null;
  historialClinico?: HistorialClinico | null;
  createdAt: string;
  updatedAt: string;
}
