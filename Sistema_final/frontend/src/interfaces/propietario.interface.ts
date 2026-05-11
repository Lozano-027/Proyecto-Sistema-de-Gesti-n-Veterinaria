export interface Propietario {
  id: number;
  nombres: string;
  apellidos: string;
  telefono: string;
  correo: string;
  direccion: string;
  /** Solo viene si el backend incluye _count en la consulta. */
  _count?: { mascotas: number };
  createdAt: string;
  updatedAt: string;
}
