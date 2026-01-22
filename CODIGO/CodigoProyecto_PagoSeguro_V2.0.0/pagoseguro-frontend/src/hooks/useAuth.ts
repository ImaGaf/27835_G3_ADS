import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, RegisterData, LoginData } from '@/services/authService';
import { useAuthStore } from '@/stores/authStore';

export const useAuth = () => {
  const navigate = useNavigate();
  const { setUser, setToken, logout: storeLogout, setLoading, setError } = useAuthStore();
  const [success, setSuccess] = useState(false);

  const register = async (data: RegisterData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authService.register(data);
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
      return response;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error en el registro';
      setError(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const login = async (data: LoginData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authService.login(data);
      
      setUser(response.user);
      setToken(response.accessToken);
      
      // Redirigir según rol
      switch (response.user.role) {
        case 'GERENTE':
          navigate('/dashboard/gerente');
          break;
        case 'ASISTENTE':
          navigate('/dashboard/asistente');
          break;
        case 'CLIENTE':
          navigate('/dashboard/cliente');
          break;
        default:
          navigate('/dashboard');
      }
      
      return response;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al iniciar sesión';
      setError(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const recoverPassword = async (email: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authService.recoverPassword(email);
      setSuccess(true);
      
      return response;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al recuperar contraseña';
      setError(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      storeLogout();
      navigate('/login');
    }
  };

  return {
    register,
    login,
    recoverPassword,
    logout,
    success,
  };
};
