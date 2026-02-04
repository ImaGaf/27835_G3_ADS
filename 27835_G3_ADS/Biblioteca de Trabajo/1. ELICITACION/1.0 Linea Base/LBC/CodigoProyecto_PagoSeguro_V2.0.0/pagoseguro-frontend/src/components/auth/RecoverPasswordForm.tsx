import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Mail } from 'lucide-react';
import { recoverPasswordSchema, RecoverPasswordFormData } from '@/schemas/authSchemas';
import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/stores/authStore';

export const RecoverPasswordForm: React.FC = () => {
  const { recoverPassword, success } = useAuth();
  const { isLoading, error } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<RecoverPasswordFormData>({
    resolver: zodResolver(recoverPasswordSchema),
  });

  const onSubmit = async (data: RecoverPasswordFormData) => {
    await recoverPassword(data.email);
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="w-16 h-16 text-primary-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Correo enviado
        </h2>
        <p className="text-gray-600 mb-4">
          Hemos enviado un código de 6 dígitos a
          <br />
          <strong>{getValues('email')}</strong>
        </p>
        <p className="text-sm text-gray-500 mb-6">
          Revisa tu bandeja de entrada y sigue las instrucciones.
        </p>
        <Link to="/login" className="btn-primary inline-block">
          Volver al inicio de sesión
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="text-center mb-6">
        <Mail className="w-12 h-12 text-primary-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-gray-800 mb-1">
          ¿Olvidaste tu contraseña?
        </h2>
        <p className="text-sm text-gray-600">
          Ingresa tu correo electrónico y te enviaremos un código de verificación.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div>
        <label className="label">Correo electrónico</label>
        <input
          type="email"
          {...register('email')}
          className={`input-field ${errors.email ? 'input-error' : ''}`}
          placeholder="correo@ejemplo.com"
          autoComplete="email"
        />
        {errors.email && (
          <p className="error-text">{errors.email.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="btn-primary w-full"
      >
        {isLoading ? 'Enviando código...' : 'Enviar Código'}
      </button>

      <Link
        to="/login"
        className="flex items-center justify-center text-sm text-gray-600 hover:text-gray-800"
      >
        <ArrowLeft size={16} className="mr-1" />
        Volver al inicio de sesión
      </Link>
    </form>
  );
};