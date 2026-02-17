import { useNavigate } from 'react-router';
import { ProjectStatusBadge } from './ProjectStatusBadge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { MockProject } from '@/data/mocks';
import { Globe, Settings } from 'lucide-react';

interface HubProjectCardProps {
  project: MockProject;
  hasAccess: boolean;
  canAdmin?: boolean;
}

export function HubProjectCard({ project, hasAccess, canAdmin = false }: HubProjectCardProps) {
  const navigate = useNavigate();

  const handleWebsiteClick = () => {
    if (!project.public_url) return;
    window.open(project.public_url, '_blank', 'noopener,noreferrer');
  };

  const handleAdminClick = () => {
    if (!project.admin_url) return;
    
    // Si tiene SSO light, ir al gateway en modo admin
    if (project.sso_mode === 'sso_light') {
      navigate(`/hub/proyecto/${project.slug}/gateway?mode=admin`);
    } else {
      // Si no tiene SSO, abrir admin_url directamente
      window.open(project.admin_url, '_blank', 'noopener,noreferrer');
    }
  };

  const getActionButtons = () => {
    // Sin acceso: bloqueado
    if (!hasAccess) {
      return (
        <button
          disabled
          className="w-full px-4 py-2 bg-gray-100 text-gray-400 rounded-md text-sm font-medium cursor-not-allowed"
        >
          Sin acceso
        </button>
      );
    }

    // Con acceso: mostrar botones de Sitio Web y Abrir Panel
    return (
      <div className="flex gap-2">
        {/* Botón Sitio Web */}
        <button
          onClick={handleWebsiteClick}
          disabled={!project.public_url}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
            project.public_url
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          <Globe className="w-4 h-4" />
          {project.public_url ? 'Web' : 'Pronto'}
        </button>

        {/* Botón Abrir Panel */}
        <button
          onClick={handleAdminClick}
          disabled={!project.admin_url}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
            project.admin_url
              ? 'bg-purple-600 text-white hover:bg-purple-700'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          <Settings className="w-4 h-4" />
          {project.admin_url ? 'Panel' : 'Pronto'}
        </button>
      </div>
    );
  };

  const cardClassName = `bg-white border border-gray-200 rounded-lg overflow-hidden transition-all ${
    hasAccess
      ? 'hover:shadow-lg hover:border-gray-300'
      : 'opacity-60'
  }`;

  return (
    <div className={cardClassName}>
      {/* Imagen del proyecto */}
      <div className="relative w-full h-48 bg-gray-100 overflow-hidden"
      >
        {project.image_url ? (
          <ImageWithFallback
            src={project.image_url}
            alt={project.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <span className="text-4xl font-bold text-gray-300">{project.name.charAt(0)}</span>
          </div>
        )}
        
        {/* Badge de estado superpuesto */}
        <div className="absolute top-3 right-3">
          <ProjectStatusBadge status={project.status} />
        </div>
      </div>

      {/* Contenido */}
      <div className="p-5">
        {/* Título */}
        <div className="mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
            {project.name}
          </h3>
          {project.version && (
            <p className="text-xs text-gray-500 mt-1">{project.version}</p>
          )}
        </div>

        {/* Descripción */}
        {project.description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2 min-h-[2.5rem]">
            {project.description}
          </p>
        )}

        {/* Última actualización */}
        {project.last_update_label && (
          <div className="text-xs text-gray-500 mb-4 pb-4 border-b border-gray-100">
            Actualizado {project.last_update_label}
          </div>
        )}

        {/* Botones de acción */}
        {getActionButtons()}
      </div>
    </div>
  );
}