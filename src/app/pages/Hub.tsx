import { useState, useEffect } from 'react';
import { HubProjectCard } from '../components/HubProjectCard';
import { authRepo, type MockProfile } from '@/data/repos/authRepo';
import { projectsRepo, type MockProject } from '@/data/repos/projectsRepo';
import { accessesRepo } from '@/data/repos/accessesRepo';

export function Hub() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<MockProfile | null>(null);
  const [allProjects, setAllProjects] = useState<MockProject[]>([]);
  const [permissionsMap, setPermissionsMap] = useState<Record<string, { hasAccess: boolean, canAdmin: boolean }>>({});
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        if (authRepo.getUiState().loading) {
          return;
        }

        const currentUser = await authRepo.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          const projects = await projectsRepo.getAllHubProjects();
          setAllProjects(projects);

          const perms: Record<string, { hasAccess: boolean, canAdmin: boolean }> = {};
          for (const project of projects) {
            const hasAccess = await accessesRepo.canUserAccessProject(currentUser.email, currentUser.hub_role, project.slug);
            const canAdmin = await accessesRepo.canUserAdminProject(currentUser.email, currentUser.hub_role, project.slug);
            perms[project.slug] = { hasAccess, canAdmin };
          }
          setPermissionsMap(perms);
        }

        if (authRepo.getUiState().error) {
          setError(true);
        }
        
        setIsLoading(false);
      } catch (err) {
        setError(true);
        setIsLoading(false);
      }
    }
    
    loadData();
  }, []);

  // Estado de carga inicial
  if (isLoading) {
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
  if (error) {
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
            const perms = permissionsMap[project.slug] || { hasAccess: false, canAdmin: false };
            
            return (
              <HubProjectCard 
                key={project.id} 
                project={project}
                hasAccess={perms.hasAccess}
                canAdmin={perms.canAdmin}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}