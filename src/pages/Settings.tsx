import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { isApiKeyValid } from '../services/geminiService';
import { FIFA_2026_STADIUMS, MATCH_SCHEDULE } from '../utils/stadiumData';
import { Key, Building2, Gauge, Play, Pause, CheckCircle, AlertCircle, Globe } from 'lucide-react';
import LanguageSwitcher from '../components/LanguageSwitcher';


export default function Settings() {
  const { state, dispatch } = useApp();
  const [apiKeyInput, setApiKeyInput] = useState(state.apiKey || '');
  const [showKey, setShowKey] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved'>('idle');

  const handleSaveApiKey = () => {
    const key = apiKeyInput.trim();
    dispatch({ type: 'SET_API_KEY', payload: key || null });
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 3000);
  };

  const handleStadiumChange = (stadiumId: string) => {
    dispatch({ type: 'SET_STADIUM', payload: stadiumId });
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h2 className="page-title">⚙️ Settings</h2>
        <p className="page-subtitle">
          Configure your AI connection, stadium, and simulation preferences
        </p>
      </div>

      <div style={{ maxWidth: 700 }}>
        {/* API Key Section */}
        <div className="glass-card no-hover settings-section">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-md)' }}>
            <Key size={20} style={{ color: 'var(--color-teal)' }} />
            <div className="glass-card-title">Gemini API Key</div>
          </div>

          <p className="settings-description">
            Enter your Google Gemini API key to enable AI-powered features. 
            Your key is stored only in this browser session and is never persisted to disk.
            Get a free key from <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer">Google AI Studio</a>.
          </p>

          <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center' }}>
            <input
              className="settings-input"
              type={showKey ? 'text' : 'password'}
              placeholder="Enter your Gemini API key..."
              value={apiKeyInput}
              onChange={e => setApiKeyInput(e.target.value)}
              aria-label="Gemini API key"
            />
            <button className="btn btn-secondary btn-sm" onClick={() => setShowKey(!showKey)}>
              {showKey ? 'Hide' : 'Show'}
            </button>
            <button className="btn btn-primary" onClick={handleSaveApiKey}>
              Save
            </button>
          </div>

          {saveStatus === 'saved' && (
            <div style={{ marginTop: 'var(--space-sm)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}>
              {isApiKeyValid(apiKeyInput.trim()) ? (
                <>
                  <CheckCircle size={14} style={{ color: 'var(--color-teal)' }} />
                  <span style={{ color: 'var(--color-teal)' }}>API key saved! AI features are now enabled.</span>
                </>
              ) : (
                <>
                  <AlertCircle size={14} style={{ color: 'var(--color-gold)' }} />
                  <span style={{ color: 'var(--color-gold)' }}>Key cleared. AI features are disabled.</span>
                </>
              )}
            </div>
          )}

          <div style={{ marginTop: 'var(--space-md)', padding: 'var(--space-md)', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', color: 'var(--color-text-tertiary)' }}>
            <strong style={{ color: 'var(--color-text-secondary)' }}>Status:</strong>{' '}
            {isApiKeyValid(state.apiKey) ? (
              <span style={{ color: 'var(--color-teal)' }}>✓ Connected — AI features active</span>
            ) : (
              <span style={{ color: 'var(--color-crimson)' }}>✗ Not connected — AI features disabled</span>
            )}
          </div>
        </div>

        {/* Stadium Selection */}
        <div className="glass-card no-hover settings-section">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-md)' }}>
            <Building2 size={20} style={{ color: 'var(--color-gold)' }} />
            <div className="glass-card-title">Stadium Venue</div>
          </div>

          <p className="settings-description">
            Select a FIFA World Cup 2026 venue. All data, simulations, and AI responses will be tailored to this stadium.
          </p>

          <select
            className="settings-select"
            value={state.selectedStadium.id}
            onChange={e => handleStadiumChange(e.target.value)}
            aria-label="Select stadium"
          >
            {FIFA_2026_STADIUMS.map(stadium => (
              <option key={stadium.id} value={stadium.id}>
                {stadium.name} — {stadium.city} (Capacity: {stadium.capacity.toLocaleString()})
              </option>
            ))}
          </select>

          {/* Current Match Info */}
          <div style={{ marginTop: 'var(--space-md)', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-md)' }}>
            <div style={{ padding: 'var(--space-md)', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Current Match</div>
              <div style={{ fontWeight: 700 }}>{state.matchInfo.homeTeam} vs {state.matchInfo.awayTeam}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-gold)' }}>{state.matchInfo.stage}</div>
            </div>
            <div style={{ padding: 'var(--space-md)', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Venue Details</div>
              <div style={{ fontWeight: 700 }}>{state.selectedStadium.name}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                {state.selectedStadium.gates.length} gates • {state.selectedStadium.zones.length} zones • {state.selectedStadium.amenities.length} amenities
              </div>
            </div>
          </div>
        </div>

        {/* Simulation Controls */}
        <div className="glass-card no-hover settings-section">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-md)' }}>
            <Gauge size={20} style={{ color: 'var(--color-crimson)' }} />
            <div className="glass-card-title">Simulation Controls</div>
          </div>

          <p className="settings-description">
            Control the live crowd simulation. When running, crowd data updates every few seconds to simulate real match-day conditions.
          </p>

          <div className="settings-row">
            <label className="settings-label" style={{ marginBottom: 0 }}>Simulation:</label>
            <button
              className={`btn ${state.isSimulationRunning ? 'btn-danger' : 'btn-primary'}`}
              onClick={() => dispatch({ type: 'SET_SIMULATION_RUNNING', payload: !state.isSimulationRunning })}
            >
              {state.isSimulationRunning ? <><Pause size={16} /> Pause</> : <><Play size={16} /> Start</>}
            </button>
          </div>

          <div className="settings-row">
            <label className="settings-label" style={{ marginBottom: 0 }}>Speed:</label>
            <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
              {[1, 2, 5].map(speed => (
                <button
                  key={speed}
                  className={`btn ${state.simulationSpeed === speed ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                  onClick={() => dispatch({ type: 'SET_SIMULATION_SPEED', payload: speed })}
                >
                  {speed}x
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Language & Regional Settings */}
        <div className="glass-card no-hover settings-section">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-md)' }}>
            <Globe size={20} style={{ color: 'var(--color-blue)' }} />
            <div className="glass-card-title">Language & Regional Settings</div>
          </div>

          <p className="settings-description">
            Choose your preferred translation profile. Region settings are automatically aligned when switching venues (e.g. Mexico stadium defaults to Spanish, Canada to French).
          </p>

          <div className="settings-row">
            <LanguageSwitcher />
          </div>

          <div style={{ marginTop: 'var(--space-md)', padding: 'var(--space-md)', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
            <strong>Active Language Profile:</strong>{' '}
            <span style={{ textTransform: 'capitalize', color: 'var(--color-teal)' }}>
              {state.language === 'en' ? 'English (USA)' : state.language === 'es' ? 'Español (México)' : 'Français (Canada)'}
            </span>
          </div>
        </div>

        {/* About */}
        <div className="glass-card no-hover settings-section">
          <div className="glass-card-title" style={{ marginBottom: 'var(--space-md)' }}>About</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
            <p><strong>Smart Stadium GenAI Platform</strong> — FIFA World Cup 2026</p>
            <p style={{ marginTop: '8px' }}>
              A fan-focused AI-powered application integrating three operational verticals:
              Smart Navigation, Crowd Intelligence, and Personalized Fan Experience (AI Concierge).
            </p>
            <p style={{ marginTop: '8px' }}>
              Built with React, TypeScript, and Google Gemini 2.0 Flash. 
              All crowd data is generated by a realistic simulation engine and dynamically updates in real-time.
              Upload your own data (CSV, PDF, TXT, DOCX) to test with real operational data.
            </p>
            <div style={{ marginTop: 'var(--space-md)', padding: 'var(--space-md)', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>
                Persona: Fans | Verticals: Navigation, Crowd Mgmt, AI Concierge<br/>
                AI Engine: Gemini 2.0 Flash | Framework: React + Vite + TypeScript
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
