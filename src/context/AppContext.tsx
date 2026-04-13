import React, { createContext, useContext, useReducer, ReactNode, useCallback, useEffect } from 'react';
import { Settings } from 'lucide-react';

// Types
export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface AppState {
  messages: Message[];
  isRecording: boolean;
  isProcessing: boolean;
  status: 'online' | 'offline' | 'connecting';
  settings: {
    apiEndpoint: string;
    apiKey: string;
  };
  isSettingsOpen: boolean;
  error: string | null;
}

type AppAction =
  | { type: 'SET_MESSAGES'; payload: Message[] }
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'UPDATE_MESSAGE'; payload: { id: string; content: string } }
  | { type: 'SET_RECORDING'; payload: boolean }
  | { type: 'SET_PROCESSING'; payload: boolean }
  | { type: 'SET_STATUS'; payload: 'online' | 'offline' | 'connecting' }
  | { type: 'SET_API_ENDPOINT'; payload: string }
  | { type: 'SET_API_KEY'; payload: string }
  | { type: 'TOGGLE_SETTINGS'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_MESSAGES' };

const initialState: AppState = {
  messages: [],
  isRecording: false,
  isProcessing: false,
  status: 'offline',
  settings: {
    apiEndpoint: localStorage.getItem('jarvis_api_endpoint') || '',
    apiKey: localStorage.getItem('jarvis_api_key') || '',
  },
  isSettingsOpen: false,
  error: null,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_MESSAGES':
      return { ...state, messages: action.payload };
    case 'ADD_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload] };
    case 'UPDATE_MESSAGE':
      return {
        ...state,
        messages: state.messages.map((msg) =>
          msg.id === action.payload.id ? { ...msg, content: action.payload.content } : msg
        ),
      };
    case 'SET_RECORDING':
      return { ...state, isRecording: action.payload };
    case 'SET_PROCESSING':
      return { ...state, isProcessing: action.payload };
    case 'SET_STATUS':
      return { ...state, status: action.payload };
    case 'SET_API_ENDPOINT':
      return {
        ...state,
        settings: { ...state.settings, apiEndpoint: action.payload },
      };
    case 'SET_API_KEY':
      return {
        ...state,
        settings: { ...state.settings, apiKey: action.payload },
      };
    case 'TOGGLE_SETTINGS':
      return { ...state, isSettingsOpen: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'CLEAR_MESSAGES':
      return { ...state, messages: [] };
    default:
      return state;
  }
}

// Context
export interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  sendMessage: (content: string) => Promise<void>;
  startRecording: () => void;
  stopRecording: () => void;
}

export const AppContext = createContext<AppContextType | null>(null);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Check online status
  useEffect(() => {
    const updateStatus = () => {
      if (state.settings.apiEndpoint && state.settings.apiKey) {
        dispatch({ type: 'SET_STATUS', payload: 'online' });
      } else {
        dispatch({ type: 'SET_STATUS', payload: 'offline' });
      }
    };

    updateStatus();
  }, [state.settings.apiEndpoint, state.settings.apiKey]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || !state.settings.apiEndpoint || !state.settings.apiKey) {
        return;
      }

      const userMessage: Message = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: content.trim(),
        timestamp: new Date(),
      };

      dispatch({ type: 'ADD_MESSAGE', payload: userMessage });
      dispatch({ type: 'SET_PROCESSING', payload: true });

      const assistantMessageId = `assistant-${Date.now()}`;
      const assistantMessage: Message = {
        id: assistantMessageId,
        role: 'assistant',
        content: '',
        timestamp: new Date(),
      };

      dispatch({ type: 'ADD_MESSAGE', payload: assistantMessage });

      try {
        const messagesHistory = [...state.messages, userMessage].map((msg) => ({
          role: msg.role,
          content: msg.content,
        }));

        const response = await fetch(state.settings.apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${state.settings.apiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: messagesHistory,
            stream: false,
          }),
        });

        if (!response.ok) {
          throw new Error(`API request failed: ${response.status}`);
        }

        const data = await response.json();
        const assistantContent = data.choices?.[0]?.message?.content || 'I apologize, but I could not process your request.';

        dispatch({
          type: 'UPDATE_MESSAGE',
          payload: { id: assistantMessageId, content: assistantContent },
        });
      } catch (error) {
        dispatch({
          type: 'UPDATE_MESSAGE',
          payload: {
            id: assistantMessageId,
            content: `I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}. Please check your API settings and try again.`,
          },
        });
        dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' });
      } finally {
        dispatch({ type: 'SET_PROCESSING', payload: false });
      }
    },
    [state.messages, state.settings]
  );

  const startRecording = useCallback(() => {
    dispatch({ type: 'SET_RECORDING', payload: true });
  }, []);

  const stopRecording = useCallback(() => {
    dispatch({ type: 'SET_RECORDING', payload: false });
  }, []);

  return (
    <AppContext.Provider
      value={{
        state,
        dispatch,
        sendMessage,
        startRecording,
        stopRecording,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
