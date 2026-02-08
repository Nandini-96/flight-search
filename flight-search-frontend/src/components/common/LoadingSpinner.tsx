import { Plane } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  message?: string;
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
};

export const LoadingSpinner = ({ size = 'md', className, message }: LoadingSpinnerProps) => {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-4', className)}>
      <div className={cn('relative flex items-center justify-center', size === 'sm' ? 'h-10 w-10' : size === 'md' ? 'h-14 w-14' : 'h-20 w-20')}>
        <div className={cn('absolute animate-plane-spin rounded-full border-2 border-dashed border-primary/30', size === 'sm' ? 'h-8 w-8' : size === 'md' ? 'h-12 w-12' : 'h-16 w-16')} />
        <div className="animate-plane-spin flex items-center justify-center">
          <Plane className={cn('text-primary animate-plane-spin-reverse', sizeClasses[size])} strokeWidth={2.5} />
        </div>
      </div>
      {message && <p className="text-sm text-muted-foreground animate-pulse">{message}</p>}
    </div>
  );
};