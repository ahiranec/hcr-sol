import { Navigate, useLocation } from 'react-router';
import { authRepo } from '@/data/repos/authRepo';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();
  const user = authRepo.getCurrentUserSync();

  // Si no hay usuario autenticado, redirigir a login
  if (!user) {
    return <Navigate to={`/login?redirect=${location.pathname}`} replace />;
  }

  // Si el usuario está deshabilitado, mostrar mensaje de bloqueo
  if (user.status === 'disabled') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center px-4 max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Acceso denegado</h1>
          <p className="text-gray-600 mb-6">
            Tu cuenta está deshabilitada. Contacta al administrador.
          </p>
          <button
            onClick={() => {
              // Simulación de logout
              window.location.href = '/';
            }}
            className="px-6 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}