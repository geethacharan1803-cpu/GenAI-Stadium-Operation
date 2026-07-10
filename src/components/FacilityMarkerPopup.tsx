// ============================================================
// Facility Marker Popup Component
// Displays detailed info inside Leaflet map markers
// ============================================================

import { NearbyFacility } from '../types';
import { MapPin, Phone, Star, ShieldAlert } from 'lucide-react';

interface FacilityMarkerPopupProps {
  facility: NearbyFacility;
  onAskAI?: (facility: NearbyFacility) => void;
  enableAI: boolean;
}

export default function FacilityMarkerPopup({ facility, onAskAI, enableAI }: FacilityMarkerPopupProps) {
  const getIcon = () => {
    switch (facility.type) {
      case 'hospital': return '🏥';
      case 'hotel': return '🏨';
      case 'transit': return '🚇';
      case 'airport': return '✈️';
      default: return '📍';
    }
  };

  const getHeaderColor = () => {
    switch (facility.type) {
      case 'hospital': return 'var(--color-crimson)';
      case 'hotel': return 'var(--color-gold)';
      case 'transit': return 'var(--color-blue)';
      case 'airport': return 'var(--color-purple)';
      default: return 'var(--color-teal)';
    }
  };

  return (
    <div style={{
      color: '#fff',
      padding: '2px',
      fontSize: '0.8rem',
      maxWidth: '240px',
      fontFamily: 'var(--font-body)',
      lineHeight: '1.4'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        borderBottom: `2px solid ${getHeaderColor()}`,
        paddingBottom: '4px',
        marginBottom: '6px'
      }}>
        <span style={{ fontSize: '1.1rem' }}>{getIcon()}</span>
        <strong style={{ fontSize: '0.85rem', color: '#fff' }}>{facility.name}</strong>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '8px', color: 'var(--color-text-secondary)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '4px' }}>
          <MapPin size={12} style={{ color: 'var(--color-teal)', flexShrink: 0, marginTop: '2px' }} />
          <span>{facility.address} ({facility.distanceKm} km away)</span>
        </div>

        {facility.phone && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Phone size={12} style={{ color: 'var(--color-teal)' }} />
            <span>{facility.phone}</span>
          </div>
        )}

        {facility.rating && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Star size={12} fill="var(--color-gold)" stroke="var(--color-gold)" />
            <span>Rating: {facility.rating} / 5</span>
          </div>
        )}

        {facility.priceRange && (
          <div>
            Price: <strong style={{ color: 'var(--color-gold)' }}>{facility.priceRange}</strong>
          </div>
        )}

        {facility.details && (
          <div style={{
            fontSize: '0.72rem',
            background: 'rgba(255,255,255,0.04)',
            padding: '4px 6px',
            borderRadius: '2px',
            marginTop: '4px',
            borderLeft: `2px solid ${getHeaderColor()}`
          }}>
            {facility.details}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '4px', marginTop: '6px' }}>
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${facility.latitude},${facility.longitude}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-secondary btn-sm"
          style={{ padding: '3px 6px', fontSize: '0.7rem', flex: 1, justifyContent: 'center' }}
        >
          Navigate
        </a>
        
        {onAskAI && (
          <button
            className="btn btn-primary btn-sm"
            style={{ padding: '3px 6px', fontSize: '0.7rem', flex: 1, justifyContent: 'center' }}
            disabled={!enableAI}
            onClick={() => onAskAI(facility)}
          >
            Ask AI Route
          </button>
        )}
      </div>
    </div>
  );
}
