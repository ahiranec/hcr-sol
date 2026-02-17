import { Outlet } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';

export function HubProjectManager() {
  const navigate = useNavigate();
  
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
        
        <h2 className="text-2xl font-bold text-gray-900">Hub Project Manager</h2>
        <p className="text-sm text-gray-600 mt-1">
          Crea, edita y administra los proyectos del Hub
        </p>
      </div>

      <Outlet />
    </div>
  );
}