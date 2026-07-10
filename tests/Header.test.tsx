import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import Header from '../src/components/Header';
import { AppProvider } from '../src/context/AppContext';

describe('Header Component', () => {
  it('should render header with live badge and API connection status', () => {
    const handleToggle = () => {};
    render(
      <AppProvider>
        <Header onToggleSidebar={handleToggle} />
      </AppProvider>
    );

    expect(screen.getByText('Live')).toBeDefined();
    expect(screen.getByText('○ AI Not Connected')).toBeDefined();
  });
});
