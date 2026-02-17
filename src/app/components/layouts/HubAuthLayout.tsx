import { Outlet, useNavigate, Link } from 'react-router';
import { getCurrentUser, mockLogout } from '@/data/mocks';
import { MainLayout } from '../MainLayout';
import { HubTabs } from '../navigation/HubTabs';
import hcrSolLogo from '@/assets/4cc5722396a543fc4af4b21d4f57e4ae31cf2825.png';

export function HubAuthLayout() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const handleLogout = () => {
    mockLogout();
    navigate('/');
  };

  if (!user) {
    return null; // ProtectedRoute maneja esto
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo - Alineado a la izquierda */}
            <Link to="/" className="hover:opacity-80 transition-opacity">
              <img
                src={hcrSolLogo}
                alt="HCR Sol"
                className="h-16 w-auto object-contain"
              />
            </Link>

            {/* User Menu - Alineado a la derecha */}
            <div className="flex items-center gap-4">
              <Link
                to="/hub/perfil"
                className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
              >
                {user.username ? `@${user.username}` : user.full_name}
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

      {/* Mobile: Navigation Tabs horizontales arriba */}
      <nav className="lg:hidden bg-white border-b border-gray-200 sticky top-[88px] z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <HubTabs user={user} />
        </div>
      </nav>

      {/* Desktop: Contenedor centrado con Sidebar + Contenido */}
      <div className="hidden lg:block">
        <div className="max-w-7xl mx-auto flex">
          {/* Sidebar vertical */}
          <aside className="w-64 bg-white border-r border-gray-200 sticky top-[88px] h-[calc(100vh-88px)] overflow-y-auto">
            <div className="px-4">
              <HubTabs user={user} />
            </div>
          </aside>

          {/* Contenido principal - Pegado al sidebar */}
          <div className="flex-1 min-w-0 bg-white">
            <div className="p-6 lg:p-8">
              <Outlet />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: Contenido - Pegado a los bordes */}
      <div className="lg:hidden bg-white">
        <div className="p-4 sm:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}