import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api';
import type { Mascota } from '@/interfaces/mascota.interface';

type MascotaWritable = Omit<
  Mascota,
  'id' | 'createdAt' | 'updatedAt' | 'propietario'
>;

export const mascotasService = {
  findAll: () => apiGet<Mascota[]>('/mascotas'),
  findOne: (id: number) => apiGet<Mascota>(`/mascotas/${id}`),
  findByPropietario: (propietarioId: number) =>
    apiGet<Mascota[]>(`/mascotas/propietario/${propietarioId}`),
  create: (data: MascotaWritable) => apiPost<Mascota>('/mascotas', data),
  update: (id: number, data: Partial<MascotaWritable>) =>
    apiPut<Mascota>(`/mascotas/${id}`, data),
  remove: (id: number) => apiDelete<Mascota>(`/mascotas/${id}`),
};
