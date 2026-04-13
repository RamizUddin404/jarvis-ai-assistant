import React from 'react';

interface ArcReactorLogoProps {
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  className?: string;
}

const sizeMap = {
  sm: { container: 40, circle: 20, stroke: 2 },
  md: { container: 64, circle: 32, stroke: 2.5 },
  lg: { container: 96, circle: 48, stroke: 3 },
};

export const ArcReactorLogo: React.FC<ArcReactorLogoProps> = ({
  size = 'md',
  animated = true,
  className = '',
}) => {
  const dimensions = sizeMap[size];
  const animationClass = animated
    ? size === 'lg'
      ? 'arc-reactor-pulse-intense'
      : 'arc-reactor-pulse'
    : '';

  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: dimensions.container, height: dimensions.container }}
    >
      {/* Outer glow ring */}
      <svg
        width={dimensions.container}
        height={dimensions.container}
        viewBox={`0 0 ${dimensions.container} ${dimensions.container}`}
        className={`absolute ${animationClass}`}
      >
        <defs>
          <filter id="arcGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00D4FF" />
            <stop offset="50%" stopColor="#0088CC" />
            <stop offset="100%" stopColor="#00D4FF" />
          </linearGradient>
        </defs>

        {/* Outer decorative rings */}
        <circle
          cx={dimensions.container / 2}
          cy={dimensions.container / 2}
          r={dimensions.container / 2 - 2}
          fill="none"
          stroke="url(#arcGradient)"
          strokeWidth={1}
          strokeDasharray="4 4"
          opacity="0.3"
        />

        <circle
          cx={dimensions.container / 2}
          cy={dimensions.container / 2}
          r={dimensions.container / 2 - 6}
          fill="none"
          stroke="#00D4FF"
          strokeWidth={1}
          opacity="0.2"
          filter="url(#arcGlow)"
        />

        {/* Main outer ring */}
        <circle
          cx={dimensions.container / 2}
          cy={dimensions.container / 2}
          r={dimensions.circle}
          fill="none"
          stroke="url(#arcGradient)"
          strokeWidth={dimensions.stroke}
          filter="url(#arcGlow)"
        />

        {/* Inner ring */}
        <circle
          cx={dimensions.container / 2}
          cy={dimensions.container / 2}
          r={dimensions.circle * 0.6}
          fill="none"
          stroke="#00D4FF"
          strokeWidth={dimensions.stroke * 0.8}
          opacity="0.6"
        />

        {/* Center core */}
        <circle
          cx={dimensions.container / 2}
          cy={dimensions.container / 2}
          r={dimensions.circle * 0.25}
          fill="#00D4FF"
          opacity="0.9"
          filter="url(#arcGlow)"
        />

        {/* Decorative triangular cuts */}
        {[0, 60, 120, 180, 240, 300].map((angle) => (
          <polygon
            key={angle}
            points={`
              ${dimensions.container / 2 + Math.cos((angle * Math.PI) / 180) * (dimensions.circle + 4)},${dimensions.container / 2 + Math.sin((angle * Math.PI) / 180) * (dimensions.circle + 4)}
              ${dimensions.container / 2 + Math.cos(((angle - 15) * Math.PI) / 180) * (dimensions.circle - 2)},${dimensions.container / 2 + Math.sin(((angle - 15) * Math.PI) / 180) * (dimensions.circle - 2)}
              ${dimensions.container / 2 + Math.cos(((angle + 15) * Math.PI) / 180) * (dimensions.circle - 2)},${dimensions.container / 2 + Math.sin(((angle + 15) * Math.PI) / 180) * (dimensions.circle - 2)}
            `}
            fill="#0A0E1A"
          />
        ))}

        {/* Connection lines */}
        {[0, 72, 144, 216, 288].map((angle) => (
          <line
            key={angle}
            x1={dimensions.container / 2 + Math.cos((angle * Math.PI) / 180) * dimensions.circle * 0.4}
            y1={dimensions.container / 2 + Math.sin((angle * Math.PI) / 180) * dimensions.circle * 0.4}
            x2={dimensions.container / 2 + Math.cos((angle * Math.PI) / 180) * dimensions.circle * 0.85}
            y2={dimensions.container / 2 + Math.sin((angle * Math.PI) / 180) * dimensions.circle * 0.85}
            stroke="#00D4FF"
            strokeWidth={1}
            opacity="0.4"
          />
        ))}
      </svg>

      {/* Inner glow effect */}
      <div
        className={`absolute rounded-full bg-jarvis-cyan/20 blur-xl ${animationClass}`}
        style={{
          width: dimensions.circle * 1.5,
          height: dimensions.circle * 1.5,
        }}
      />
    </div>
  );
};

export default ArcReactorLogo;
