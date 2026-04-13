import React from 'react';
import { Gear } from '@phosphor-icons/react';
import { ArcReactorLogo } from './ArcReactorLogo';
import { StatusBadge } from './StatusBadge';

interface HeaderProps {
  status: 'online' | 'offline' | 'connecting';
  onSettingsClick: () => void;
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({
  status,
  onSettingsClick,
  className = '',
}) => {
  return (
    <header
      className={`
        flex items-center justify-between px-4 py-3
        glass border-b border-jarvis-cyan/10
        ${className}
      `}
    >
      {/* Logo and Title */}
      <div className="flex items-center gap-3">
        <ArcReactorLogo size="sm" animated={status === 'online'} />
        <div className="flex flex-col">
          <h1 className="font-orbitron font-bold text-lg text-white tracking-wide">
            JARVIS
          </h1>
          <StatusBadge status={status} size="sm" showLabel />
        </div>
      </div>

      {/* Settings Button */}
      <button
        onClick={onSettingsClick}
        className="
          p-2.5 rounded-xl
          hover:bg-jarvis-light-navy/50
          transition-all duration-200
          touch-feedback no-select
        "
        aria-label="Settings"
      >
        <Gear
          size={22}
          color="#8892B0"
          weight="duotone"
        />
      </button>
    </header>
  );
};

export default Header;
