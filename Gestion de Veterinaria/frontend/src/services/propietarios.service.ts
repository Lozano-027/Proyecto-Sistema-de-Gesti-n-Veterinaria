import api from '../lib/api';
import { Propietario, CreatePropietarioDto, ApiResponse } from '../interfaces';

export const propietariosService = {
  async findAll(): Promise<Propietario[]> {
    const res = await api.get<ApiResponse<Propietario[]>>('/propietarios');
    return res.data.data;
  },

  async findOne(id: number): Promise<Propietario> {
    const res = await api.get<ApiResponse<Propietario>>(`/propietarios/${id}`);
    return res.data.data;
  },

  async create(dto: CreatePropietarioDto): Promise<Propietario> {
    const res = await api.post<ApiResponse<Propietario>>('/propietarios', dto);
    return res.data.data;
  },

  async update(id: number, dto: Partial<CreatePropietarioDto>): Promise<Propietario> {
    const res = await api.patch<ApiResponse<Propietario>>(`/propietarios/${id}`, dto);
    return res.data.data;
  },

  async remove(id: number): Promise<void> {
    await api.delete(`/propietarios/${id}`);
  },
};
