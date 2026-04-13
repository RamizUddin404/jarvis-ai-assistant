import React, { useEffect, useState } from 'react';
import { X, Key, Gear, Info, FloppyDisk, ArrowLeft } from '@phosphor-icons/react';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  apiEndpoint: string;
  apiKey: string;
  onApiEndpointChange: (value: string) => void;
  onApiKeyChange: (value: string) => void;
  onSave: () => void;
  className?: string;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  isOpen,
  onClose,
  apiEndpoint,
  apiKey,
  onApiEndpointChange,
  onApiKeyChange,
  onSave,
  className = '',
}) => {
  const [localEndpoint, setLocalEndpoint] = useState(apiEndpoint);
  const [localApiKey, setLocalApiKey] = useState(apiKey);
  const [showApiKey, setShowApiKey] = useState(false);
  const [activeTab, setActiveTab] = useState<'api' | 'voice' | 'about'>('api');

  useEffect(() => {
    setLocalEndpoint(apiEndpoint);
    setLocalApiKey(apiKey);
  }, [apiEndpoint, apiKey]);

  const handleSave = () => {
    onApiEndpointChange(localEndpoint);
    onApiKeyChange(localApiKey);
    onSave();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`
          absolute right-0 top-0 bottom-0 w-full max-w-md
          bg-jarvis-navy-black/95 backdrop-blur-xl
          border-l border-jarvis-cyan/20
          animate-slide-in-right
          flex flex-col
          ${className}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-jarvis-cyan/10">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-jarvis-light-navy/50 transition-colors"
            >
              <ArrowLeft size={20} color="#8892B0" />
            </button>
            <h2 className="font-orbitron font-semibold text-white text-lg">Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-jarvis-light-navy/50 transition-colors"
          >
            <X size={20} color="#8892B0" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-jarvis-cyan/10">
          {[
            { id: 'api' as const, label: 'API', icon: Key },
            { id: 'voice' as const, label: 'Voice', icon: Gear },
            { id: 'about' as const, label: 'About', icon: Info },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex-1 flex items-center justify-center gap-2 py-3 px-4
                font-orbitron text-sm transition-all duration-200
                ${activeTab === tab.id
                  ? 'text-jarvis-cyan border-b-2 border-jarvis-cyan bg-jarvis-cyan/5'
                  : 'text-jarvis-muted-blue hover:text-white hover:bg-jarvis-light-navy/30'
                }
              `}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {activeTab === 'api' && (
            <div className="space-y-6 animate-fade-in">
              {/* API Endpoint */}
              <div className="space-y-3">
                <label className="block font-orbitron text-xs text-jarvis-muted-blue uppercase tracking-wider">
                  API Endpoint
                </label>
                <input
                  type="url"
                  value={localEndpoint}
                  onChange={(e) => setLocalEndpoint(e.target.value)}
                  placeholder="https://api.openai.com/v1/chat/completions"
                  className="
                    w-full px-4 py-3 rounded-xl
                    bg-jarvis-dark-navy/50 border border-jarvis-cyan/20
                    text-white placeholder:text-jarvis-muted-blue/50
                    font-rajdhani text-sm
                    focus:outline-none focus:border-jarvis-cyan focus:ring-1 focus:ring-jarvis-cyan/30
                    transition-all duration-200
                  "
                />
                <p className="text-xs text-jarvis-muted-blue/60 font-rajdhani">
                  Enter your OpenAI-compatible API endpoint URL
                </p>
              </div>

              {/* API Key */}
              <div className="space-y-3">
                <label className="block font-orbitron text-xs text-jarvis-muted-blue uppercase tracking-wider">
                  API Key
                </label>
                <div className="relative">
                  <input
                    type={showApiKey ? 'text' : 'password'}
                    value={localApiKey}
                    onChange={(e) => setLocalApiKey(e.target.value)}
                    placeholder="sk-..."
                    className="
                      w-full px-4 py-3 pr-12 rounded-xl
                      bg-jarvis-dark-navy/50 border border-jarvis-cyan/20
                      text-white placeholder:text-jarvis-muted-blue/50
                      font-rajdhani text-sm
                      focus:outline-none focus:border-jarvis-cyan focus:ring-1 focus:ring-jarvis-cyan/30
                      transition-all duration-200
                    "
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-jarvis-muted-blue hover:text-white transition-colors"
                  >
                    {showApiKey ? 'Hide' : 'Show'}
                  </button>
                </div>
                <p className="text-xs text-jarvis-muted-blue/60 font-rajdhani">
                  Your API key is stored locally and never sent to our servers
                </p>
              </div>
            </div>
          )}

          {activeTab === 'voice' && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-jarvis-dark-navy/50 border border-jarvis-cyan/30 flex items-center justify-center">
                  <Gear size={32} color="#00D4FF" />
                </div>
                <p className="font-orbitron text-sm text-jarvis-muted-blue">
                  Voice settings coming soon
                </p>
              </div>
            </div>
          )}

          {activeTab === 'about' && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center py-4">
                <div className="w-20 h-20 mx-auto mb-4">
                  <svg viewBox="0 0 100 100" className="w-full h-full arc-reactor-pulse">
                    <defs>
                      <filter id="aboutGlow">
                        <feGaussianBlur stdDeviation="3" />
                        <feMerge>
                          <feMergeNode />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#00D4FF" strokeWidth="3" filter="url(#aboutGlow)" />
                    <circle cx="50" cy="50" r="25" fill="none" stroke="#00D4FF" strokeWidth="2" opacity="0.6" />
                    <circle cx="50" cy="50" r="12" fill="#00D4FF" opacity="0.9" />
                  </svg>
                </div>
                <h3 className="font-orbitron text-xl font-bold text-white mb-1">JARVIS</h3>
                <p className="font-rajdhani text-jarvis-muted-blue">Version 1.0.0</p>
              </div>

              <div className="glass rounded-xl p-4 space-y-3">
                <p className="font-rajdhani text-sm text-jarvis-muted-blue leading-relaxed">
                  JARVIS is your personal AI assistant, inspired by the future.
                  Built with cutting-edge AI technology to provide you with
                  intelligent, voice-powered assistance.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center py-2 border-b border-jarvis-cyan/10">
                  <span className="font-rajdhani text-sm text-jarvis-muted-blue">Platform</span>
                  <span className="font-rajdhani text-sm text-white">Web (PWA)</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-jarvis-cyan/10">
                  <span className="font-rajdhani text-sm text-jarvis-muted-blue">Technology</span>
                  <span className="font-rajdhani text-sm text-white">React + Vite</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-jarvis-cyan/10">
          <button
            onClick={handleSave}
            className="
              w-full flex items-center justify-center gap-2
              py-3 px-6 rounded-xl
              bg-gradient-to-r from-jarvis-cyan to-jarvis-deep-blue
              font-orbitron text-sm font-semibold text-white
              hover:opacity-90 transition-opacity
              glow-cyan
            "
          >
            <FloppyDisk size={18} weight="fill" />
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
