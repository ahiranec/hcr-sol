import { cn } from '@/app/components/ui/utils';
import { HealthStatus } from '@/data/mocks';

interface HealthIndicatorProps {
  status: HealthStatus | null;
  size?: 'sm' | 'md';
  showLabel?: boolean;
}

export function HealthIndicator({ status, size = 'md', showLabel = true }: HealthIndicatorProps) {
  if (!status) return null;

  const statusConfig = {
    ok: { label: 'Operativo', color: 'bg-green-500' },
    warning: { label: 'Advertencia', color: 'bg-amber-500' },
    down: { label: 'Caído', color: 'bg-red-500' },
  };

  const config = statusConfig[status];
  
  const dotSize = size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2';
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm';

  return (
    <div className={cn('flex items-center gap-2 text-gray-600', textSize)}>
      <div className={cn('rounded-full', config.color, dotSize)} />
      {showLabel && <span>{config.label}</span>}
    </div>
  );
}