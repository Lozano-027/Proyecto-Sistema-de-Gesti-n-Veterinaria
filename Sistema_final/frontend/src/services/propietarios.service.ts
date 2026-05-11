import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api';
import type { Propietario } from '@/interfaces/propietario.interface';

export const propietariosService = {
  findAll: () => apiGet<Propietario[]>('/propietarios'),
  findOne: (id: number) => apiGet<Propietario>(`/propietarios/${id}`),
  create: (data: Omit<Propietario, 'id' | 'createdAt' | 'updatedAt' | '_count'>) =>
    apiPost<Propietario>('/propietarios', data),
  update: (id: number, data: Partial<Omit<Propietario, 'id' | 'createdAt' | 'updatedAt' | '_count'>>) =>
    apiPut<Propietario>(`/propietarios/${id}`, data),
  remove: (id: number) => apiDelete<Propietario>(`/propietarios/${id}`),
};
