import { useMemo } from 'react';
import { StadiumConfig, CrowdSnapshot } from '../types';
import { DENSITY_COLORS, AMENITY_ICONS } from '../utils/stadiumData';

interface StadiumMapProps {
  stadium: StadiumConfig;
  crowdData: CrowdSnapshot;
  onGateClick?: (gateId: string) => void;
  onZoneClick?: (zoneId: string) => void;
  onAmenityClick?: (amenityId: string) => void;
  selectedGate?: string | null;
  showAmenities?: boolean;
}

export default function StadiumMap({
  stadium,
  crowdData,
  onGateClick,
  onZoneClick,
  onAmenityClick,
  selectedGate,
  showAmenities = true,
}: StadiumMapProps) {
  const zoneColors = useMemo(() => {
    const colors: Record<string, string> = {};
    crowdData.zoneData.forEach(z => {
      colors[z.zoneId] = DENSITY_COLORS[z.density] || DENSITY_COLORS.low;
    });
    return colors;
  }, [crowdData.zoneData]);

  const gateColors = useMemo(() => {
    const colors: Record<string, string> = {};
    crowdData.gateData.forEach(g => {
      const load = g.load;
      if (load < 40) colors[g.gateId] = DENSITY_COLORS.low;
      else if (load < 65) colors[g.gateId] = DENSITY_COLORS.moderate;
      else if (load < 85) colors[g.gateId] = DENSITY_COLORS.high;
      else colors[g.gateId] = DENSITY_COLORS.critical;
    });
    return colors;
  }, [crowdData.gateData]);

  return (
    <div className="stadium-map-container" role="img" aria-label={`Interactive map of ${stadium.name}`}>
      <svg className="stadium-map-svg" viewBox="0 0 500 400" preserveAspectRatio="xMidYMid meet">
        {/* Background gradient */}
        <defs>
          <radialGradient id="fieldGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0a4a2a" />
            <stop offset="100%" stopColor="#062a18" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="shadow">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Stadium outline */}
        <ellipse cx="250" cy="200" rx="220" ry="170" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
        <ellipse cx="250" cy="200" rx="200" ry="155" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />

        {/* Zones */}
        {stadium.zones.map(zone => {
          const zoneData = crowdData.zoneData.find(z => z.zoneId === zone.id);
          const color = zoneColors[zone.id] || DENSITY_COLORS.low;
          const opacity = zone.type === 'field' ? 0.6 : 0.25;

          return (
            <g key={zone.id} className="map-zone" onClick={() => onZoneClick?.(zone.id)}>
              <rect
                x={zone.position.x}
                y={zone.position.y}
                width={zone.position.width}
                height={zone.position.height}
                rx="6"
                fill={zone.type === 'field' ? 'url(#fieldGradient)' : color}
                opacity={opacity}
                style={{ transition: 'fill 0.5s ease, opacity 0.5s ease' }}
              />
              <text
                x={zone.position.x + zone.position.width / 2}
                y={zone.position.y + zone.position.height / 2}
                className={zone.type === 'field' ? 'map-field-label' : 'map-label'}
              >
                {zone.type === 'field' ? '⚽ PITCH' : zone.name.split(' - ').pop()?.split(' ').pop()}
              </text>
              {zone.type !== 'field' && zoneData && (
                <text
                  x={zone.position.x + zone.position.width / 2}
                  y={zone.position.y + zone.position.height / 2 + 14}
                  className="map-label"
                  style={{ fontSize: '8px', opacity: 0.6 }}
                >
                  {zoneData.occupancy.toLocaleString()}
                </text>
              )}
            </g>
          );
        })}

        {/* Gates */}
        {stadium.gates.map(gate => {
          const gateData = crowdData.gateData.find(g => g.gateId === gate.id);
          const color = gateColors[gate.id] || DENSITY_COLORS.low;
          const isSelected = selectedGate === gate.id;

          return (
            <g
              key={gate.id}
              className="map-gate"
              onClick={() => onGateClick?.(gate.id)}
              filter={isSelected ? 'url(#glow)' : undefined}
              role="button"
              aria-label={`${gate.name}: ${gateData?.load || 0}% capacity, ${gateData?.waitTime || 0} min wait`}
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && onGateClick?.(gate.id)}
            >
              {/* Gate marker */}
              <circle
                cx={gate.position.x}
                cy={gate.position.y}
                r={isSelected ? 18 : 14}
                fill={color}
                opacity={0.3}
                style={{ transition: 'r 0.3s ease' }}
              />
              <circle
                cx={gate.position.x}
                cy={gate.position.y}
                r={isSelected ? 12 : 9}
                fill={color}
                stroke={isSelected ? '#fff' : 'rgba(255,255,255,0.3)'}
                strokeWidth={isSelected ? 2 : 1}
                style={{ transition: 'all 0.3s ease' }}
              />
              {/* Gate label */}
              <text
                x={gate.position.x}
                y={gate.position.y + 4}
                textAnchor="middle"
                fill="#fff"
                fontSize="8"
                fontWeight="800"
                fontFamily="var(--font-display)"
                style={{ pointerEvents: 'none' }}
              >
                {gate.name.replace('Gate ', '')}
              </text>
              {/* Wait time label */}
              <text
                x={gate.position.x}
                y={gate.position.y + (gate.direction.includes('north') ? -20 : 26)}
                textAnchor="middle"
                fill={color}
                fontSize="9"
                fontWeight="700"
                style={{ pointerEvents: 'none' }}
              >
                {gateData?.waitTime || 0}m
              </text>
            </g>
          );
        })}

        {/* Amenities */}
        {showAmenities && stadium.amenities.map(amenity => (
          <g
            key={amenity.id}
            className="map-amenity"
            onClick={() => onAmenityClick?.(amenity.id)}
            role="button"
            aria-label={`${amenity.name} (${amenity.type})`}
            tabIndex={0}
          >
            <text
              x={amenity.position.x}
              y={amenity.position.y}
              textAnchor="middle"
              dominantBaseline="central"
              style={{ cursor: 'pointer', transition: 'transform 0.2s ease' }}
            >
              {AMENITY_ICONS[amenity.type] || '📍'}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
