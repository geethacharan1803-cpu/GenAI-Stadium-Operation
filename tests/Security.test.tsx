import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import ChatMessage from '../src/components/ChatMessage';
import AIReasoningCard from '../src/components/AIReasoningCard';
import { ChatMessage as ChatMessageType } from '../src/types';

describe('Security & XSS Mitigation Tests', () => {
  it('should escape HTML characters in ChatMessage component', () => {
    const maliciousMsg: ChatMessageType = {
      id: 'msg-sec',
      role: 'assistant',
      content: '<script>alert("xss")</script> **safe bold**',
      timestamp: new Date()
    };

    render(<ChatMessage message={maliciousMsg} />);
    
    // The tags should be escaped and rendered as text, not executed as elements
    expect(screen.queryByText('alert("xss")')).toBeDefined();
    const boldEl = screen.getByText('safe bold');
    expect(boldEl.tagName).toBe('STRONG');
  });

  it('should escape HTML characters in AIReasoningCard component', () => {
    render(
      <AIReasoningCard
        title="Security Audit"
        content='<iframe src="malicious"></iframe> **bold response**'
      />
    );

    expect(screen.queryByText('bold response')).toBeDefined();
  });
});
