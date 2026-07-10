import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import CrowdHeatmap from '../src/components/CrowdHeatmap';
import { getDefaultStadium } from '../src/utils/stadiumData';
import { generateCrowdSnapshot } from '../src/context/CrowdSimulator';

describe('CrowdHeatmap Component', () => {
  it('should render heatmap with zones', () => {
    const stadium = getDefaultStadium();
    const crowdData = generateCrowdSnapshot(stadium);

    render(<CrowdHeatmap stadium={stadium} crowdData={crowdData} />);
    
    // Check if the outer container renders
    expect(screen.getByRole('img', { name: /heatmap/i })).toBeDefined();
  });
});
