// ============================================================
// Stadium Data Unit Tests
// ============================================================

import { describe, it, expect } from 'vitest';
import { getStadiumById, getDefaultStadium, FIFA_2026_STADIUMS } from '../src/utils/stadiumData';

describe('Stadium Data Configuration', () => {
  it('should load default stadium', () => {
    const stadium = getDefaultStadium();
    expect(stadium).toBeDefined();
    expect(stadium.id).toBe('metlife');
  });

  it('should find stadium by id', () => {
    const metlife = getStadiumById('metlife');
    expect(metlife).toBeDefined();
    expect(metlife?.name).toBe('MetLife Stadium');

    const invalid = getStadiumById('invalid-id');
    expect(invalid).toBeUndefined();
  });

  it('should verify all stadiums contain coordinates', () => {
    FIFA_2026_STADIUMS.forEach(stadium => {
      expect(stadium.latitude).toBeGreaterThan(-90);
      expect(stadium.latitude).toBeLessThan(90);
      expect(stadium.longitude).toBeGreaterThan(-180);
      expect(stadium.longitude).toBeLessThan(180);
    });
  });
});
