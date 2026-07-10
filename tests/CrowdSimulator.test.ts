// ============================================================
// Crowd Simulator Unit Tests
// ============================================================

import { describe, it, expect } from 'vitest';
import { generateCrowdSnapshot } from '../src/context/CrowdSimulator';
import { getDefaultStadium } from '../src/utils/stadiumData';

describe('Crowd Simulation Engine', () => {
  it('should generate a valid crowd snapshot bounds', () => {
    const stadium = getDefaultStadium();
    const snapshot = generateCrowdSnapshot(stadium);

    expect(snapshot).toBeDefined();
    expect(snapshot.totalAttendance).toBeGreaterThanOrEqual(0);
    expect(snapshot.totalAttendance).toBeLessThanOrEqual(stadium.capacity);
    expect(snapshot.gateData.length).toBe(stadium.gates.length);
  });

  it('should restrict load percentages to bounds [0, 100]', () => {
    const stadium = getDefaultStadium();
    const snapshot = generateCrowdSnapshot(stadium);

    snapshot.gateData.forEach(gate => {
      expect(gate.load).toBeGreaterThanOrEqual(0);
      expect(gate.load).toBeLessThanOrEqual(100);
    });
  });
});
