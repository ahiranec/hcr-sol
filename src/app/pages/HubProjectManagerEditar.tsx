import { useNavigate, useParams } from 'react-router';
import { ProjectForm, type ProjectFormData } from '../components/ProjectForm';
import { mockProjects } from '@/data/mocks';
import { ArrowLeft } from 'lucide-react';

export function HubProjectManagerEditar() {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();

  // Buscar el proyecto
  const project = mockProjects.find(p => p.slug === slug);

  if (!project) {
    return (
      <div className="max-w-3xl">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-900 mb-2">Proyecto no encontrado</h3>
          <p className="text-sm text-red-700 mb-4">
            El proyecto "{slug}" no existe en el sistema.
          </p>
          <button
            onClick={() => navigate('/hub/superadmin/hub-project-manager')}
            className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
          >
            Volver al listado
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = (data: ProjectFormData) => {
    // Actualizar el proyecto en el mock
    const index = mockProjects.findIndex(p => p.slug === slug);
    if (index >= 0) {
      mockProjects[index] = {
        ...mockProjects[index],
        name: data.name,
        status: data.status,
        public_url: data.publicUrl,
        admin_url: data.adminUrl,
        description: data.description,
        version: data.version,
        image_url: data.imageUrl,
        sso_mode: (data.ssoEnabled ? 'sso_light' : 'none') as 'sso_light' | 'none',
        show_in_home: data.showInHome,
        last_update_at: Date.now(),
        last_update_label: 'hace unos segundos',
      };
    }

    alert('✅ Proyecto actualizado correctamente');
    navigate('/hub/superadmin/hub-project-manager');
  };

  const handleCancel = () => {
    navigate('/hub/superadmin/hub-project-manager');
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <button
          onClick={() => navigate('/hub/superadmin/hub-project-manager')}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Volver al listado</span>
        </button>
        
        <h3 className="text-xl font-semibold text-gray-900">Editar proyecto</h3>
        <p className="text-sm text-gray-600 mt-1">
          Modifica los datos del proyecto "{project.name}"
        </p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <ProjectForm
          initialData={{
            slug: project.slug,
            name: project.name,
            status: project.status as 'in_development' | 'live',
            publicUrl: project.public_url,
            adminUrl: project.admin_url,
            description: project.description || '',
            version: project.version || '',
            imageUrl: project.image_url || '',
            ssoEnabled: project.sso_mode === 'sso_light',
            ssoUrl: null,
            showInHome: project.show_in_home || false,
          }}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isEdit
        />
      </div>
    </div>
  );
}