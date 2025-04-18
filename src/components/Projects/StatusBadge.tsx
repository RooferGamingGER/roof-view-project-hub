
import React from 'react';
import { Check, AlertTriangle, Clock, Loader2 } from 'lucide-react';
import { ProjectStatus } from '@/types';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: ProjectStatus;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

interface StatusConfig {
  icon: React.ElementType;
  bg: string;
  text: string;
  border: string;
  label: string;
  iconClass?: string; // Make iconClass optional in the type
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showLabel = true,
}) => {
  const sizeClasses = {
    sm: 'text-xs py-0.5 px-2',
    md: 'text-sm py-1 px-3',
    lg: 'text-base py-1.5 px-4',
  };

  const statusConfig: Record<ProjectStatus, StatusConfig> = {
    pending: {
      icon: Clock,
      bg: 'bg-status-pending/20',
      text: 'text-status-pending',
      border: 'border-status-pending/30',
      label: 'Pending',
    },
    processing: {
      icon: Loader2,
      bg: 'bg-status-processing/20',
      text: 'text-status-processing',
      border: 'border-status-processing/30',
      label: 'Processing',
      iconClass: 'animate-spin',
    },
    done: {
      icon: Check,
      bg: 'bg-status-done/20',
      text: 'text-status-done',
      border: 'border-status-done/30',
      label: 'Done',
    },
    error: {
      icon: AlertTriangle,
      bg: 'bg-status-error/20',
      text: 'text-status-error',
      border: 'border-status-error/30',
      label: 'Error',
    },
  };

  const { icon: Icon, bg, text, border, label, iconClass = '' } = statusConfig[status];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border',
        bg,
        text,
        border,
        sizeClasses[size]
      )}
    >
      <Icon className={cn('size-3.5', iconClass)} />
      {showLabel && <span>{label}</span>}
    </span>
  );
};

export default StatusBadge;
