import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api';
import type { Usuario } from '@/interfaces/usuario.interface';

export const usuariosService = {
  findAll: () => apiGet<Usuario[]>('/usuarios'),
  findOne: (id: number) => apiGet<Usuario>(`/usuarios/${id}`),
  create: (data: Omit<Usuario, 'id' | 'createdAt' | 'updatedAt'>) =>
    apiPost<Usuario>('/usuarios', data),
  update: (id: number, data: Partial<Omit<Usuario, 'id' | 'createdAt' | 'updatedAt'>>) =>
    apiPut<Usuario>(`/usuarios/${id}`, data),
  remove: (id: number) => apiDelete<Usuario>(`/usuarios/${id}`),
};
