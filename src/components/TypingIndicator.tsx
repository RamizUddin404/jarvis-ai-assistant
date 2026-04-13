import React from 'react';

interface TypingIndicatorProps {
  className?: string;
  dotCount?: number;
  dotSize?: 'sm' | 'md' | 'lg';
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({
  className = '',
  dotCount = 3,
  dotSize = 'md',
}) => {
  const sizeClasses = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
  };

  const sizeClass = sizeClasses[dotSize];

  return (
    <div
      className={`flex items-center gap-1.5 py-2 ${className}`}
      role="status"
      aria-label="Typing"
    >
      {[...Array(dotCount)].map((_, index) => (
        <div
          key={index}
          className={`
            ${sizeClass}
            rounded-full bg-jarvis-cyan
            animate-bounce-dot
          `}
          style={{
            animationDelay: `${index * 0.15}s`,
          }}
        />
      ))}
      <span className="sr-only">Typing...</span>
    </div>
  );
};

// Alternative waveform-based typing indicator
interface WaveformIndicatorProps {
  className?: string;
  barCount?: number;
  isActive?: boolean;
}

export const WaveformIndicator: React.FC<WaveformIndicatorProps> = ({
  className = '',
  barCount = 5,
  isActive = true,
}) => {
  if (!isActive) {
    return (
      <div className={`flex items-center gap-0.5 h-6 ${className}`}>
        {[...Array(barCount)].map((_, index) => (
          <div
            key={index}
            className="w-1 bg-jarvis-muted-blue/30 rounded-full"
            style={{ height: '4px' }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`flex items-center gap-0.5 h-6 ${className}`}
      role="status"
      aria-label="Processing"
    >
      {[...Array(barCount)].map((_, index) => (
        <div
          key={index}
          className="w-1 bg-jarvis-cyan rounded-full"
          style={{
            height: `${8 + Math.random() * 12}px`,
            animation: `waveform 0.5s ease-in-out infinite`,
            animationDelay: `${index * 0.1}s`,
          }}
        />
      ))}
      <span className="sr-only">Processing...</span>
    </div>
  );
};

// Pulsing dots for loading state
interface PulsingDotsProps {
  count?: number;
  color?: string;
  size?: number;
  speed?: number;
  className?: string;
}

export const PulsingDots: React.FC<PulsingDotsProps> = ({
  count = 3,
  color = '#00D4FF',
  size = 6,
  speed = 1,
  className = '',
}) => {
  return (
    <div
      className={`flex items-center justify-center gap-2 ${className}`}
      role="status"
      aria-label="Loading"
    >
      {[...Array(count)].map((_, index) => (
        <div
          key={index}
          className="rounded-full animate-pulse"
          style={{
            width: size,
            height: size,
            backgroundColor: color,
            animation: `pulse-glow ${1 / speed}s ease-in-out infinite`,
            animationDelay: `${index * (0.2 / speed)}s`,
          }}
        />
      ))}
      <span className="sr-only">Loading...</span>
    </div>
  );
};

// Rotating ring loader
interface RotatingRingProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
  className?: string;
}

export const RotatingRing: React.FC<RotatingRingProps> = ({
  size = 24,
  color = '#00D4FF',
  strokeWidth = 3,
  className = '',
}) => {
  return (
    <div
      className={`relative ${className}`}
      style={{ width: size, height: size }}
      role="status"
      aria-label="Loading"
    >
      <svg
        className="animate-spin"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeOpacity="0.2"
        />
        <path
          d="M12 2C6.47715 2 2 6.47715 2 12"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
      </svg>
      <span className="sr-only">Loading...</span>
    </div>
  );
};

// Complete loading skeleton component
interface LoadingSkeletonProps {
  type?: 'message' | 'avatar' | 'text' | 'button';
  lines?: number;
  className?: string;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  type = 'text',
  lines = 1,
  className = '',
}) => {
  if (type === 'message') {
    return (
      <div className={`flex gap-3 items-start ${className}`}>
        <div className="w-8 h-8 rounded-full bg-jarvis-dark-navy/50 animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-jarvis-dark-navy/50 rounded w-3/4 animate-pulse" />
          <div className="h-4 bg-jarvis-dark-navy/50 rounded w-1/2 animate-pulse" />
        </div>
      </div>
    );
  }

  if (type === 'avatar') {
    return (
      <div
        className={`w-8 h-8 rounded-full bg-jarvis-dark-navy/50 animate-pulse ${className}`}
      />
    );
  }

  if (type === 'button') {
    return (
      <div
        className={`h-10 w-24 bg-jarvis-dark-navy/50 rounded-xl animate-pulse ${className}`}
      />
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {[...Array(lines)].map((_, index) => (
        <div
          key={index}
          className="h-4 bg-jarvis-dark-navy/50 rounded animate-pulse"
          style={{
            width: index === lines - 1 ? '3/4' : 'full',
          }}
        />
      ))}
    </div>
  );
};

export default TypingIndicator;
