import { useState, useEffect } from 'react';
import { HubProjectCard } from '../components/HubProjectCard';
import { getCurrentUser, getAllHubProjects, canUserAccessProject, canUserAdminProject, mockUiState } from '@/data/mocks';

export function Hub() {
  const [isLoading, setIsLoading] = useState(true);
  const user = getCurrentUser();

  // Simular verificación de sesión
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Estado de carga inicial
  if (isLoading || mockUiState.loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  // Estado de error
  if (mockUiState.error) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center max-w-md px-4">
          <p className="text-red-600 mb-4">Ocurrió un error al cargar los proyectos.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // ProtectedRoute ya maneja esto
  }

  // NUEVA LÓGICA: Obtener TODOS los proyectos (no filtrar)
  const allProjects = getAllHubProjects();

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Mis proyectos</h2>

      {/* Estado empty */}
      {allProjects.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
          <p className="text-gray-600">No hay proyectos disponibles.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {allProjects.map((project) => {
            const userHasAccess = canUserAccessProject(user.email, user.hub_role, project.slug);
            const userCanAdmin = canUserAdminProject(user.email, user.hub_role, project.slug);
            
            return (
              <HubProjectCard 
                key={project.id} 
                project={project}
                hasAccess={userHasAccess}
                canAdmin={userCanAdmin}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}