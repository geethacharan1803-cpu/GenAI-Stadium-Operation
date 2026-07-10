// ============================================================
// Facilities Map Page
// Leaflet-powered GIS mapping displaying hospitals, hotels,
// transit stations, and airports near host venues.
// ============================================================

import { useState, useMemo, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../i18n';
import { getFacilitiesForStadium } from '../utils/facilityData';
import { getNavigationRecommendation, isApiKeyValid } from '../services/geminiService';
import AIReasoningCard from '../components/AIReasoningCard';
import FacilityMarkerPopup from '../components/FacilityMarkerPopup';

// Import Leaflet React bindings
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

import { MapPin, ShieldAlert, Navigation, Search, RefreshCw, Compass } from 'lucide-react';

// Setup default marker icons to avoid Leaflet missing assets issue on Webpack/Vite
const createCustomIcon = (type: string, color: string) => {
  const iconHtml = `
    <div style="
      background-color: ${color};
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid white;
      box-shadow: 0 2px 5px rgba(0,0,0,0.4);
      font-size: 14px;
    ">
      ${type === 'stadium' ? '🏟️' : type === 'hospital' ? '🏥' : type === 'hotel' ? '🏨' : type === 'transit' ? '🚇' : '✈️'}
    </div>
  `;
  return L.divIcon({
    html: iconHtml,
    className: 'custom-leaflet-icon',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  });
};

const stadiumIcon = createCustomIcon('stadium', 'var(--color-teal)');
const hospitalIcon = createCustomIcon('hospital', 'var(--color-crimson)');
const hotelIcon = createCustomIcon('hotel', 'var(--color-gold)');
const transitIcon = createCustomIcon('transit', 'var(--color-blue)');
const airportIcon = createCustomIcon('airport', 'var(--color-purple)');

// Map center updater component
function ChangeMapView({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 13);
  }, [center, map]);
  return null;
}

