import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import LiveMetricCard from '../components/LiveMetricCard';
import CrowdHeatmap from '../components/CrowdHeatmap';
import AIReasoningCard from '../components/AIReasoningCard';
import { getDashboardSummary, isApiKeyValid } from '../services/geminiService';
import { DENSITY_COLORS } from '../utils/stadiumData';
import {
  Users,
  DoorOpen,
  Clock,
  Activity,
  Compass,
  Bot,
  Upload,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Info,
} from 'lucide-react';

export default function Dashboard() {
  const { state } = useApp();
  const navigate = useNavigate();
  const { crowdData, selectedStadium, matchInfo, apiKey, aiInsights } = state;

  const [aiSummary, setAiSummary] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [lastSummaryTime, setLastSummaryTime] = useState(0);

  const attendancePct = Math.round((crowdData.totalAttendance / selectedStadium.capacity) * 100);

  // Auto-generate AI summary every 30 seconds if API key is set
  const generateSummary = useCallback(async () => {
    if (!isApiKeyValid(apiKey)) return;
    const now = Date.now();
    if (now - lastSummaryTime < 30000) return;

    setAiLoading(true);
    try {
      const summary = await getDashboardSummary(apiKey!, selectedStadium, crowdData, matchInfo);
      setAiSummary(summary);
      setLastSummaryTime(now);
    } catch (err) {
      setAiSummary('Unable to generate AI summary. Please check your API key in Settings.');
    }
    setAiLoading(false);
  }, [apiKey, selectedStadium, crowdData, matchInfo, lastSummaryTime]);

  useEffect(() => {
    if (isApiKeyValid(apiKey) && !aiSummary && !aiLoading) {
      generateSummary();
    }
  }, [apiKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const insightIcons: Record<string, React.ReactNode> = {
    alert: <AlertTriangle size={18} />,
    recommendation: <CheckCircle size={18} />,
    prediction: <TrendingUp size={18} />,
    info: <Info size={18} />,
  };

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <h2 className="page-title">Match Day Dashboard</h2>
        <p className="page-subtitle">
          {selectedStadium.name} • {matchInfo.homeTeam} vs {matchInfo.awayTeam} • {matchInfo.stage}
        </p>
      </div>

      {/* Live Metrics Row */}
      <div className="grid-4" style={{ marginBottom: 'var(--space-lg)' }}>
        <LiveMetricCard
          label="Total Attendance"
          value={crowdData.totalAttendance}
          icon={<Users size={20} />}
          iconBg="teal"
          trend={attendancePct > 70 ? 'up' : 'stable'}
          trendValue={attendancePct > 70 ? Math.round(attendancePct - 60) : 0}
        />
        <LiveMetricCard
          label="Entry Rate"
          value={crowdData.entryRate}
          unit="ppl/min"
          icon={<DoorOpen size={20} />}
          iconBg="gold"
          trend={crowdData.entryRate > 200 ? 'up' : 'down'}
          trendValue={Math.round(crowdData.entryRate / 3)}
        />
        <LiveMetricCard
          label="Avg Wait Time"
          value={Math.round(crowdData.gateData.reduce((s, g) => s + g.waitTime, 0) / crowdData.gateData.length)}
          unit="min"
          icon={<Clock size={20} />}
          iconBg="crimson"
        />
        <LiveMetricCard
          label="Stadium Capacity"
          value={attendancePct}
          unit="%"
          icon={<Activity size={20} />}
          iconBg="blue"
          trend={attendancePct > 80 ? 'up' : 'stable'}
        />
      </div>

      {/* AI Summary + Heatmap */}
      <div className="grid-2" style={{ marginBottom: 'var(--space-lg)' }}>
        <div>
          {isApiKeyValid(apiKey) ? (
            <AIReasoningCard
              title="Live Match Day Briefing"
              content={aiSummary || 'Generating AI briefing...'}
              isLoading={aiLoading && !aiSummary}
              tag="Gemini AI"
            />
          ) : (
            <div className="api-key-prompt">
              <h3>🤖 Connect AI for Live Insights</h3>
              <p>Add your Gemini API key in Settings to enable AI-powered match day briefings, crowd analysis, and smart navigation recommendations.</p>
              <button
                className="btn btn-primary"
                style={{ marginTop: '16px' }}
                onClick={() => navigate('/settings')}
              >
                Go to Settings
              </button>
            </div>
          )}

          {/* Quick Actions */}
          <div style={{ display: 'flex', gap: 'var(--space-md)', marginTop: 'var(--space-lg)', flexWrap: 'wrap' }}>
            <button className="btn btn-secondary" onClick={() => navigate('/navigation')}>
              <Compass size={16} /> Smart Navigation
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('/concierge')}>
              <Bot size={16} /> AI Concierge
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('/upload')}>
              <Upload size={16} /> Upload Data
            </button>
          </div>
        </div>

        <div className="glass-card no-hover">
          <div className="glass-card-header">
            <div className="glass-card-title">Crowd Density Heatmap</div>
            <span className="density-badge moderate">
              <span className="density-dot moderate" />
              Live
            </span>
          </div>
          <CrowdHeatmap stadium={selectedStadium} crowdData={crowdData} />
        </div>
      </div>

      {/* Gate Status + Insights */}
      <div className="grid-2" style={{ marginBottom: 'var(--space-lg)' }}>
        {/* Gate Status */}
        <div className="glass-card no-hover">
          <div className="glass-card-header">
            <div className="glass-card-title">Gate Status</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            {selectedStadium.gates.map(gate => {
              const gateData = crowdData.gateData.find(g => g.gateId === gate.id);
              const load = gateData?.load || 0;
              const color = load > 85 ? DENSITY_COLORS.critical : load > 65 ? DENSITY_COLORS.high : load > 40 ? DENSITY_COLORS.moderate : DENSITY_COLORS.low;

              return (
                <div key={gate.id} className="gate-bar">
                  <div className="gate-bar-header">
                    <span className="gate-bar-name">{gate.name}</span>
                    <span className="gate-bar-value">{load}%</span>
                  </div>
                  <div className="gate-bar-track">
                    <div
                      className="gate-bar-fill"
                      style={{ width: `${load}%`, background: color }}
                    />
                  </div>
                  <div className="gate-bar-meta">
                    <span>Wait: {gateData?.waitTime || 0} min</span>
                    <span>Throughput: {gateData?.throughput || 0}/min</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Insights */}
        <div className="glass-card no-hover">
          <div className="glass-card-header">
            <div className="glass-card-title">AI Insights</div>
            <span style={{ fontSize: '0.7rem', color: 'var(--color-text-tertiary)' }}>
              Auto-updating
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
            {aiInsights.length === 0 ? (
              <div className="empty-state" style={{ padding: 'var(--space-xl)' }}>
                <p>No insights generated yet</p>
              </div>
            ) : (
              aiInsights.slice(0, 5).map(insight => (
                <div key={insight.id} className="insight-card animate-slide-up">
                  <div className={`insight-icon ${insight.type}`}>
                    {insightIcons[insight.type]}
                  </div>
                  <div>
                    <div className="insight-title">{insight.title}</div>
                    <div className="insight-content">{insight.content}</div>
                    <div className="insight-time">
                      {insight.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
