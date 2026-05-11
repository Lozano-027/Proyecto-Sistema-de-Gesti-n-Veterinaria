export interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  rol: 'veterinario' | 'admin' | string;
  createdAt: string;
  updatedAt: string;
}
