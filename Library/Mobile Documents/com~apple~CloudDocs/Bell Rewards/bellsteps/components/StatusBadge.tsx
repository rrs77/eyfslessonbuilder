import type { ProgressStatus } from '@/lib/types';

interface StatusBadgeProps {
  status: ProgressStatus;
  size?: 'sm' | 'md' | 'lg';
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const sizeClasses = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const statusConfig = {
    locked: {
      bg: 'bg-gray-200',
      text: 'text-gray-700',
      label: '🔒 Coming Soon',
    },
    in_progress: {
      bg: 'bg-yellow-400',
      text: 'text-yellow-900',
      label: '⭐ Learning',
    },
    achieved: {
      bg: 'bg-green-400',
      text: 'text-green-900',
      label: '🎉 Complete!',
    },
  };

  const config = statusConfig[status];

  return (
    <span
      className={`${config.bg} ${config.text} ${sizeClasses[size]} rounded-full font-semibold`}
    >
      {config.label}
    </span>
  );
}
