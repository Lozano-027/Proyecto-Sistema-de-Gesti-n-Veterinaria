import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api';
import type {
  HistorialClinico,
  HistorialPaginado,
} from '@/interfaces/historial.interface';

type HistorialWritable = Omit<
  HistorialClinico,
  'id' | 'createdAt' | 'updatedAt' | 'mascota' | '_count'
>;

export const historialService = {
  findAll: () => apiGet<HistorialClinico[]>('/historial-clinico'),

  findOne: (id: number) =>
    apiGet<HistorialClinico>(`/historial-clinico/${id}`),

  /** Listado paginado del historial de una mascota. */
  findByMascota: (mascotaId: number, page = 1, limit = 10) =>
    apiGet<HistorialPaginado>(
      `/historial-clinico/mascota/${mascotaId}?page=${page}&limit=${limit}`,
    ),

  create: (data: HistorialWritable) =>
    apiPost<HistorialClinico>('/historial-clinico', data),

  update: (id: number, data: Partial<HistorialWritable>) =>
    apiPut<HistorialClinico>(`/historial-clinico/${id}`, data),

  remove: (id: number) =>
    apiDelete<HistorialClinico>(`/historial-clinico/${id}`),
};
