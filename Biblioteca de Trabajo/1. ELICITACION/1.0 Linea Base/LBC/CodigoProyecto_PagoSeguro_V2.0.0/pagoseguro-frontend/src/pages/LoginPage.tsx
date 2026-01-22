import React from 'react';
import { LoginForm } from '@/components/auth/LoginForm';

export const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">


        <div className="card">
          <div className="text-center mb-8">
            <img src="/src/assets/logo.png" alt="Logo de El Granito" className="mx-auto mb-4 h-24" />
            <h1 className="text-3xl font-bold text-primary-700 mb-2">Bienvenido a El Granito</h1>
            <p className="text-gray-600">Su plataforma financiera de confianza</p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
};
