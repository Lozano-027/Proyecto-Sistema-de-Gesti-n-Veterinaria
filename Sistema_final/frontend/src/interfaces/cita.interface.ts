import type { Mascota } from './mascota.interface';
import type { Usuario } from './usuario.interface';

export interface Cita {
  id: number;
  mascotaId: number;
  usuarioId: number;
  fecha: string;
  hora: string;
  motivo: string;
  estado: 'programada' | 'completada' | 'cancelada' | string;
  /** Solo vienen cuando el backend hace include. */
  mascota?: Mascota;
  usuario?: Usuario;
  createdAt: string;
  updatedAt: string;
}
