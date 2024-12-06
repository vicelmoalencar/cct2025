import React from 'react';
import { AlertCircle, CheckCircle2, Info, XCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
}

const alertStyles = {
  success: {
    bg: 'bg-green-50',
    text: 'text-green-800',
    border: 'border-green-200',
    icon: CheckCircle2,
  },
  error: {
    bg: 'bg-red-50',
    text: 'text-red-800',
    border: 'border-red-200',
    icon: XCircle,
  },
  warning: {
    bg: 'bg-yellow-50',
    text: 'text-yellow-800',
    border: 'border-yellow-200',
    icon: AlertCircle,
  },
  info: {
    bg: 'bg-blue-50',
    text: 'text-blue-800',
    border: 'border-blue-200',
    icon: Info,
  },
};

export function Alert({
  type = 'info',
  title,
  message,
  className,
  ...props
}: AlertProps) {
  const styles = alertStyles[type];
  const Icon = styles.icon;

  return (
    <div
      className={cn(
        'flex p-4 rounded-lg border',
        styles.bg,
        styles.text,
        styles.border,
        className
      )}
      {...props}
    >
      <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
      <div>
        {title && <h3 className="font-medium mb-1">{title}</h3>}
        <p className={cn(!title && 'leading-6')}>{message}</p>
      </div>
    </div>
  );
}
