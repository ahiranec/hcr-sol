import { useNavigate } from 'react-router';
import { ProjectForm, type ProjectFormData } from '../components/ProjectForm';
import { mockProjects } from '@/data/mocks';
import { ArrowLeft } from 'lucide-react';

export function HubProjectManagerCrear() {
  const navigate = useNavigate();

  const handleSubmit = (data: ProjectFormData) => {
    // Verificar que no exista un proyecto con el mismo slug
    const exists = mockProjects.find(p => p.slug === data.slug);
    if (exists) {
      alert('❌ Ya existe un proyecto con ese slug');
      return;
    }

    // Crear nuevo proyecto
    const newProject = {
      id: Date.now().toString(),
      slug: data.slug,
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

    // Agregar al mock (en producción sería una llamada a API)
    mockProjects.push(newProject);

    alert('✅ Proyecto creado correctamente');
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
        
        <h3 className="text-xl font-semibold text-gray-900">Crear proyecto</h3>
        <p className="text-sm text-gray-600 mt-1">
          Completa el formulario para agregar un nuevo proyecto al Hub
        </p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <ProjectForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}