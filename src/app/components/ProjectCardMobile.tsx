import { type MockProject } from '@/data/mocks';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ProjectStatusBadge } from './ProjectStatusBadge';
import { ProjectActionsMenu } from './ProjectActionsMenu';

interface ProjectCardMobileProps {
  project: MockProject;
  onDelete: (slug: string) => void;
}

export function ProjectCardMobile({ project, onDelete }: ProjectCardMobileProps) {
  if (!project) return null;
  
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 hover:border-blue-300 transition-colors">
      <div className="flex items-center gap-3">
        {/* Imagen compacta */}
        <div className="w-12 h-12 rounded overflow-hidden bg-gray-100 flex-shrink-0">
          <ImageWithFallback
            src={project.image_url || ''}
            alt={project.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info central */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <p className="font-medium text-sm text-gray-900 truncate">
              {project.name}
            </p>
            <div className="flex-shrink-0">
              <ProjectStatusBadge status={project.status} />
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="truncate">{project.slug}</span>
            {project.version && (
              <>
                <span className="text-gray-300">•</span>
                <span>v{project.version}</span>
              </>
            )}
            {project.sso_mode === 'sso_light' && (
              <>
                <span className="text-gray-300">•</span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                  SSO
                </span>
              </>
            )}
          </div>
        </div>

        {/* Acciones (dropdown) */}
        <ProjectActionsMenu
          slug={project.slug}
          publicUrl={project.public_url}
          onDelete={onDelete}
          compact={true}
        />
      </div>
    </div>
  );
}
