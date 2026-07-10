// ============================================================
// Match Schedule Page
// Fully interactive tournament schedule list & stadium blueprints
// ============================================================

import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../i18n';
import MatchCard from '../components/MatchCard';
import StadiumBlueprint from '../components/StadiumBlueprint';
import AIReasoningCard from '../components/AIReasoningCard';
import { MATCH_SCHEDULE_DB } from '../utils/matchSchedule';
import { FIFA_2026_STADIUMS } from '../utils/stadiumData';
import { getNavigationRecommendation, isApiKeyValid } from '../services/geminiService';
import { Calendar, Building, HelpCircle, Users } from 'lucide-react';

export default function MatchSchedule() {
  const { t } = useTranslation();
  const { state, dispatch } = useApp();
  const { selectedStadium, crowdData, apiKey } = state;

  const [activeMatchId, setActiveMatchId] = useState<string>(MATCH_SCHEDULE_DB[0].id);
  const [filterStage, setFilterStage] = useState<string>('all');
  const [filterCountry, setFilterCountry] = useState<string>('all');
  const [aiAdvice, setAiAdvice] = useState<string>('');
  const [aiLoading, setAiLoading] = useState<boolean>(false);

  // Get active match details
  const activeMatch = useMemo(() => {
    return MATCH_SCHEDULE_DB.find(m => m.id === activeMatchId) || MATCH_SCHEDULE_DB[0];
  }, [activeMatchId]);

  // Find stadium linked to active match
  const activeStadium = useMemo(() => {
    return FIFA_2026_STADIUMS.find(s => s.name === activeMatch.venue) || selectedStadium;
  }, [activeMatch, selectedStadium]);

  // Filter stage stages
  const stages = useMemo(() => {
    const set = new Set(MATCH_SCHEDULE_DB.map(m => m.stage));
    return ['all', ...Array.from(set)];
  }, []);

  // Filter matches
  const filteredMatches = useMemo(() => {
    return MATCH_SCHEDULE_DB.filter(m => {
      const matchStage = filterStage === 'all' || m.stage === filterStage;
      const stadium = FIFA_2026_STADIUMS.find(s => s.name === m.venue);
      const matchCountry = filterCountry === 'all' || (stadium && stadium.country.toLowerCase() === filterCountry.toLowerCase());
      return matchStage && matchCountry;
    });
  }, [filterStage, filterCountry]);

  const handleMatchSelect = (matchId: string, venueName: string) => {
    setActiveMatchId(matchId);
    // Find stadium corresponding to venueName and dispatch
    const stadium = FIFA_2026_STADIUMS.find(s => s.name === venueName);
    if (stadium) {
      dispatch({ type: 'SET_STADIUM', payload: stadium.id });
    }
  };

  const requestAIAdvice = async () => {
    if (!isApiKeyValid(apiKey)) return;
    setAiLoading(true);
    setAiAdvice('');
    try {
      const query = `Provide a comprehensive match day briefing for the game between ${activeMatch.homeTeam} and ${activeMatch.awayTeam} at ${activeStadium.name}. Discuss capacity of ${activeStadium.capacity.toLocaleString()}, expected crowd safety concerns, entry logistics, and local weather/vibe.`;
      const response = await getNavigationRecommendation(apiKey!, activeStadium, crowdData, activeMatch, query);
      setAiAdvice(response);
    } catch {
      setAiAdvice('Could not load AI guidance. Please try again.');
    }
    setAiLoading(false);
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h2 className="page-title">📅 FIFA 2026 Match Schedule</h2>
        <p className="page-subtitle">Complete tournament brackets, stadium capacities, and section-by-section layouts</p>
      </div>

      {/* Filters */}
      <div className="glass-card no-hover" style={{ marginBottom: 'var(--space-lg)', display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap', padding: '12px var(--space-lg)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Filter Stage:</span>
          <select value={filterStage} onChange={e => setFilterStage(e.target.value)} className="settings-select" style={{ maxWidth: '200px', padding: '4px 10px', fontSize: '0.8rem' }}>
            {stages.map(stage => (
              <option key={stage} value={stage}>{stage === 'all' ? 'All Stages' : stage}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Filter Host Country:</span>
          <select value={filterCountry} onChange={e => setFilterCountry(e.target.value)} className="settings-select" style={{ maxWidth: '200px', padding: '4px 10px', fontSize: '0.8rem' }}>
            <option value="all">All Countries</option>
            <option value="usa">United States</option>
            <option value="mexico">Mexico</option>
            <option value="canada">Canada</option>
          </select>
        </div>
      </div>

      <div className="grid-1-2">
        {/* Left Schedule Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)', maxHeight: 'calc(100vh - 280px)', overflowY: 'auto', paddingRight: '6px' }}>
          {filteredMatches.length === 0 ? (
            <div className="glass-card no-hover" style={{ textAlign: 'center', padding: '40px' }}>
              <HelpCircle size={32} style={{ color: 'var(--color-text-tertiary)', marginBottom: '8px' }} />
              <p>No matches match the filters.</p>
            </div>
          ) : (
            filteredMatches.map(match => (
              <MatchCard
                key={match.id}
                match={match}
                isActive={match.id === activeMatchId}
                onClick={() => handleMatchSelect(match.id, match.venue)}
              />
            ))
          )}
        </div>

        {/* Right Details Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
          {/* Active Stadium Details */}
          <div className="glass-card no-hover">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--glass-border)', paddingBottom: '10px', marginBottom: '12px' }}>
              <div>
                <span className="density-badge moderate" style={{ marginBottom: '4px' }}>
                  {activeStadium.city}, {activeStadium.country}
                </span>
                <h3 className="page-title" style={{ fontSize: '1.4rem' }}>{activeStadium.name}</h3>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)', display: 'block' }}>Capacity</span>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--color-gold)' }}>
                  {activeStadium.capacity.toLocaleString()}
                </span>
              </div>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: '12px' }}>
              {activeStadium.name} in {activeStadium.city} hosts multiple crucial games in the tournament. 
              The stadium features {activeStadium.gates.length} gates, {activeStadium.zones.length} sectors, and multiple amenities to make the matches comfortable and memorable.
            </p>

            <button
              onClick={requestAIAdvice}
              className="btn btn-primary"
              disabled={!isApiKeyValid(apiKey) || aiLoading}
            >
              Get AI Match Day Logistics Guide
            </button>
          </div>

          {/* AI Advice Card */}
          {(aiAdvice || aiLoading) && (
            <AIReasoningCard
              title={`AI Logistics Guide: ${activeMatch.homeTeam} vs ${activeMatch.awayTeam}`}
              content={aiAdvice}
              isLoading={aiLoading}
              tag="Gemini Logistics Advisor"
            />
          )}

          {/* Stadium Seating Blueprint */}
          <StadiumBlueprint stadiumId={activeStadium.id} />
        </div>
      </div>
    </div>
  );
}
