import api from '../lib/api';
import { Mascota, CreateMascotaDto, Cita, CreateCitaDto, HistorialClinico, CreateHistorialDto, ApiResponse } from '../interfaces';

// ─── Mascotas ─────────────────────────────────────────────────────────────────
export const mascotasService = {
  async findAll(): Promise<Mascota[]> {
    const res = await api.get<ApiResponse<Mascota[]>>('/mascotas');
    return res.data.data;
  },

  async findOne(id: number): Promise<Mascota> {
    const res = await api.get<ApiResponse<Mascota>>(`/mascotas/${id}`);
    return res.data.data;
  },

  async findByPropietario(propietarioId: number): Promise<Mascota[]> {
    const res = await api.get<ApiResponse<Mascota[]>>(`/mascotas/propietario/${propietarioId}`);
    return res.data.data;
  },

  async create(dto: CreateMascotaDto): Promise<Mascota> {
    const res = await api.post<ApiResponse<Mascota>>('/mascotas', dto);
    return res.data.data;
  },

  async update(id: number, dto: Partial<CreateMascotaDto>): Promise<Mascota> {
    const res = await api.patch<ApiResponse<Mascota>>(`/mascotas/${id}`, dto);
    return res.data.data;
  },

  async remove(id: number): Promise<void> {
    await api.delete(`/mascotas/${id}`);
  },
};

// ─── Citas ────────────────────────────────────────────────────────────────────
export const citasService = {
  async findAll(): Promise<Cita[]> {
    const res = await api.get<ApiResponse<Cita[]>>('/citas');
    return res.data.data;
  },

  async findOne(id: number): Promise<Cita> {
    const res = await api.get<ApiResponse<Cita>>(`/citas/${id}`);
    return res.data.data;
  },

  async findByMascota(mascotaId: number): Promise<Cita[]> {
    const res = await api.get<ApiResponse<Cita[]>>(`/citas/mascota/${mascotaId}`);
    return res.data.data;
  },

  async create(dto: CreateCitaDto): Promise<Cita> {
    const res = await api.post<ApiResponse<Cita>>('/citas', dto);
    return res.data.data;
  },

  async update(id: number, dto: Partial<CreateCitaDto>): Promise<Cita> {
    const res = await api.patch<ApiResponse<Cita>>(`/citas/${id}`, dto);
    return res.data.data;
  },

  async remove(id: number): Promise<void> {
    await api.delete(`/citas/${id}`);
  },
};

// ─── Historial ────────────────────────────────────────────────────────────────
export const historialService = {
  async findAll(): Promise<HistorialClinico[]> {
    const res = await api.get<ApiResponse<HistorialClinico[]>>('/historial');
    return res.data.data;
  },

  async findByMascota(mascotaId: number): Promise<HistorialClinico[]> {
    const res = await api.get<ApiResponse<HistorialClinico[]>>(`/historial/mascota/${mascotaId}`);
    return res.data.data;
  },

  async create(dto: CreateHistorialDto): Promise<HistorialClinico> {
    const res = await api.post<ApiResponse<HistorialClinico>>('/historial', dto);
    return res.data.data;
  },

  async update(id: number, dto: Partial<CreateHistorialDto>): Promise<HistorialClinico> {
    const res = await api.patch<ApiResponse<HistorialClinico>>(`/historial/${id}`, dto);
    return res.data.data;
  },

  async remove(id: number): Promise<void> {
    await api.delete(`/historial/${id}`);
  },
};
