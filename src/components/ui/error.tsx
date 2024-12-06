import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ErrorProps extends React.HTMLAttributes<HTMLDivElement> {
  message?: string;
}

export function Error({
  message = 'Ocorreu um erro. Por favor, tente novamente.',
  className,
  ...props
}: ErrorProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center w-full min-h-[100px] p-4',
        'bg-red-50 text-red-600 rounded-lg',
        className
      )}
      {...props}
    >
      <AlertTriangle className="w-8 h-8 mb-2" />
      <p className="text-center">{message}</p>
    </div>
  );
}
