import React, { useState, useRef } from 'react';
import { Microphone, MicrophoneSlash, PaperPlaneTilt } from '@phosphor-icons/react';

interface VoiceButtonProps {
  isRecording: boolean;
  isDisabled?: boolean;
  onClick: () => void;
  className?: string;
}

export const VoiceButton: React.FC<VoiceButtonProps> = ({
  isRecording,
  isDisabled = false,
  onClick,
  className = '',
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const handleTouchStart = () => setIsPressed(true);
  const handleTouchEnd = () => setIsPressed(false);

  return (
    <button
      onClick={onClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      disabled={isDisabled}
      className={`
        relative flex items-center justify-center rounded-full
        transition-all duration-200 ease-out touch-feedback no-select
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${isRecording
          ? 'w-20 h-20 bg-jarvis-cyan glow-cyan-intense'
          : isPressed
            ? 'w-[68px] h-[68px] bg-jarvis-cyan/20 border-2 border-jarvis-cyan'
            : 'w-16 h-16 bg-jarvis-navy-black/50 border-2 border-jarvis-cyan/50 hover:border-jarvis-cyan hover:w-[68px] hover:h-[68px]'
        }
        ${className}
      `}
      style={{
        transform: isPressed && !isRecording ? 'scale(1.05)' : 'scale(1)',
      }}
    >
      {/* Waveform visualization when recording */}
      {isRecording && (
        <div className="absolute inset-0 flex items-center justify-center gap-1">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-1 bg-white rounded-full"
              style={{
                height: `${12 + Math.random() * 16}px`,
                animation: `waveform 0.5s ease-in-out infinite`,
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Icon */}
      <div className={`relative z-10 ${isRecording ? 'opacity-0' : 'opacity-100'} transition-opacity`}>
        {isDisabled ? (
          <MicrophoneSlash size={28} color="#8892B0" weight="duotone" />
        ) : (
          <Microphone
            size={28}
            color={isRecording ? 'white' : '#00D4FF'}
            weight="duotone"
          />
        )}
      </div>

      {/* Outer pulse ring when recording */}
      {isRecording && (
        <>
          <div className="absolute inset-0 rounded-full bg-jarvis-cyan/30 animate-ping" />
          <div className="absolute inset-[-8px] rounded-full border border-jarvis-cyan/50 animate-pulse" />
        </>
      )}
    </button>
  );
};

interface TextInputBarProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  isDisabled?: boolean;
  className?: string;
}

export const TextInputBar: React.FC<TextInputBarProps> = ({
  value,
  onChange,
  onSend,
  isDisabled = false,
  className = '',
}) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className={`
      flex items-center gap-3 px-4 py-3 rounded-2xl
      glass transition-all duration-200
      ${className}
    `}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Type your message..."
        disabled={isDisabled}
        className="
          flex-1 bg-transparent border-none outline-none
          text-white placeholder:text-jarvis-muted-blue
          font-rajdhani text-base
        "
      />
      <button
        onClick={onSend}
        disabled={!value.trim() || isDisabled}
        className={`
          flex items-center justify-center rounded-full
          transition-all duration-200 touch-feedback
          ${value.trim() && !isDisabled
            ? 'w-10 h-10 bg-gradient-to-br from-jarvis-cyan to-jarvis-deep-blue glow-cyan cursor-pointer'
            : 'w-10 h-10 bg-jarvis-light-navy/50 cursor-not-allowed opacity-50'
          }
        `}
      >
        <PaperPlaneTilt
          size={20}
          color={value.trim() && !isDisabled ? 'white' : '#8892B0'}
          weight="fill"
        />
      </button>
    </div>
  );
};

export default VoiceButton;
