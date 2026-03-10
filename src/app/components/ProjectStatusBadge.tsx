import { cn } from '@/app/components/ui/utils';
import { type ProjectStatus } from '@/data/repos/projectsRepo';

interface ProjectStatusBadgeProps {
  status: ProjectStatus;
}

export function ProjectStatusBadge({ status }: ProjectStatusBadgeProps) {
  const statusText = {
    live: 'Activo',
    in_development: 'En desarrollo',
    coming_soon: 'Próximamente',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        {
          'bg-green-100 text-green-800': status === 'live',
          'bg-amber-100 text-amber-800': status === 'in_development',
          'bg-gray-100 text-gray-800': status === 'coming_soon',
        }
      )}
    >
      {statusText[status]}
    </span>
  );
}
