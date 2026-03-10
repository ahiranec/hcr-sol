import { type MockProject } from '@/data/repos/projectsRepo';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ProjectStatusBadge } from './ProjectStatusBadge';
import { ProjectActionsMenu } from './ProjectActionsMenu';

interface ProjectTableRowProps {
  project: MockProject;
  onDelete: (slug: string) => void;
}

export function ProjectTableRow({ project, onDelete }: ProjectTableRowProps) {
  if (!project) return null;
  
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 rounded overflow-hidden bg-gray-100 flex-shrink-0">
            <ImageWithFallback
              src={project.image_url || ''}
              alt={project.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{project.name}</p>
            <p className="text-xs text-gray-500">{project.slug}</p>
            <p className="text-xs text-gray-600 mt-1 line-clamp-1">{project.description}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <ProjectStatusBadge status={project.status} />
      </td>
      <td className="px-6 py-4">
        <span className="text-sm text-gray-900">{project.version || '-'}</span>
      </td>
      <td className="px-6 py-4">
        {project.sso_mode === 'sso_light' ? (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Habilitado
          </span>
        ) : (
          <span className="text-sm text-gray-400">-</span>
        )}
      </td>
      <td className="px-6 py-4">
        <ProjectActionsMenu
          slug={project.slug}
          publicUrl={project.public_url}
          onDelete={onDelete}
          compact={false}
        />
      </td>
    </tr>
  );
}