import { getCurrentUser, mockLogout } from '@/data/mocks';
import { useNavigate, Link } from 'react-router';
import { MainLayout } from './MainLayout';
import logoHcrSol from '@/assets/625b2cf11ebb3c2f863a2aa4fa2597622a07d6ca.png';

interface HubLayoutProps {
  children: React.ReactNode;
}

export function HubLayout({ children }: HubLayoutProps) {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const handleLogout = () => {
    mockLogout();
    navigate('/');
  };

  if (!user) {
    return null; // ProtectedRoute ya maneja esto
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header simple (no sticky) - Full width */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <img src={logoHcrSol} alt="HCR Sol" className="h-8" />
                <span className="text-sm text-gray-500">Hub</span>
              </Link>

              {/* Navegación - Solo visible para superadmin */}
              {user.hub_role === 'superadmin' && (
                <nav className="flex items-center gap-4">
                  <Link
                    to="/hub"
                    className="text-sm font-medium text-gray-700"
                  >
                    Proyectos
                  </Link>
                  <Link
                    to="/hub/usuarios"
                    className="text-sm font-medium text-gray-700"
                  >
                    Usuarios
                  </Link>
                  <Link
                    to="/hub/auditoria"
                    className="text-sm font-medium text-gray-700"
                  >
                    Auditoría
                  </Link>
                </nav>
              )}
            </div>

            <div className="flex items-center gap-4">
              <Link
                to="/hub"
                className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
              >
                {user.full_name}
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Content con MainLayout (3 columnas responsivo) */}
      <MainLayout>
        <div className="py-8">
          {children}
        </div>
      </MainLayout>
    </div>
  );
}