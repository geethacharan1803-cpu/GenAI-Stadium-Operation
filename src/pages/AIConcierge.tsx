import { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import ChatMessageComponent from '../components/ChatMessage';
import { streamChatResponse, isApiKeyValid } from '../services/geminiService';
import { ChatMessage } from '../types';
import { Send, Trash2 } from 'lucide-react';

const QUICK_PROMPTS = [
  "What's the best time to grab food?",
  "How crowded is the stadium right now?",
  "Which gate has the shortest wait?",
  "Where's the nearest restroom?",
  "Any safety alerts I should know about?",
  "Recommend the best exit after the match",
  "Where can I buy official merchandise?",
  "What's the current crowd prediction?",
];

export default function AIConcierge() {
  const { state } = useApp();
  const navigate = useNavigate();
  const { selectedStadium, crowdData, matchInfo, apiKey } = state;

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Welcome to the **${selectedStadium.name}** AI Concierge! 🏟️⚽\n\nI'm your personal match-day assistant for **${matchInfo.homeTeam} vs ${matchInfo.awayTeam}** (${matchInfo.stage}).\n\nI have real-time access to crowd data, gate status, and amenity information. Ask me anything about:\n- **Navigation**: Best gates, routes, and nearby facilities\n- **Crowd conditions**: Real-time density and predictions\n- **Match day tips**: Food, merchandise, restrooms, and more\n\nHow can I help you today?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = useCallback(async (text?: string) => {
    const userText = (text || input).trim();
    if (!userText || !isApiKeyValid(apiKey) || isStreaming) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: userText,
      timestamp: new Date(),
    };

    const assistantMsg: ChatMessage = {
      id: `ai-${Date.now()}`,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isStreaming: true,
    };

    setMessages(prev => [...prev, userMsg, assistantMsg]);
    setInput('');
    setIsStreaming(true);

    try {
      const chatHistory = messages
        .filter(m => m.role !== 'system')
        .map(m => ({ role: m.role, content: m.content }));

      let fullResponse = '';

      for await (const chunk of streamChatResponse(
        apiKey!,
        userText,
        chatHistory,
        selectedStadium,
        crowdData,
        matchInfo
      )) {
        fullResponse += chunk;
        setMessages(prev =>
          prev.map(m =>
            m.id === assistantMsg.id
              ? { ...m, content: fullResponse, isStreaming: true }
              : m
          )
        );
      }

      // Mark streaming as done
      setMessages(prev =>
        prev.map(m =>
          m.id === assistantMsg.id
            ? { ...m, content: fullResponse, isStreaming: false }
            : m
        )
      );
    } catch (err) {
      setMessages(prev =>
        prev.map(m =>
          m.id === assistantMsg.id
            ? {
                ...m,
                content: 'Sorry, I encountered an error generating a response. Please check your API key and try again.',
                isStreaming: false,
              }
            : m
        )
      );
    }

    setIsStreaming(false);
    inputRef.current?.focus();
  }, [input, apiKey, isStreaming, messages, selectedStadium, crowdData, matchInfo]);

  const clearChat = () => {
    setMessages([
      {
        id: 'welcome-new',
        role: 'assistant',
        content: `Chat cleared. I'm still here to help! Ask me anything about the match day at **${selectedStadium.name}**. 🏟️`,
        timestamp: new Date(),
      },
    ]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isApiKeyValid(apiKey)) {
    return (
      <div className="animate-fade-in">
        <div className="page-header">
          <h2 className="page-title">🤖 AI Concierge</h2>
          <p className="page-subtitle">Your personal match-day assistant</p>
        </div>
        <div className="api-key-prompt" style={{ maxWidth: 500, margin: '60px auto' }}>
          <h3>🔑 API Key Required</h3>
          <p>Connect your Gemini API key to chat with the AI Concierge. It has real-time access to crowd data, gate status, and amenity information.</p>
          <button className="btn btn-primary" style={{ marginTop: '16px' }} onClick={() => navigate('/settings')}>
            Go to Settings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 className="page-title">🤖 AI Concierge</h2>
          <p className="page-subtitle">
            Chat with your personal match-day assistant — powered by live stadium data
          </p>
        </div>
        <button className="btn btn-danger btn-sm" onClick={clearChat}>
          <Trash2 size={14} /> Clear Chat
        </button>
      </div>

      <div className="glass-card no-hover chat-container">
        {/* Quick Prompts */}
        <div className="quick-prompts">
          {QUICK_PROMPTS.map((prompt, i) => (
            <button
              key={i}
              className="quick-prompt"
              onClick={() => sendMessage(prompt)}
              disabled={isStreaming}
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Messages */}
        <div className="chat-messages" role="list" aria-label="Chat messages">
          {messages.map(msg => (
            <ChatMessageComponent key={msg.id} message={msg} />
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="chat-input-area">
          <textarea
            ref={inputRef}
            className="chat-input"
            placeholder="Ask anything about the stadium, crowds, directions..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            disabled={isStreaming}
            aria-label="Chat message input"
          />
          <button
            className="chat-send-btn"
            onClick={() => sendMessage()}
            disabled={!input.trim() || isStreaming}
            aria-label="Send message"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
