import React from 'react';

interface StatusBadgeProps {
  status: 'online' | 'offline' | 'connecting';
  showLabel?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  showLabel = false,
  size = 'md',
  className = '',
}) => {
  const statusConfig = {
    online: {
      color: 'bg-jarvis-neon-green',
      glow: 'shadow-glow-green',
      label: 'Online',
      animate: true,
    },
    offline: {
      color: 'bg-jarvis-error',
      glow: '',
      label: 'Offline',
      animate: false,
    },
    connecting: {
      color: 'bg-yellow-400',
      glow: '',
      label: 'Connecting',
      animate: true,
    },
  };

  const config = statusConfig[status];
  const dotSize = size === 'sm' ? 'w-2 h-2' : 'w-2.5 h-2.5';

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative">
        <div
          className={`
            ${dotSize} rounded-full ${config.color}
            ${config.glow}
          `}
        />
        {config.animate && status === 'connecting' && (
          <div className={`absolute inset-0 ${dotSize} rounded-full ${config.color} animate-ping opacity-75`} />
        )}
        {config.animate && status === 'online' && (
          <div className={`absolute inset-0 ${dotSize} rounded-full ${config.color} animate-pulse opacity-50`} />
        )}
      </div>
      {showLabel && (
        <span className="text-xs font-medium text-jarvis-muted-blue font-orbitron uppercase tracking-wider">
          {config.label}
        </span>
      )}
    </div>
  );
};

export default StatusBadge;
