// ============================================================
// Match Card Component
// Lists matches with stadium names, times, flags, and stages
// ============================================================

import { MatchInfo } from '../types';
import { Calendar, MapPin, Tv } from 'lucide-react';

interface MatchCardProps {
  match: MatchInfo;
  isActive: boolean;
  onClick: () => void;
}

export default function MatchCard({ match, isActive, onClick }: MatchCardProps) {
  const date = new Date(match.kickoffTime);
  const formattedDate = date.toLocaleDateString([], { month: 'short', day: 'numeric', weekday: 'short' });
  const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div
      className={`glass-card ${isActive ? 'active' : ''}`}
      onClick={onClick}
      style={{
        cursor: 'pointer',
        borderLeft: isActive ? '3px solid var(--color-teal)' : '1px solid var(--glass-border)',
        padding: '12px var(--space-md)',
        transition: 'all 0.20s ease',
        background: isActive ? 'rgba(6,214,160,0.06)' : undefined,
      }}
      role="button"
      aria-pressed={isActive}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--color-gold)', fontWeight: 600 }}>{match.stage}</span>
        <span style={{ fontSize: '0.7rem', color: 'var(--color-text-tertiary)' }}>{match.group}</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
        <span style={{ fontSize: '1.25rem' }} role="img" aria-label="Home Flag">{match.homeFlag || '🏳️'}</span>
        <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{match.homeTeam}</span>
        <span style={{ color: 'var(--color-text-tertiary)', fontSize: '0.8rem' }}>vs</span>
        <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{match.awayTeam}</span>
        <span style={{ fontSize: '1.25rem' }} role="img" aria-label="Away Flag">{match.awayFlag || '🏳️'}</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Calendar size={12} style={{ color: 'var(--color-teal)' }} />
          <span>{formattedDate} • {formattedTime}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <MapPin size={12} style={{ color: 'var(--color-teal)' }} />
          <span>{match.venue}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--color-text-tertiary)', marginTop: '4px' }}>
          <Tv size={11} />
          <span>FIFA Live Network, Fox Sports, Telemundo</span>
        </div>
      </div>
    </div>
  );
}
