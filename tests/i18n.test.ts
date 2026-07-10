// ============================================================
// Translation Engine Unit Tests
// ============================================================

import { describe, it, expect } from 'vitest';
import { getLanguageForStadium } from '../src/i18n';

describe('i18n Language Selector', () => {
  it('should auto-detect language based on stadium country', () => {
    expect(getLanguageForStadium('Mexico')).toBe('es');
    expect(getLanguageForStadium('México')).toBe('es');
    expect(getLanguageForStadium('Canada')).toBe('fr');
    expect(getLanguageForStadium('USA')).toBe('en');
    expect(getLanguageForStadium('United States')).toBe('en');
  });
});
