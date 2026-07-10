// ============================================================
// Hotel Card Component
// Lists hotel details, pricing, vacancy status, and ratings
// ============================================================

import { NearbyFacility } from '../types';
import { Star, MapPin, Phone, CheckCircle, AlertTriangle, AlertCircle } from 'lucide-react';

interface HotelCardProps {
  hotel: NearbyFacility;
}

export default function HotelCard({ hotel }: HotelCardProps) {
  const getVacancyBadge = (status?: string) => {
    switch (status) {
      case 'available':
        return (
          <span className="density-badge low" style={{ fontSize: '0.65rem' }}>
            <CheckCircle size={10} /> Vacancies Available
          </span>
        );
      case 'limited':
        return (
          <span className="density-badge moderate" style={{ fontSize: '0.65rem' }}>
            <AlertTriangle size={10} /> Limited Rooms
          </span>
        );
      case 'full':
      default:
        return (
          <span className="density-badge critical" style={{ fontSize: '0.65rem' }}>
            <AlertCircle size={10} /> Fully Booked
          </span>
        );
    }
  };

  return (
    <div className="glass-card no-hover" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h4 style={{ margin: 0, fontWeight: 700, fontSize: '0.95rem' }}>{hotel.name}</h4>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>{hotel.address}</span>
        </div>
        {getVacancyBadge(hotel.vacancy)}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
        {hotel.rating && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Star size={14} fill="var(--color-gold)" stroke="var(--color-gold)" />
            <span>{hotel.rating} / 5</span>
          </div>
        )}
        <div>
          Price Range: <strong style={{ color: 'var(--color-gold)' }}>{hotel.priceRange || '$$'}</strong>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <MapPin size={12} style={{ color: 'var(--color-teal)' }} />
          <span>{hotel.distanceKm} km from Stadium</span>
        </div>
      </div>

      {hotel.phone && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--color-text-tertiary)' }}>
          <Phone size={12} />
          <span>{hotel.phone}</span>
        </div>
      )}

      {hotel.details && (
        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-text-secondary)', background: 'rgba(255,255,255,0.02)', padding: '8px', borderRadius: '4px', border: '1px solid var(--glass-border)' }}>
          {hotel.details}
        </p>
      )}

      <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
        <a
          href="https://www.fifa.com/en/tickets"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-secondary btn-sm"
          style={{ flex: 1, justifyContent: 'center' }}
        >
          Check Rates
        </a>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotel.name + ' ' + hotel.address)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary btn-sm"
          style={{ flex: 1, justifyContent: 'center' }}
        >
          Map Route
        </a>
      </div>
    </div>
  );
}
