// ============================================================
// Travel & Accommodation Guide Page
// Flight schedules, hotel bookings, transit guides, and AI Travel chatbot
// ============================================================

import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../i18n';
import HotelCard from '../components/HotelCard';
import AIReasoningCard from '../components/AIReasoningCard';
import { getFacilitiesForStadium } from '../utils/facilityData';
import { getFlightsForStadium, getTransitForStadium } from '../utils/travelData';
import { getNavigationRecommendation, isApiKeyValid } from '../services/geminiService';
import { Plane, Building, Bus, Globe, Heart, Shield } from 'lucide-react';

export default function TravelGuide() {
  const { t } = useTranslation();
  const { state } = useApp();
  const { selectedStadium, crowdData, matchInfo, apiKey } = state;

  const [aiResponse, setAiResponse] = useState<string>('');
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [travelQuery, setTravelQuery] = useState<string>('What is the best way to travel to ' + selectedStadium.city + ' and find a budget hotel?');

  const hotels = useMemo(() => {
    return getFacilitiesForStadium(selectedStadium.id).filter(f => f.type === 'hotel');
  }, [selectedStadium.id]);

  const flights = useMemo(() => {
    return getFlightsForStadium(selectedStadium.id);
  }, [selectedStadium.id]);

  const transit = useMemo(() => {
    return getTransitForStadium(selectedStadium.id);
  }, [selectedStadium.id]);

  const handleAskTravelAI = async (customQ?: string) => {
    const q = customQ || travelQuery;
    if (!q.trim() || !isApiKeyValid(apiKey)) return;

    setAiLoading(true);
    setAiResponse('');
    try {
      const prompt = `You are a FIFA 2026 Travel & Lodging Expert. Answer the user question: "${q}". 
      Here is the context data for the host city ${selectedStadium.city} (${selectedStadium.country}):
      - Hotels: ${hotels.map(h => `${h.name} (${h.priceRange}, ${h.rating} stars, vacancy: ${h.vacancy})`).join('; ')}
      - Flights: ${flights.map(f => `${f.airline} - ${f.route} - ${f.duration} - ${f.priceEstimate}`).join('; ')}
      - Transit: ${transit.map(t => `${t.name} - ${t.route} - ${t.frequency} - ${t.price}`).join('; ')}`;

      const res = await getNavigationRecommendation(apiKey!, selectedStadium, crowdData, matchInfo, prompt);
      setAiResponse(res);
    } catch {
      setAiResponse('Unable to get travel advice. Check your API settings.');
    }
    setAiLoading(false);
  };

  const presetTravelQueries = [
    `How to book budget hostels in ${selectedStadium.city}?`,
    `What are the flight connections from DFW/LAX to ${selectedStadium.city}?`,
    `Is there direct public transit from the airport to ${selectedStadium.name}?`,
    `What taxi or ride-sharing apps work best in ${selectedStadium.city}?`
  ];

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h2 className="page-title">✈️ Travel & Accommodation Hub</h2>
        <p className="page-subtitle">Flight listings, hotel bookings, vacancy data, and transit connections for {selectedStadium.city}</p>
      </div>

      <div className="grid-2-1">
        {/* Travel and Transit info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
          {/* Flight Details */}
          <div className="glass-card no-hover">
            <div className="glass-card-header">
              <div className="glass-card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Plane size={18} style={{ color: 'var(--color-teal)' }} />
                <span>{t('flightTimings')}</span>
              </div>
            </div>
            
            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Airline</th>
                    <th>Route</th>
                    <th>Duration</th>
                    <th>Frequency</th>
                    <th>Est. Price</th>
                  </tr>
                </thead>
                <tbody>
                  {flights.map(flight => (
                    <tr key={flight.id}>
                      <td><strong>{flight.airline}</strong></td>
                      <td>{flight.route}</td>
                      <td>{flight.duration}</td>
                      <td>{flight.frequency}</td>
                      <td style={{ color: 'var(--color-gold)', fontWeight: 'bold' }}>{flight.priceEstimate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Transit Details */}
          <div className="glass-card no-hover">
            <div className="glass-card-header">
              <div className="glass-card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Bus size={18} style={{ color: 'var(--color-blue)' }} />
                <span>{t('localTransit')}</span>
              </div>
            </div>
            
            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Option</th>
                    <th>Route</th>
                    <th>Frequency</th>
                    <th>Fare</th>
                    <th>Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {transit.map((option, idx) => (
                    <tr key={idx}>
                      <td><strong>{option.name}</strong></td>
                      <td>{option.route}</td>
                      <td>{option.frequency}</td>
                      <td>{option.price}</td>
                      <td>{option.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Hotels & Hostels List */}
          <div>
            <h3 className="glass-card-title" style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Building size={18} style={{ color: 'var(--color-gold)' }} />
              <span>Hostels & Hotels Near {selectedStadium.name}</span>
            </h3>
            <div className="grid-2">
              {hotels.map(hotel => (
                <HotelCard key={hotel.id} hotel={hotel} />
              ))}
            </div>
          </div>
        </div>

        {/* AI Travel Assistant Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
          {/* Question Box */}
          <div className="glass-card no-hover">
            <div className="glass-card-title" style={{ marginBottom: '12px' }}>
              💬 AI Travel Planner
            </div>
            
            {isApiKeyValid(apiKey) ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <textarea
                  className="chat-input"
                  style={{ width: '100%', minHeight: '80px' }}
                  placeholder="Ask a lodging or flight question..."
                  value={travelQuery}
                  onChange={e => setTravelQuery(e.target.value)}
                />
                <button
                  className="btn btn-primary"
                  onClick={() => handleAskTravelAI()}
                  disabled={aiLoading}
                  style={{ justifyContent: 'center' }}
                >
                  Ask Travel Advisor
                </button>
              </div>
            ) : (
              <div className="api-key-prompt" style={{ padding: 'var(--space-md)' }}>
                <span>🔑 API Key required to run AI Travel advisor. Add in settings.</span>
              </div>
            )}

            {/* Quick Prompts */}
            <div style={{ marginTop: 'var(--space-md)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--color-text-tertiary)', marginBottom: '6px', fontWeight: 'bold', textTransform: 'uppercase' }}>
                Common Inquiries
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {presetTravelQueries.map((q, idx) => (
                  <button
                    key={idx}
                    className="quick-prompt"
                    style={{ textAlign: 'left', whiteSpace: 'normal', fontSize: '0.75rem' }}
                    onClick={() => {
                      setTravelQuery(q);
                      handleAskTravelAI(q);
                    }}
                    disabled={!isApiKeyValid(apiKey) || aiLoading}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* AI Response Card */}
          {(aiResponse || aiLoading) && (
            <AIReasoningCard
              title="AI Travel Advisor Response"
              content={aiResponse}
              isLoading={aiLoading}
              tag="Gemini Travel Advisor"
            />
          )}

          {/* Safety & Visa Info */}
          <div className="glass-card no-hover" style={{ borderLeft: '3px solid var(--color-teal)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-teal)', fontWeight: 'bold', fontSize: '0.85rem', marginBottom: '6px' }}>
              <Shield size={14} />
              <span>International Fan Guidelines</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', lineHeight: '1.4' }}>
              Organized by **{selectedStadium.country}**, all border security, flight bookings, and local metro operations are aligned with the FIFA Fan Pass. Make sure your visa credentials (ESTA for USA, ETA for Canada, FMM for Mexico) are verified before booking flights.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
