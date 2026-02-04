import api from './api';

export interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  cedula: string;
  telefono: string;
  direccion: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  accessToken: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    role: string;
  };
}

export const authService = {
  async register(data: RegisterData) {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  async login(data: LoginData) {
    const response = await api.post<LoginResponse>('/auth/login', data);
    return response.data;
  },

  async recoverPassword(email: string) {
    const response = await api.post('/auth/recover-password', { email });
    return response.data;
  },

  async logout() {
    const response = await api.post('/auth/logout');
    return response.data;
  },
};