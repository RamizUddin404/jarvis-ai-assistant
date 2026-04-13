import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Copy, Check, User, Robot } from '@phosphor-icons/react';

interface ChatMessageProps {
  message: {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp?: Date;
  };
  isLoading?: boolean;
  className?: string;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  isLoading = false,
  className = '',
}) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const formatTime = (date?: Date) => {
    if (!date) return '';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div
      className={`
        flex ${isUser ? 'justify-end' : 'justify-start'}
        animate-slide-up
        ${className}
      `}
    >
      <div
        className={`
          max-w-[85%] flex gap-3 items-start
          ${isUser ? 'flex-row-reverse' : 'flex-row'}
        `}
      >
        {/* Avatar */}
        <div
          className={`
            flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
            ${isUser
              ? 'bg-gradient-to-br from-jarvis-cyan to-jarvis-deep-blue'
              : 'bg-jarvis-dark-navy border border-jarvis-cyan/30'
            }
          `}
        >
          {isUser ? (
            <User size={16} color="white" weight="fill" />
          ) : (
            <Robot size={16} color="#00D4FF" weight="fill" />
          )}
        </div>

        {/* Message bubble */}
        <div
          className={`
            relative px-4 py-3 rounded-2xl
            ${isUser
              ? 'bg-gradient-to-br from-jarvis-cyan to-jarvis-deep-blue rounded-br-md'
              : 'bg-jarvis-dark-navy/80 border border-jarvis-cyan/20 rounded-bl-md'
            }
          `}
        >
          {/* Message content */}
          {isLoading ? (
            <div className="flex items-center gap-1.5 py-1">
              <div className="w-2 h-2 rounded-full bg-jarvis-cyan typing-dot" />
              <div className="w-2 h-2 rounded-full bg-jarvis-cyan typing-dot" />
              <div className="w-2 h-2 rounded-full bg-jarvis-cyan typing-dot" />
            </div>
          ) : isUser ? (
            <p className="text-white font-rajdhani text-base leading-relaxed whitespace-pre-wrap">
              {message.content}
            </p>
          ) : (
            <div className="markdown-content">
              <ReactMarkdown
                components={{
                  p: ({ children }) => (
                    <p className="text-white font-rajdhani text-base leading-relaxed mb-2 last:mb-0">
                      {children}
                    </p>
                  ),
                  h1: ({ children }) => (
                    <h1 className="text-xl font-orbitron font-bold text-jarvis-cyan mb-2 mt-4 first:mt-0">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-lg font-orbitron font-semibold text-jarvis-cyan mb-2 mt-3 first:mt-0">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-base font-orbitron font-medium text-white mb-2 mt-2 first:mt-0">
                      {children}
                    </h3>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside mb-2 space-y-1 text-jarvis-muted-blue">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-inside mb-2 space-y-1 text-jarvis-muted-blue">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li className="text-white/90">{children}</li>
                  ),
                  code: ({ className, children, ...props }) => {
                    const isInline = !className;
                    if (isInline) {
                      return (
                        <code
                          className="bg-jarvis-navy-black/50 px-1.5 py-0.5 rounded text-jarvis-cyan text-sm font-mono"
                          {...props}
                        >
                          {children}
                        </code>
                      );
                    }
                    return (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  },
                  pre: ({ children }) => (
                    <pre className="bg-jarvis-navy-black/70 border border-jarvis-cyan/20 rounded-lg p-3 overflow-x-auto my-3 relative group">
                      {children}
                      <button
                        onClick={handleCopy}
                        className="absolute top-2 right-2 p-2 rounded-lg bg-jarvis-light-navy/50 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-jarvis-light-navy"
                        title="Copy code"
                      >
                        {copied ? (
                          <Check size={14} color="#00FF88" weight="bold" />
                        ) : (
                          <Copy size={14} color="#8892B0" />
                        )}
                      </button>
                    </pre>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-2 border-jarvis-cyan/50 pl-3 my-2 text-jarvis-muted-blue italic">
                      {children}
                    </blockquote>
                  ),
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-jarvis-cyan underline hover:text-jarvis-deep-blue transition-colors"
                    >
                      {children}
                    </a>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-semibold text-white">{children}</strong>
                  ),
                  em: ({ children }) => (
                    <em className="italic text-jarvis-muted-blue">{children}</em>
                  ),
                  hr: () => <hr className="border-jarvis-cyan/20 my-4" />,
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}

          {/* Timestamp */}
          {message.timestamp && !isLoading && (
            <div className={`
              absolute -bottom-5 ${isUser ? 'right-3' : 'left-3'}
              text-[10px] text-jarvis-muted-blue/60 font-rajdhani
            `}>
              {formatTime(message.timestamp)}
            </div>
          )}

          {/* Copy button for AI messages */}
          {isAssistant && !isLoading && (
            <button
              onClick={handleCopy}
              className="absolute -top-3 right-2 p-1.5 rounded-full bg-jarvis-dark-navy border border-jarvis-cyan/30 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-jarvis-light-navy"
              title="Copy response"
            >
              {copied ? (
                <Check size={12} color="#00FF88" weight="bold" />
              ) : (
                <Copy size={12} color="#8892B0" />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
