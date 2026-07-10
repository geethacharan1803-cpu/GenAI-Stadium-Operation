// ============================================================
// Language Switcher Component
// Flag-based UI toggles for English, Spanish, and French
// ============================================================

import { useApp } from '../context/AppContext';
import { LanguageCode } from '../types';

export default function LanguageSwitcher() {
  const { state, dispatch } = useApp();
  const currentLang = state.language;

  const languages: { code: LanguageCode; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'es', label: 'Español', flag: '🇲🇽' },
    { code: 'fr', label: 'Français', flag: '🇨🇦' },
  ];

  const handleLanguageChange = (code: LanguageCode) => {
    dispatch({ type: 'SET_LANGUAGE', payload: code });
  };

  return (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }} role="group" aria-label="Language Selector">
      {languages.map(lang => (
        <button
          key={lang.code}
          className={`btn btn-sm ${currentLang === lang.code ? 'btn-primary' : 'btn-secondary'}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '4px 8px',
            minWidth: 'auto',
          }}
          onClick={() => handleLanguageChange(lang.code)}
          aria-label={`Switch to ${lang.label}`}
        >
          <span style={{ fontSize: '1rem' }} role="img" aria-hidden="true">{lang.flag}</span>
          <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{lang.code.toUpperCase()}</span>
        </button>
      ))}
    </div>
  );
}
