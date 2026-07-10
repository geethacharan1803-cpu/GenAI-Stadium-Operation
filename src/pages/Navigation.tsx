import { useState, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import StadiumMap from '../components/StadiumMap';
import AIReasoningCard from '../components/AIReasoningCard';
import { getNavigationRecommendation, isApiKeyValid } from '../services/geminiService';
import { DENSITY_COLORS, AMENITY_ICONS } from '../utils/stadiumData';
import { useNavigate } from 'react-router-dom';
import {
  Navigation as NavIcon,
  Search,
  MapPin,
  ArrowRight,
} from 'lucide-react';

export default function Navigation() {
  const { state } = useApp();
  const navigate = useNavigate();
  const { crowdData, selectedStadium, matchInfo, apiKey } = state;

  const [selectedGate, setSelectedGate] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [showAmenities, setShowAmenities] = useState(true);

  const handleNavigationQuery = useCallback(async (q?: string) => {
    const userQuery = q || query;
    if (!userQuery.trim()) return;
    if (!isApiKeyValid(apiKey)) return;

    setAiLoading(true);
    setAiResponse('');
    try {
      const response = await getNavigationRecommendation(
        apiKey!,
        selectedStadium,
        crowdData,
        matchInfo,
        userQuery
      );
      setAiResponse(response);
    } catch (err) {
      setAiResponse('Unable to generate navigation recommendation. Please check your API key.');
    }
    setAiLoading(false);
  }, [query, apiKey, selectedStadium, crowdData, matchInfo]);

  const handleGateClick = (gateId: string) => {
    setSelectedGate(gateId);
    const gate = selectedStadium.gates.find(g => g.id === gateId);
    if (gate) {
      const gateData = crowdData.gateData.find(g => g.gateId === gateId);
      setQuery(`What's the best way to enter through ${gate.name}? It's currently at ${gateData?.load || 0}% capacity.`);
    }
  };

  const quickQueries = [
    'Which gate should I enter from the parking lot?',
    'Find me the nearest restroom with shortest wait',
    'Best route to my seat in Section 200 from Gate A?',
    'Where can I get food with the least crowd?',
    'How do I get to the first aid station?',
    'Best exit route to avoid the post-match rush',
  ];

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h2 className="page-title">🧭 Smart Navigation</h2>
        <p className="page-subtitle">
          AI-powered wayfinding with real-time crowd-aware route optimization
        </p>
      </div>

      <div className="grid-2-1">
        {/* Map Section */}
        <div>
          <div className="glass-card no-hover">
            <div className="glass-card-header">
              <div className="glass-card-title">Interactive Stadium Map</div>
              <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                <button
                  className={`btn btn-sm ${showAmenities ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setShowAmenities(!showAmenities)}
                >
                  {showAmenities ? 'Hide' : 'Show'} Amenities
                </button>
              </div>
            </div>

            <StadiumMap
              stadium={selectedStadium}
              crowdData={crowdData}
              onGateClick={handleGateClick}
              selectedGate={selectedGate}
              showAmenities={showAmenities}
            />

            {/* Map Legend */}
            <div style={{
              display: 'flex',
              gap: 'var(--space-lg)',
              marginTop: 'var(--space-md)',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}>
              {Object.entries(DENSITY_COLORS).map(([level, color]) => (
                <div key={level} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem' }}>
                  <div style={{ width: 12, height: 12, borderRadius: 3, backgroundColor: color }} />
                  <span style={{ color: 'var(--color-text-secondary)', textTransform: 'capitalize' }}>{level}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Gate Details */}
          {selectedGate && (() => {
            const gate = selectedStadium.gates.find(g => g.id === selectedGate);
            const gateData = crowdData.gateData.find(g => g.gateId === selectedGate);
            if (!gate || !gateData) return null;
            const load = gateData.load;
            const color = load > 85 ? DENSITY_COLORS.critical : load > 65 ? DENSITY_COLORS.high : load > 40 ? DENSITY_COLORS.moderate : DENSITY_COLORS.low;
            const density = load > 85 ? 'critical' : load > 65 ? 'high' : load > 40 ? 'moderate' : 'low';

            return (
              <div className="glass-card animate-slide-up" style={{ marginTop: 'var(--space-lg)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div className="glass-card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <MapPin size={18} style={{ color }} />
                      {gate.name}
                    </div>
                    <div className="glass-card-subtitle">Direction: {gate.direction} • Capacity: {gate.capacity.toLocaleString()}</div>
                  </div>
                  <span className={`density-badge ${density}`}>
                    <span className={`density-dot ${density}`} />
                    {density}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-md)', marginTop: 'var(--space-md)' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-display)', color }}>{load}%</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>Current Load</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>{gateData.waitTime}<span style={{ fontSize: '0.7em' }}>m</span></div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>Wait Time</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>{gateData.throughput}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>People/min</div>
                  </div>
                </div>

                <button
                  className="btn btn-primary"
                  style={{ marginTop: 'var(--space-md)', width: '100%', justifyContent: 'center' }}
                  onClick={() => handleNavigationQuery(`Navigate me through ${gate.name} which is at ${load}% capacity`)}
                  disabled={!isApiKeyValid(apiKey)}
                >
                  <NavIcon size={16} /> Get AI Route Recommendation
                </button>
              </div>
            );
          })()}
        </div>

        {/* Navigation Query Panel */}
        <div>
          {/* Search Input */}
          <div className="glass-card no-hover">
            <div className="glass-card-title" style={{ marginBottom: 'var(--space-md)' }}>
              Ask for Directions
            </div>

            {!isApiKeyValid(apiKey) ? (
              <div className="api-key-prompt" style={{ padding: 'var(--space-lg)' }}>
                <h3>🔑 API Key Required</h3>
                <p>Connect your Gemini API key to enable AI navigation.</p>
                <button className="btn btn-primary btn-sm" style={{ marginTop: '12px' }} onClick={() => navigate('/settings')}>
                  Settings
                </button>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <Search size={16} style={{
                      position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                      color: 'var(--color-text-tertiary)', pointerEvents: 'none',
                    }} />
                    <input
                      className="settings-input"
                      style={{ paddingLeft: 36, width: '100%', maxWidth: 'none' }}
                      placeholder="Where do you want to go?"
                      value={query}
                      onChange={e => setQuery(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleNavigationQuery()}
                      aria-label="Navigation query"
                    />
                  </div>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleNavigationQuery()}
                    disabled={!query.trim() || aiLoading}
                  >
                    <ArrowRight size={16} />
                  </button>
                </div>

                {/* Quick Queries */}
                <div style={{ marginTop: 'var(--space-md)' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--color-text-tertiary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>
                    Quick Questions
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
                    {quickQueries.map((q, i) => (
                      <button
                        key={i}
                        className="quick-prompt"
                        style={{ textAlign: 'left', whiteSpace: 'normal' }}
                        onClick={() => {
                          setQuery(q);
                          handleNavigationQuery(q);
                        }}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* AI Response */}
          {(aiResponse || aiLoading) && (
            <div style={{ marginTop: 'var(--space-lg)' }}>
              <AIReasoningCard
                title="Route Recommendation"
                content={aiResponse}
                isLoading={aiLoading}
                tag="AI Navigation"
              />
            </div>
          )}

          {/* Amenity Quick Find */}
          <div className="glass-card no-hover" style={{ marginTop: 'var(--space-lg)' }}>
            <div className="glass-card-title" style={{ marginBottom: 'var(--space-md)' }}>
              Find Nearby
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-sm)' }}>
              {Object.entries(AMENITY_ICONS).map(([type, icon]) => (
                <button
                  key={type}
                  className="btn btn-secondary"
                  style={{ justifyContent: 'flex-start' }}
                  onClick={() => {
                    const q = `Find the nearest ${type.replace('_', ' ')} with the shortest wait time`;
                    setQuery(q);
                    if (isApiKeyValid(apiKey)) handleNavigationQuery(q);
                  }}
                >
                  <span>{icon}</span>
                  <span style={{ textTransform: 'capitalize' }}>{type.replace('_', ' ')}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
