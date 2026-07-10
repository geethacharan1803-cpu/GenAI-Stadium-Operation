import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Sidebar from '../src/components/Sidebar';
import { AppProvider } from '../src/context/AppContext';

describe('Sidebar Component', () => {
  it('should render all navigation links and brand title', () => {
    const handleClose = () => {};
    render(
      <BrowserRouter>
        <AppProvider>
          <Sidebar isOpen={true} onClose={handleClose} />
        </AppProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('Stadium AI')).toBeDefined();
    expect(screen.getByText('FIFA 2026')).toBeDefined();
  });
});
