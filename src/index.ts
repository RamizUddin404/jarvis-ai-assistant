// Components barrel export
export { ArcReactorLogo } from './components/ArcReactorLogo';
export { ChatMessage } from './components/ChatMessage';
export { ErrorBoundary } from './components/ErrorBoundary';
export { Header } from './components/Header';
export { SettingsPanel } from './components/SettingsPanel';
export { StatusBadge } from './components/StatusBadge';
export { VoiceButton, TextInputBar } from './components/VoiceButton';
export type { ToastVariant, Toast } from './components/Toast';
export { ToastContainer, ToastProvider, useToast } from './components/Toast';
export { TypingIndicator, WaveformIndicator, PulsingDots, RotatingRing, LoadingSkeleton } from './components/TypingIndicator';

// Hooks barrel export
export { useSpeechRecognition } from './hooks/useSpeechRecognition';
export { useChat } from './hooks/useChat';
export type { Message, UseChatOptions, UseChatReturn } from './hooks/useChat';
export { useIsMobile } from './hooks/use-mobile';

// Context barrel export
export { AppProvider, useAppContext } from './context/AppContext';
export type { AppContextType, AppState } from './context/AppContext';

// Utils barrel export
export { cn } from './lib/utils';
