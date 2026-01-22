import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, CheckCircle } from 'lucide-react';
import { registerSchema, RegisterFormData } from '@/schemas/authSchemas';
import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/stores/authStore';

export const RegisterForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { register: registerUser, success } = useAuth();
  const { isLoading, error } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    const { confirmPassword, ...registerData } = data;
    await registerUser(registerData);
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="w-16 h-16 text-primary-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          ¡Cuenta creada exitosamente!
        </h2>
        <p className="text-gray-600 mb-4">
          Revise su correo para verificar su cuenta.
        </p>
        <p className="text-sm text-gray-500">Redirigiendo al inicio de sesión...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div>
        <label className="label">Nombre completo</label>
        <input
          type="text"
          {...register('fullName')}
          className={`input-field ${errors.fullName ? 'input-error' : ''}`}
          placeholder="Juan Pérez"
        />
        {errors.fullName && (
          <p className="error-text">{errors.fullName.message}</p>
        )}
      </div>

      <div>
        <label className="label">Correo electrónico</label>
        <input
          type="email"
          {...register('email')}
          className={`input-field ${errors.email ? 'input-error' : ''}`}
          placeholder="correo@ejemplo.com"
        />
        {errors.email && (
          <p className="error-text">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="label">Cédula</label>
        <input
          type="text"
          {...register('cedula')}
          className={`input-field ${errors.cedula ? 'input-error' : ''}`}
          placeholder="1234567890"
          maxLength={10}
        />
        {errors.cedula && (
          <p className="error-text">{errors.cedula.message}</p>
        )}
      </div>

      <div>
        <label className="label">Teléfono</label>
        <input
          type="tel"
          {...register('telefono')}
          className={`input-field ${errors.telefono ? 'input-error' : ''}`}
          placeholder="0987654321"
        />
        {errors.telefono && (
          <p className="error-text">{errors.telefono.message}</p>
        )}
      </div>

      <div>
        <label className="label">Dirección</label>
        <textarea
          {...register('direccion')}
          className={`input-field ${errors.direccion ? 'input-error' : ''}`}
          placeholder="Av. Principal 123, Quito"
          rows={2}
        />
        {errors.direccion && (
          <p className="error-text">{errors.direccion.message}</p>
        )}
      </div>

      <div>
        <label className="label">Contraseña</label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            {...register('password')}
            className={`input-field pr-10 ${errors.password ? 'input-error' : ''}`}
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {errors.password && (
          <p className="error-text">{errors.password.message}</p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          Debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.
        </p>
      </div>

      <div>
        <label className="label">Confirmar contraseña</label>
        <div className="relative">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            {...register('confirmPassword')}
            className={`input-field pr-10 ${errors.confirmPassword ? 'input-error' : ''}`}
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="error-text">{errors.confirmPassword.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="btn-primary w-full"
      >
        {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
      </button>

      <p className="text-center text-sm text-gray-600">
        ¿Ya tienes cuenta?{' '}
        <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
          Inicia sesión aquí
        </Link>
      </p>
    </form>
  );
};
