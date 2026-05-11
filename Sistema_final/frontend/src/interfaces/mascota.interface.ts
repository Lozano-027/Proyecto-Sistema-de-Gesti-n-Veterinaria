import type { Propietario } from './propietario.interface';

export interface Mascota {
  id: number;
  nombre: string;
  especie: string;
  raza: string;
  fechaNacimiento: string;
  propietarioId: number;
  /** Solo viene cuando el backend hace include en la consulta. */
  propietario?: Propietario;
  createdAt: string;
  updatedAt: string;
}
