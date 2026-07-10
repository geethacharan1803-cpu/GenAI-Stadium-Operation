import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import StadiumBlueprint from '../src/components/StadiumBlueprint';
import { AppProvider } from '../src/context/AppContext';

describe('StadiumBlueprint Component', () => {
  it('should render SVG blueprint layout element', () => {
    const handleSectionClick = vi.fn();
    render(
      <AppProvider>
        <StadiumBlueprint stadiumId="metlife" onSectionClick={handleSectionClick} />
      </AppProvider>
    );

    expect(screen.getByText('Stadium Layout Blueprint')).toBeDefined();
  });
});
