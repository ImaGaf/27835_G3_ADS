import React from 'react';
import { RecoverPasswordForm } from '@/components/auth/RecoverPasswordForm';

export const RecoverPasswordPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="card">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary-700 mb-2">El Granito</h1>
          </div>
          <RecoverPasswordForm />
        </div>
      </div>
    </div>
  );
};
