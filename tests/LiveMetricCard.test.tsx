import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import LiveMetricCard from '../src/components/LiveMetricCard';
import { HelpCircle } from 'lucide-react';

describe('LiveMetricCard Component', () => {
  it('should render label and values correctly', () => {
    render(
      <LiveMetricCard
        label="Test Metric"
        value={1500}
        unit="ppl"
        trend="up"
        trendValue={15}
        icon={<HelpCircle />}
      />
    );

    expect(screen.getByText('Test Metric')).toBeDefined();
    expect(screen.getByText('15%')).toBeDefined();
  });
});
