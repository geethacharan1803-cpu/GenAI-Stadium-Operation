import { ChatMessage as ChatMessageType } from '../types';
import { Bot, User } from 'lucide-react';

interface ChatMessageProps {
  message: ChatMessageType;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  const renderContent = (text: string) => {
    // Escape HTML tags to prevent XSS
    const escapedText = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');

    // Simple markdown rendering
    const html = escapedText
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/^### (.*$)/gm, '<h4 style="margin:8px 0 4px;color:#f0f0ff">$1</h4>')
      .replace(/^## (.*$)/gm, '<h3 style="margin:10px 0 6px;color:#f0f0ff">$1</h3>')
      .replace(/^- (.*$)/gm, '<li>$1</li>')
      .replace(/^\d+\. (.*$)/gm, '<li>$1</li>')
      .replace(/\n\n/g, '</p><p style="margin:6px 0">')
      .replace(/\n/g, '<br/>');

    return `<p style="margin:0">${html}</p>`;
  };

  return (
    <div className={`chat-message ${message.role}`} role="listitem">
      <div className={`chat-avatar ${message.role}`} aria-hidden="true">
        {isUser ? <User size={18} /> : <Bot size={18} />}
      </div>
      <div className="chat-bubble">
        {message.isStreaming && !message.content ? (
          <div className="typing-indicator" aria-label="AI is typing">
            <div className="typing-dot" />
            <div className="typing-dot" />
            <div className="typing-dot" />
          </div>
        ) : (
          <div dangerouslySetInnerHTML={{ __html: renderContent(message.content) }} />
        )}
      </div>
    </div>
  );
}
