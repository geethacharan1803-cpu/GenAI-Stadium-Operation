import { useApp } from '../context/AppContext';
import { Menu } from 'lucide-react';
import { isApiKeyValid } from '../services/geminiService';
import LanguageSwitcher from './LanguageSwitcher';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export default function Header({ onToggleSidebar }: HeaderProps) {
  const { state } = useApp();
  const { matchInfo, apiKey } = state;

  return (
    <header className="header" role="banner">
      <div className="header-left">
        <button
          className="mobile-menu-btn btn-ghost btn-icon"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation menu"
        >
          <Menu size={22} />
        </button>

        <div className="header-match">
          <div className="header-match-teams">
            {matchInfo.homeTeam} vs {matchInfo.awayTeam}
          </div>
          <span className="header-match-stage">{matchInfo.stage}</span>
        </div>
      </div>

      <div className="header-right">
        <LanguageSwitcher />

        <div className="header-live-badge" aria-live="polite">
          <span className="header-live-dot" />
          <span>Live</span>
        </div>

        <span
          className={`header-api-status ${isApiKeyValid(apiKey) ? 'connected' : 'disconnected'}`}
        >
          {isApiKeyValid(apiKey) ? '✦ AI Connected' : '○ AI Not Connected'}
        </span>
      </div>
    </header>
  );
}
