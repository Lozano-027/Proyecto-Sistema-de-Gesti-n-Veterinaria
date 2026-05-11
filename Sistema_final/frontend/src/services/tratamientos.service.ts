import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api';
import type { Tratamiento } from '@/interfaces/tratamiento.interface';

type TratamientoWritable = Omit<
  Tratamiento,
  'id' | 'createdAt' | 'updatedAt' | 'cita' | 'historialClinico'
>;

export const tratamientosService = {
  findAll: () => apiGet<Tratamiento[]>('/tratamientos'),
  findOne: (id: number) => apiGet<Tratamiento>(`/tratamientos/${id}`),
  findByCita: (citaId: number) =>
    apiGet<Tratamiento[]>(`/tratamientos/cita/${citaId}`),
  findByHistorial: (histId: number) =>
    apiGet<Tratamiento[]>(`/tratamientos/historial/${histId}`),
  create: (data: TratamientoWritable) =>
    apiPost<Tratamiento>('/tratamientos', data),
  update: (id: number, data: Partial<TratamientoWritable>) =>
    apiPut<Tratamiento>(`/tratamientos/${id}`, data),
  remove: (id: number) => apiDelete<Tratamiento>(`/tratamientos/${id}`),
};
