import api from '../lib/api';
import { AuthResponse, ApiResponse } from '../interfaces';

export const authService = {
  async login(correo: string, contrasena: string): Promise<AuthResponse> {
    const res = await api.post<ApiResponse<AuthResponse>>('/auth/login', { correo, contrasena });
    return res.data.data;
  },

  async register(nombre: string, correo: string, contrasena: string, rol?: string): Promise<AuthResponse> {
    const res = await api.post<ApiResponse<AuthResponse>>('/auth/register', { nombre, correo, contrasena, rol });
    return res.data.data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  },

  getUsuario() {
    if (typeof window === 'undefined') return null;
    const u = localStorage.getItem('usuario');
    return u ? JSON.parse(u) : null;
  },

  isLoggedIn(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('token');
  },
};