// ─── Auth ─────────────────────────────────────────────────────────────────────
export interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  rol: 'ADMIN' | 'VETERINARIO';
}

export interface AuthResponse {
  token: string;
  usuario: Usuario;
}

// ─── Propietario ──────────────────────────────────────────────────────────────
export interface Propietario {
  id: number;
  nombres: string;
  apellidos: string;
  telefono: string;
  correo: string;
  direccion?: string;
  activo: boolean;
  creadoEn: string;
  mascotas?: Mascota[];
}

export interface CreatePropietarioDto {
  nombres: string;
  apellidos: string;
  telefono: string;
  correo: string;
  direccion?: string;
}

// ─── Mascota ──────────────────────────────────────────────────────────────────
export interface Mascota {
  id: number;
  nombre: string;
  especie: string;
  raza?: string;
  fechaNacimiento?: string;
  activo: boolean;
  propietarioId: number;
  propietario?: Propietario;
  creadoEn: string;
}

export interface CreateMascotaDto {
  nombre: string;
  especie: string;
  raza?: string;
  fechaNacimiento?: string;
  propietarioId: number;
}

// ─── Cita ─────────────────────────────────────────────────────────────────────
export type EstadoCita = 'PENDIENTE' | 'CONFIRMADA' | 'EN_CURSO' | 'COMPLETADA' | 'CANCELADA';

export interface Cita {
  id: number;
  fecha: string;
  hora: string;
  motivo: string;
  estado: EstadoCita;
  notas?: string;
  mascotaId: number;
  mascota?: Mascota;
  usuarioId: number;
  usuario?: Usuario;
  creadoEn: string;
}

export interface CreateCitaDto {
  fecha: string;
  hora: string;
  motivo: string;
  estado?: EstadoCita;
  notas?: string;
  mascotaId: number;
  usuarioId: number;
}

// ─── Historial ────────────────────────────────────────────────────────────────
export interface HistorialClinico {
  id: number;
  fecha: string;
  diagnostico: string;
  observaciones?: string;
  mascotaId: number;
  mascota?: Mascota;
  tratamientos?: Tratamiento[];
  creadoEn: string;
}

export interface CreateHistorialDto {
  fecha: string;
  diagnostico: string;
  observaciones?: string;
  mascotaId: number;
}

// ─── Tratamiento ──────────────────────────────────────────────────────────────
export interface Tratamiento {
  id: number;
  medicamento: string;
  dosis: string;
  duracion: string;
  indicaciones?: string;
  historialClinicoId?: number;
  citaId?: number;
}

// ─── API Response ─────────────────────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
}
