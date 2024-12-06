import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

interface LoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number;
}

export function Loading({ size = 24, className, ...props }: LoadingProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-center w-full min-h-[100px]',
        className
      )}
      {...props}
    >
      <Loader2 className="animate-spin text-blue-600" size={size} />
    </div>
  );
}
