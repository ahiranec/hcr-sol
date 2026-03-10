import { useState } from 'react';
import { Link } from 'react-router';
import { Plus } from 'lucide-react';
import { projectsRepo, type MockProject } from '@/data/repos/projectsRepo';
import { ProjectCardMobile } from '../components/ProjectCardMobile';
import { ProjectTableRow } from '../components/ProjectTableRow';

export function HubProjectManagerLista() {
  const [projects, setProjects] = useState(projectsRepo.getMockProjectsSync());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const handleDelete = (slug: string) => {
    setShowDeleteConfirm(slug);
  };

  const confirmDelete = () => {
    if (!showDeleteConfirm) return;
    
    // Simular eliminación (solo en el estado local, NO modificar projectsRepo.getMockProjectsSync())
    const updatedProjects = projects.filter(p => p.slug !== showDeleteConfirm);
    setProjects(updatedProjects);
    
    // NO modificar projectsRepo.getMockProjectsSync() - en producción esto sería una llamada a API
    // que actualizaría la base de datos, no el array local
    
    alert(`✅ Proyecto "${showDeleteConfirm}" eliminado correctamente (simulación)`);
    setShowDeleteConfirm(null);
  };

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Proyectos del Hub</h3>
          <p className="text-sm text-gray-600 mt-1">
            Gestiona todos los proyectos de la plataforma
          </p>
        </div>
        <Link
          to="/hub/superadmin/hub-project-manager/crear"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Crear proyecto</span>
          <span className="sm:hidden">Crear</span>
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
          <p className="text-gray-600 mb-4">No hay proyectos creados</p>
          <Link
            to="/hub/superadmin/hub-project-manager/crear"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Crear primer proyecto
          </Link>
        </div>
      ) : (
        <>
          {/* Vista mobile - Cards */}
          <div className="md:hidden space-y-2">
            {projects.filter(p => p).map((project) => (
              <ProjectCardMobile
                key={project.slug}
                project={project}
                onDelete={handleDelete}
              />
            ))}
          </div>

          {/* Vista desktop - Tabla */}
          <div className="hidden md:block bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Proyecto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Versión
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SSO
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {projects.filter(p => p).map((project) => (
                  <ProjectTableRow
                    key={project.slug}
                    project={project}
                    onDelete={handleDelete}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Modal de confirmación de eliminación */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              ¿Eliminar proyecto?
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Estás a punto de eliminar el proyecto <strong>{showDeleteConfirm}</strong>.
              Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
              >
                Eliminar proyecto
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}