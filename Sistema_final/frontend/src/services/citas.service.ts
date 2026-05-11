import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api';
import type { Cita } from '@/interfaces/cita.interface';

type CitaWritable = Omit<
  Cita,
  'id' | 'createdAt' | 'updatedAt' | 'mascota' | 'usuario'
>;

export const citasService = {
  findAll: () => apiGet<Cita[]>('/citas'),
  findOne: (id: number) => apiGet<Cita>(`/citas/${id}`),
  findByMascota: (mascotaId: number) =>
    apiGet<Cita[]>(`/citas/mascota/${mascotaId}`),
  create: (data: CitaWritable) => apiPost<Cita>('/citas', data),
  update: (id: number, data: Partial<CitaWritable>) =>
    apiPut<Cita>(`/citas/${id}`, data),
  remove: (id: number) => apiDelete<Cita>(`/citas/${id}`),
};
