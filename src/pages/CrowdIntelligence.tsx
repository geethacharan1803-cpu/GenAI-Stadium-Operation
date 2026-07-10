import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import AIReasoningCard from '../components/AIReasoningCard';
import { getCrowdAnalysis, isApiKeyValid } from '../services/geminiService';
import { DENSITY_COLORS } from '../utils/stadiumData';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { RefreshCw, BarChart3 } from 'lucide-react';

export default function CrowdIntelligence() {
  const { state } = useApp();
  const navigate = useNavigate();
  const { crowdData, crowdHistory, selectedStadium, matchInfo, apiKey } = state;

  const [aiAnalysis, setAiAnalysis] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const generateAnalysis = useCallback(async () => {
    if (!isApiKeyValid(apiKey)) return;
    setAiLoading(true);
    try {
      const result = await getCrowdAnalysis(apiKey!, selectedStadium, crowdData, matchInfo);
      setAiAnalysis(result);
    } catch {
      setAiAnalysis('Unable to generate crowd analysis. Please check your API key.');
    }
    setAiLoading(false);
  }, [apiKey, selectedStadium, crowdData, matchInfo]);

  // Prepare chart data from crowd history
  const attendanceHistory = useMemo(() => {
    return crowdHistory.map((snap, i) => ({
      time: snap.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      attendance: snap.totalAttendance,
      entryRate: snap.entryRate,
      exitRate: snap.exitRate,
    }));
  }, [crowdHistory]);

  const gateHistoryData = useMemo(() => {
    return crowdHistory.slice(-20).map(snap => {
      const obj: Record<string, string | number> = {
        time: snap.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      };
      snap.gateData.forEach(g => {
        const gate = selectedStadium.gates.find(sg => sg.id === g.gateId);
        obj[gate?.name || g.gateId] = g.load;
      });
      return obj;
    });
  }, [crowdHistory, selectedStadium.gates]);

  const zoneBarData = useMemo(() => {
    return crowdData.zoneData.map(z => {
      const zone = selectedStadium.zones.find(sz => sz.id === z.zoneId);
      const capacity = zone?.capacity || 1;
      return {
        name: zone?.name?.split(' - ').pop() || z.zoneId,
        occupancy: z.occupancy,
        capacity,
        pct: Math.round((z.occupancy / capacity) * 100),
        density: z.density,
      };
    });
  }, [crowdData.zoneData, selectedStadium.zones]);

  const gateColors = ['#06d6a0', '#ffd166', '#e63946', '#4361ee', '#f77f00', '#7b2cbf'];

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-md)' }}>
          <div>
            <h2 className="page-title">👥 Crowd Intelligence</h2>
            <p className="page-subtitle">
              Real-time crowd analytics with AI-powered predictions and insights
            </p>
          </div>
          <button
            className="btn btn-primary"
            onClick={generateAnalysis}
            disabled={!isApiKeyValid(apiKey) || aiLoading}
          >
            <RefreshCw size={16} className={aiLoading ? 'spin' : ''} />
            {aiLoading ? 'Analyzing...' : 'Generate AI Analysis'}
          </button>
        </div>
      </div>

      {/* Attendance Over Time Chart */}
      <div className="glass-card no-hover" style={{ marginBottom: 'var(--space-lg)' }}>
        <div className="glass-card-header">
          <div className="glass-card-title">Attendance & Flow Over Time</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart3 size={16} style={{ color: 'var(--color-text-tertiary)' }} />
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>
              Last {attendanceHistory.length} snapshots
            </span>
          </div>
        </div>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <AreaChart data={attendanceHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#6b6f99' }} />
              <YAxis tick={{ fontSize: 10, fill: '#6b6f99' }} />
              <Tooltip
                contentStyle={{
                  background: '#1a1f4a',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 8,
                  fontSize: '0.8rem',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '0.75rem' }} />
              <Area
                type="monotone"
                dataKey="attendance"
                stroke="#06d6a0"
                fill="rgba(6,214,160,0.15)"
                strokeWidth={2}
                name="Total Attendance"
              />
              <Area
                type="monotone"
                dataKey="entryRate"
                stroke="#ffd166"
                fill="rgba(255,209,102,0.1)"
                strokeWidth={2}
                name="Entry Rate (ppl/min)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: 'var(--space-lg)' }}>
        {/* Gate Load Over Time */}
        <div className="glass-card no-hover">
          <div className="glass-card-header">
            <div className="glass-card-title">Gate Load Trends</div>
          </div>
          <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer>
              <LineChart data={gateHistoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="time" tick={{ fontSize: 9, fill: '#6b6f99' }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#6b6f99' }} />
                <Tooltip
                  contentStyle={{
                    background: '#1a1f4a',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 8,
                    fontSize: '0.75rem',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '0.7rem' }} />
                {selectedStadium.gates.map((gate, i) => (
                  <Line
                    key={gate.id}
                    type="monotone"
                    dataKey={gate.name}
                    stroke={gateColors[i % gateColors.length]}
                    strokeWidth={2}
                    dot={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Zone Occupancy Bars */}
        <div className="glass-card no-hover">
          <div className="glass-card-header">
            <div className="glass-card-title">Zone Occupancy</div>
          </div>
          <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer>
              <BarChart data={zoneBarData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: '#6b6f99' }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: '#6b6f99' }} width={80} />
                <Tooltip
                  contentStyle={{
                    background: '#1a1f4a',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 8,
                    fontSize: '0.75rem',
                  }}
                  formatter={(value: number) => [`${value}%`, 'Occupancy']}
                />
                <Bar
                  dataKey="pct"
                  name="Occupancy %"
                  radius={[0, 4, 4, 0]}
                  fill="#4361ee"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Zone Detail Cards */}
      <div className="grid-3" style={{ marginBottom: 'var(--space-lg)' }}>
        {zoneBarData.map(zone => {
          const color = DENSITY_COLORS[zone.density] || DENSITY_COLORS.low;
          return (
            <div key={zone.name} className="glass-card" style={{ borderLeft: `3px solid ${color}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="glass-card-title" style={{ fontSize: '0.85rem' }}>{zone.name}</div>
                <span className={`density-badge ${zone.density}`}>
                  <span className={`density-dot ${zone.density}`} />
                  {zone.density}
                </span>
              </div>
              <div style={{ marginTop: 'var(--space-sm)' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
                  {zone.occupancy.toLocaleString()}
                  <span style={{ fontSize: '0.6em', color: 'var(--color-text-tertiary)', fontWeight: 400 }}>
                    {' '}/ {zone.capacity.toLocaleString()}
                  </span>
                </div>
                <div className="gate-bar-track" style={{ marginTop: 6 }}>
                  <div className="gate-bar-fill" style={{ width: `${zone.pct}%`, background: color }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Analysis */}
      {!isApiKeyValid(apiKey) ? (
        <div className="api-key-prompt">
          <h3>🤖 Enable AI Crowd Analysis</h3>
          <p>Connect your Gemini API key to get AI-powered crowd predictions, staggered entry recommendations, and safety assessments.</p>
          <button className="btn btn-primary" style={{ marginTop: '12px' }} onClick={() => navigate('/settings')}>
            Go to Settings
          </button>
        </div>
      ) : (aiAnalysis || aiLoading) ? (
        <AIReasoningCard
          title="Crowd Intelligence Report"
          content={aiAnalysis}
          isLoading={aiLoading}
          tag="AI Crowd Analysis"
        />
      ) : (
        <div className="glass-card no-hover" style={{ textAlign: 'center', padding: 'var(--space-xl)' }}>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-md)' }}>
            Click "Generate AI Analysis" to get a comprehensive crowd intelligence report
          </p>
          <button className="btn btn-primary" onClick={generateAnalysis}>
            <RefreshCw size={16} /> Generate Analysis
          </button>
        </div>
      )}
    </div>
  );
}