export default function FacilitiesMap() {
  const { t } = useTranslation();
  const { state } = useApp();
  const { selectedStadium, crowdData, matchInfo, apiKey } = state;

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [aiAdvice, setAiAdvice] = useState<string>('');
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [selectedFacility, setSelectedFacility] = useState<any | null>(null);

  // Load facilities for the selected stadium
  const facilities = useMemo(() => {
    return getFacilitiesForStadium(selectedStadium.id);
  }, [selectedStadium.id]);

  // Filter facilities based on category and search query
  const filteredFacilities = useMemo(() => {
    return facilities.filter(f => {
      const matchCat = activeCategory === 'all' || f.type === activeCategory;
      const matchQuery = f.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         f.address.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [facilities, activeCategory, searchQuery]);

  // Coordinates of the selected stadium
  const stadiumCenter: [number, number] = [selectedStadium.latitude, selectedStadium.longitude];

  const handleAskAI = async (facility: any) => {
    if (!isApiKeyValid(apiKey)) return;
    setAiLoading(true);
    setAiAdvice('');
    setSelectedFacility(facility);
    
    try {
      const prompt = `Formulate an optimal route recommendation from ${selectedStadium.name} (located at ${selectedStadium.latitude}, ${selectedStadium.longitude}) to the facility ${facility.name} (${facility.type}) at ${facility.address} (${facility.distanceKm} km away). 
      Take into account current stadium gate waiting loads: ${crowdData.gateData.map(g => `${g.gateId}: ${g.waitTime}m wait`).join(', ')}. Recommend which exit gate to use and local transit options.`;
      
      const response = await getNavigationRecommendation(apiKey!, selectedStadium, crowdData, matchInfo, prompt);
      setAiAdvice(response);
    } catch {
      setAiAdvice('Could not load routing instructions.');
    }
    setAiLoading(false);
  };

  const getMarkerIcon = (type: string) => {
    switch (type) {
      case 'hospital': return hospitalIcon;
      case 'hotel': return hotelIcon;
      case 'transit': return transitIcon;
      case 'airport': return airportIcon;
      default: return stadiumIcon;
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h2 className="page-title">🗺️ Host City Facilities Map</h2>
        <p className="page-subtitle">Interactive GIS tracking of nearby medical emergency rooms, hotels, metro stations, and flight terminals</p>
      </div>

      <div className="grid-2-1">
        {/* Leaflet Map Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          <div className="glass-card no-hover" role="application" aria-label="Interactive Facilities Map" style={{ padding: '8px', height: '450px', position: 'relative', overflow: 'hidden' }}>
            <MapContainer
              center={stadiumCenter}
              zoom={13}
              style={{ width: '100%', height: '100%', borderRadius: '12px' }}
            >
              <ChangeMapView center={stadiumCenter} />
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              />

              {/* Stadium Marker */}
              <Marker position={stadiumCenter} icon={stadiumIcon}>
                <Popup>
                  <div style={{ color: '#fff', fontSize: '0.8rem', fontFamily: 'var(--font-body)' }}>
                    <strong>🏟️ {selectedStadium.name}</strong><br />
                    <span>{selectedStadium.city}, {selectedStadium.country}</span><br />
                    <span>Capacity: {selectedStadium.capacity.toLocaleString()}</span>
                  </div>
                </Popup>
              </Marker>

              {/* Facility Markers */}
              {filteredFacilities.map(f => (
                <Marker key={f.id} position={[f.latitude, f.longitude]} icon={getMarkerIcon(f.type)}>
                  <Popup>
                    <FacilityMarkerPopup
                      facility={f}
                      enableAI={isApiKeyValid(apiKey)}
                      onAskAI={handleAskAI}
                    />
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          {/* AI Routing Advice */}
          {(aiAdvice || aiLoading) && (
            <AIReasoningCard
              title={selectedFacility ? `AI Route to ${selectedFacility.name}` : "AI Routing Directions"}
              content={aiAdvice}
              isLoading={aiLoading}
              tag="Gemini Nav Advisor"
            />
          )}
        </div>

        {/* Facilities Filter & List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          {/* Categories Selector */}
          <div className="glass-card no-hover" style={{ padding: '12px var(--space-md)' }}>
            <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', paddingBottom: '4px' }}>
              {[
                { id: 'all', label: 'All', icon: '📍' },
                { id: 'hospital', label: 'Medical', icon: '🏥' },
                { id: 'hotel', label: 'Hostels & Hotels', icon: '🏨' },
                { id: 'transit', label: 'Transit', icon: '🚇' },
                { id: 'airport', label: 'Airports', icon: '✈️' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`btn btn-sm ${activeCategory === cat.id ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>

            <div style={{ position: 'relative', marginTop: '10px' }}>
              <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-tertiary)' }} />
              <input
                className="settings-input"
                style={{ paddingLeft: '30px', fontSize: '0.8rem', width: '100%', height: '32px' }}
                placeholder="Search facility name..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Facilities List View */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)', maxHeight: '350px', overflowY: 'auto', paddingRight: '4px' }}>
            {filteredFacilities.map(f => {
              const icon = f.type === 'hospital' ? '🏥' : f.type === 'hotel' ? '🏨' : f.type === 'transit' ? '🚇' : '✈️';
              const themeColor = f.type === 'hospital' ? 'var(--color-crimson)' : f.type === 'hotel' ? 'var(--color-gold)' : f.type === 'transit' ? 'var(--color-blue)' : 'var(--color-purple)';

              return (
                <div
                  key={f.id}
                  className="glass-card"
                  style={{
                    padding: '10px 14px',
                    cursor: 'pointer',
                    borderLeft: `3px solid ${themeColor}`,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}
                  onClick={() => handleAskAI(f)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '1rem' }}>{icon}</span>
                      <strong style={{ fontSize: '0.85rem' }}>{f.name}</strong>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-teal)', fontWeight: 600 }}>{f.distanceKm} km</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>{f.address}</span>
                  {f.vacancy && (
                    <div style={{ marginTop: '4px' }}>
                      <span className={`density-badge ${f.vacancy === 'available' ? 'low' : f.vacancy === 'limited' ? 'moderate' : 'critical'}`} style={{ fontSize: '0.6rem', padding: '2px 6px' }}>
                        Vacancy: {f.vacancy.toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
