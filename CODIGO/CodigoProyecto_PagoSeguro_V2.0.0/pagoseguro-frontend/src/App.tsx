import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { RecoverPasswordPage } from '@/pages/RecoverPasswordPage';
import { useAuthStore } from '@/stores/authStore';
import { useAuth } from './hooks/useAuth';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const DashboardPlaceholder: React.FC = () => {
  const { user } = useAuthStore();
  const { logout } = useAuth();
  
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="card">
          <h1 className="text-3xl font-bold text-primary-700 mb-4">
            Dashboard - {user?.role}
          </h1>
          <p className="text-gray-600 mb-4">Bienvenido, {user?.fullName}</p>
          <button onClick={logout} className="btn-primary">
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/recuperar-contrasena" element={<RecoverPasswordPage />} />
      
      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute>
            <DashboardPlaceholder />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
