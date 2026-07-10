import { Sparkles } from 'lucide-react';
import { useState } from 'react';

interface AIReasoningCardProps {
  title: string;
  content: string;
  isLoading?: boolean;
  tag?: string;
}

export default function AIReasoningCard({ title, content, isLoading = false, tag = 'AI Analysis' }: AIReasoningCardProps) {
  const [expanded, setExpanded] = useState(true);

  // Simple markdown-to-HTML conversion
  const renderContent = (text: string) => {
    // Escape HTML tags to prevent XSS
    const escapedText = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');

    return escapedText
      .split('\n')
      .map((line, i) => {
        // Bold
        line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        // Headers
        if (line.startsWith('### ')) return `<h4 style="margin:8px 0 4px;color:#f0f0ff;font-size:0.9rem">${line.slice(4)}</h4>`;
        if (line.startsWith('## ')) return `<h3 style="margin:12px 0 6px;color:#f0f0ff;font-size:1rem">${line.slice(3)}</h3>`;
        if (line.startsWith('# ')) return `<h2 style="margin:12px 0 6px;color:#f0f0ff;font-size:1.1rem">${line.slice(2)}</h2>`;
        // List items
        if (line.startsWith('- ') || line.startsWith('* ')) return `<li>${line.slice(2)}</li>`;
        if (/^\d+\.\s/.test(line)) return `<li>${line.replace(/^\d+\.\s/, '')}</li>`;
        // Empty line
        if (!line.trim()) return '<br/>';
        return `<p style="margin:2px 0">${line}</p>`;
      })
      .join('');
  };

  return (
    <div className="glass-card ai-reasoning-card no-hover">
      <div className="glass-card-header">
        <div>
          <div className="ai-tag">
            <Sparkles size={14} />
            {tag}
          </div>
          <div className="glass-card-title">{title}</div>
        </div>
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
        >
          {expanded ? 'Collapse' : 'Expand'}
        </button>
      </div>

      {expanded && (
        <div className="ai-reasoning-content animate-fade-in">
          {isLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div className="loading-shimmer" style={{ height: '16px', width: '90%' }} />
              <div className="loading-shimmer" style={{ height: '16px', width: '75%' }} />
              <div className="loading-shimmer" style={{ height: '16px', width: '85%' }} />
              <div className="loading-shimmer" style={{ height: '16px', width: '60%' }} />
            </div>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: renderContent(content) }} />
          )}
        </div>
      )}
    </div>
  );
}
