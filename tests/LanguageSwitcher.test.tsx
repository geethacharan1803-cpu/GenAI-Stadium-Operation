import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import LanguageSwitcher from '../src/components/LanguageSwitcher';
import { AppProvider } from '../src/context/AppContext';

describe('LanguageSwitcher Component', () => {
  it('should render all three language toggle buttons (EN, ES, FR)', () => {
    render(
      <AppProvider>
        <LanguageSwitcher />
      </AppProvider>
    );

    expect(screen.getByLabelText('Switch to English')).toBeDefined();
    expect(screen.getByLabelText('Switch to Español')).toBeDefined();
    expect(screen.getByLabelText('Switch to Français')).toBeDefined();
  });

  it('should allow toggling between language options', () => {
    render(
      <AppProvider>
        <LanguageSwitcher />
      </AppProvider>
    );

    const esButton = screen.getByLabelText('Switch to Español');
    fireEvent.click(esButton);

    // Verify it has active styling class or is selected
    expect(esButton.className).toContain('btn-primary');
  });
});
