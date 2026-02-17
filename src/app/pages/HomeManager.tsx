import { Outlet } from 'react-router';
import { SubNav } from '../components/SubNav';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';

export function HomeManager() {
  const navigate = useNavigate();
  
  const subNavItems = [
    { to: '/hub/superadmin/home-manager/logo', label: 'Logo' },
    { to: '/hub/superadmin/home-manager/carrusel-principal', label: 'Carrusel Principal' },
  ];

  return (
    <div>
      <div className="mb-6">
        <button
          onClick={() => navigate('/hub/superadmin')}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Volver al Dashboard</span>
        </button>
        
        <h2 className="text-2xl font-bold text-gray-900">Home Manager</h2>
        <p className="text-sm text-gray-600 mt-1">
          Gestiona el contenido del sitio público Home
        </p>
      </div>

      <SubNav items={subNavItems} />

      <Outlet />
    </div>
  );
}