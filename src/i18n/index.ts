// ============================================================
// Internationalization (i18n) Engine
// Multi-language translation helper with auto-detection
// ============================================================

import { useApp } from '../context/AppContext';
import { en } from './en';
import { es } from './es';
import { fr } from './fr';

export const translations = { en, es, fr };

export function useTranslation() {
  const { state } = useApp();
  const lang = state.language || 'en';
  const dict = translations[lang] || en;

  const t = (key: keyof typeof en): string => {
    return dict[key] || en[key] || String(key);
  };

  return { t, currentLanguage: lang };
}

/** Auto-detects the regional language for a stadium */
export function getLanguageForStadium(country: string): 'en' | 'es' | 'fr' {
  const c = country.toLowerCase();
  if (c === 'mexico' || c === 'méxico') return 'es';
  if (c === 'canada' || c === 'canada') return 'fr';
  return 'en';
}
