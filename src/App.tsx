import React, { useState, useRef, useEffect, useCallback } from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import { Header } from './components/Header';
import { ChatMessage } from './components/ChatMessage';
import { VoiceButton, TextInputBar } from './components/VoiceButton';
import { SettingsPanel } from './components/SettingsPanel';
import { ArcReactorLogo } from './components/ArcReactorLogo';
import { useSpeechRecognition } from './hooks/useSpeechRecognition';
import { Gear } from '@phosphor-icons/react';
import './App.css';

const ChatInterface: React.FC = () => {
  const { state, dispatch, sendMessage, startRecording, stopRecording } = useAppContext();
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const {
    transcript,
    isListening,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition({
    onResult: (text) => {
      setInputValue(text);
    },
    onEnd: () => {
      if (transcript.trim()) {
        handleSend(transcript.trim());
        resetTranscript();
      }
    },
  });

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [state.messages, scrollToBottom]);

  const handleVoiceClick = () => {
    if (isListening) {
      stopListening();
      stopRecording();
    } else {
      startRecording();
      startListening();
    }
  };

  const handleSend = useCallback(
    async (text?: string) => {
      const messageText = text || inputValue.trim();
      if (messageText) {
        await sendMessage(messageText);
        setInputValue('');
        resetTranscript();
      }
    },
    [inputValue, sendMessage, resetTranscript]
  );

  const handleSettingsSave = () => {
    localStorage.setItem('jarvis_api_endpoint', state.settings.apiEndpoint);
    localStorage.setItem('jarvis_api_key', state.settings.apiKey);
  };

  const handleApiEndpointChange = (value: string) => {
    dispatch({ type: 'SET_API_ENDPOINT', payload: value });
  };

  const handleApiKeyChange = (value: string) => {
    dispatch({ type: 'SET_API_KEY', payload: value });
  };

  const toggleSettings = () => {
    dispatch({ type: 'TOGGLE_SETTINGS', payload: !state.isSettingsOpen });
  };

  return (
    <div className="flex flex-col h-full">
      <Header
        status={state.status}
        onSettingsClick={toggleSettings}
      />

      {/* Chat Area */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto px-4 py-6 space-y-4"
      >
        {state.messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <ArcReactorLogo size="lg" animated={true} />
            <h2 className="mt-6 font-orbitron text-2xl font-bold text-white">
              Hello, I'm JARVIS
            </h2>
            <p className="mt-2 font-rajdhani text-jarvis-muted-blue max-w-xs">
              Your personal AI assistant. How can I help you today?
            </p>
            {state.status === 'offline' && (
              <button
                onClick={toggleSettings}
                className="mt-6 flex items-center gap-2 px-6 py-3 rounded-xl bg-jarvis-dark-navy/50 border border-jarvis-cyan/30 hover:border-jarvis-cyan transition-colors"
              >
                <Gear size={18} color="#00D4FF" />
                <span className="font-orbitron text-sm text-jarvis-cyan">
                  Configure API
                </span>
              </button>
            )}
            {/* Quick suggestions */}
            <div className="mt-8 flex flex-wrap justify-center gap-2 max-w-md px-4">
              {[
                'Help me write an email',
                'Explain quantum computing',
                'Write a poem about AI',
                'Debug my code',
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => handleSend(suggestion)}
                  className="px-4 py-2 rounded-full text-sm font-rajdhani text-jarvis-muted-blue bg-jarvis-dark-navy/30 border border-jarvis-cyan/10 hover:border-jarvis-cyan/30 hover:text-white transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {state.messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                isLoading={
                  message.role === 'assistant' &&
                  message.content === '' &&
                  state.isProcessing
                }
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <div className="px-4 pb-6 pt-2 safe-area-inset">
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <TextInputBar
              value={inputValue}
              onChange={setInputValue}
              onSend={() => handleSend()}
              isDisabled={state.isProcessing}
            />
          </div>
          <VoiceButton
            isRecording={isListening}
            isDisabled={!isSupported || state.isProcessing}
            onClick={handleVoiceClick}
          />
        </div>
        {!isSupported && (
          <p className="mt-2 text-xs text-center text-jarvis-muted-blue/60">
            Voice recognition not supported in this browser. Type your message instead.
          </p>
        )}
      </div>

      {/* Settings Panel */}
      <SettingsPanel
        isOpen={state.isSettingsOpen}
        onClose={toggleSettings}
        apiEndpoint={state.settings.apiEndpoint}
        apiKey={state.settings.apiKey}
        onApiEndpointChange={handleApiEndpointChange}
        onApiKeyChange={handleApiKeyChange}
        onSave={handleSettingsSave}
      />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <div className="h-screen h-[100dvh] flex flex-col bg-gradient-to-br from-jarvis-navy-black via-jarvis-dark-navy to-jarvis-navy-black">
        <ChatInterface />
      </div>
    </AppProvider>
  );
};

export default App;
