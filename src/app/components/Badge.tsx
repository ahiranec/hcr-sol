import { cn } from '@/app/components/ui/utils';

interface BadgeProps {
  variant: 'development' | 'live' | 'coming_soon';
  children: React.ReactNode;
}

export function Badge({ variant, children }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        {
          'bg-amber-100 text-amber-800': variant === 'development',
          'bg-green-100 text-green-800': variant === 'live',
          'bg-gray-100 text-gray-800': variant === 'coming_soon',
        }
      )}
    >
      {children}
    </span>
  );
}