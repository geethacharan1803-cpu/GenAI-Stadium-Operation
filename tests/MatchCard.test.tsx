import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import MatchCard from '../src/components/MatchCard';
import { MatchInfo } from '../src/types';

const mockMatch: MatchInfo = {
  id: 'm-1',
  homeTeam: 'USA',
  awayTeam: 'Brazil',
  kickoffTime: '2026-06-12T19:00:00-04:00',
  venue: 'MetLife Stadium',
  stage: 'Group Stage',
  matchDay: 'Matchday 1',
  homeFlag: '🇺🇸',
  awayFlag: '🇧🇷',
  group: 'Group A',
};

describe('MatchCard Component', () => {
  it('should render home and away teams and flags correctly', () => {
    const handleClick = vi.fn();
    render(
      <MatchCard
        match={mockMatch}
        isActive={false}
        onClick={handleClick}
      />
    );

    expect(screen.getByText('USA')).toBeDefined();
    expect(screen.getByText('Brazil')).toBeDefined();
    expect(screen.getByText('Group Stage')).toBeDefined();
    expect(screen.getByText('MetLife Stadium')).toBeDefined();
  });
});
