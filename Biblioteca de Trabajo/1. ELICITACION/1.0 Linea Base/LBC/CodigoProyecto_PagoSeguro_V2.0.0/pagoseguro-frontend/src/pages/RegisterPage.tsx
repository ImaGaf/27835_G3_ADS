import React from 'react';
import { RegisterForm } from '@/components/auth/RegisterForm';

export const RegisterPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="card">
          <img src="/src/assets/logo.png" alt="Logo de El Granito" className="mx-auto mb-4 h-24" />
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary-500 mb-2">Crear Cuenta</h1>
            <p className="text-gray-600">Complete el formulario para registrarse como cliente</p>
          </div>
          <RegisterForm />
        </div>
      </div>
    </div>
  );
};