// ============================================================
// Stadium Blueprint Component
// Detailed seating tier visualization and section analysis
// ============================================================

import { useState } from 'react';
import { useTranslation } from '../i18n';
import { Shield, Accessibility, HelpCircle } from 'lucide-react';

interface Section {
  id: string;
  name: string;
  capacity: number;
  occupancy: number;
  price: string;
  accessibility: boolean;
  gate: string;
  aiTip: string;
}

interface StadiumBlueprintProps {
  stadiumId: string;
  onSectionClick?: (section: Section) => void;
}

export default function StadiumBlueprint({ stadiumId, onSectionClick }: StadiumBlueprintProps) {
  const { t } = useTranslation();
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);

  // Structural sections matching stadium blueprints
  const sections: Section[] = [
    { id: 'sec-101', name: 'Lower Tier - Section 101 (North)', capacity: 1200, occupancy: 950, price: '$150', accessibility: true, gate: 'Gate A', aiTip: 'Gate A is experiencing high density. Best entry is through Gate E to Section 101.' },
    { id: 'sec-102', name: 'Lower Tier - Section 102 (East)', capacity: 1500, occupancy: 1450, price: '$150', accessibility: true, gate: 'Gate B', aiTip: 'Section 102 is near capacity. Concourse restrooms here have a 12-minute wait. Use East concourse restrooms.' },
    { id: 'sec-103', name: 'Lower Tier - Section 103 (South)', capacity: 1200, occupancy: 800, price: '$150', accessibility: false, gate: 'Gate C', aiTip: 'Recommended path is south concourse. Low density area.' },
    { id: 'sec-104', name: 'Lower Tier - Section 104 (West)', capacity: 1500, occupancy: 1100, price: '$150', accessibility: true, gate: 'Gate D', aiTip: 'West exit from Section 104 connects directly to Taxi & Rideshare point.' },
    { id: 'sec-201', name: 'Club Suites - Section 201', capacity: 600, occupancy: 580, price: '$450', accessibility: true, gate: 'Gate E', aiTip: 'Exclusive express elevator access near Gate E. Premium dining available.' },
    { id: 'sec-301', name: 'Upper Tier - Section 301 (North)', capacity: 2000, occupancy: 1800, price: '$75', accessibility: false, gate: 'Gate A', aiTip: 'Requires stairs. Food Court Alpha is directly below on Concourse N.' },
    { id: 'sec-302', name: 'Upper Tier - Section 302 (South)', capacity: 2000, occupancy: 1200, price: '$75', accessibility: true, gate: 'Gate C', aiTip: 'Family friendly area. Direct access to secondary medical center.' }
  ];

  const handleSelect = (sec: Section) => {
    setSelectedSection(sec);
    if (onSectionClick) onSectionClick(sec);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
      {/* Blueprint SVG */}
      <div className="glass-card no-hover" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div className="glass-card-title" style={{ width: '100%', marginBottom: '12px' }}>Stadium Layout Blueprint</div>
        <svg role="img" aria-label="Interactive Stadium Seating Blueprint" viewBox="0 0 400 400" style={{ width: '100%', maxHeight: '300px' }}>
          <defs>
            <radialGradient id="fieldGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#2a6f2a" />
              <stop offset="100%" stopColor="#1a4f1a" />
            </radialGradient>
          </defs>

          {/* Stadium outer bowl */}
          <rect x="10" y="10" width="380" height="380" rx="190" fill="none" stroke="var(--glass-border)" strokeWidth="3" />
          
          {/* Upper Tier Blocks */}
          <path d="M 60 60 A 170 170 0 0 1 340 60 L 300 100 A 120 120 0 0 0 100 100 Z" 
            fill={selectedSection?.id === 'sec-301' ? 'var(--color-teal)' : '#1a1f4a'} 
            stroke="var(--glass-border)" 
            onClick={() => handleSelect(sections[5])}
            style={{ cursor: 'pointer', transition: 'fill 0.3s' }}
          />
          <path d="M 60 340 A 170 170 0 0 0 340 340 L 300 300 A 120 120 0 0 1 100 300 Z" 
            fill={selectedSection?.id === 'sec-302' ? 'var(--color-teal)' : '#1a1f4a'} 
            stroke="var(--glass-border)" 
            onClick={() => handleSelect(sections[6])}
            style={{ cursor: 'pointer', transition: 'fill 0.3s' }}
          />

          {/* Lower Tier Blocks */}
          <path d="M 110 110 A 110 110 0 0 1 290 110 L 260 140 A 70 70 0 0 0 140 140 Z" 
            fill={selectedSection?.id === 'sec-101' ? 'var(--color-teal)' : '#111638'} 
            stroke="var(--glass-border)" 
            onClick={() => handleSelect(sections[0])}
            style={{ cursor: 'pointer', transition: 'fill 0.3s' }}
          />
          <path d="M 290 110 A 110 110 0 0 1 290 290 L 260 260 A 70 70 0 0 0 260 140 Z" 
            fill={selectedSection?.id === 'sec-102' ? 'var(--color-teal)' : '#111638'} 
            stroke="var(--glass-border)" 
            onClick={() => handleSelect(sections[1])}
            style={{ cursor: 'pointer', transition: 'fill 0.3s' }}
          />
          <path d="M 290 290 A 110 110 0 0 1 110 290 L 140 260 A 70 70 0 0 0 260 260 Z" 
            fill={selectedSection?.id === 'sec-103' ? 'var(--color-teal)' : '#111638'} 
            stroke="var(--glass-border)" 
            onClick={() => handleSelect(sections[2])}
            style={{ cursor: 'pointer', transition: 'fill 0.3s' }}
          />
          <path d="M 110 290 A 110 110 0 0 1 110 110 L 140 140 A 70 70 0 0 0 140 260 Z" 
            fill={selectedSection?.id === 'sec-104' ? 'var(--color-teal)' : '#111638'} 
            stroke="var(--glass-border)" 
            onClick={() => handleSelect(sections[3])}
            style={{ cursor: 'pointer', transition: 'fill 0.3s' }}
          />

          {/* Club Suites (Center Ring) */}
          <ellipse cx="200" cy="200" rx="55" ry="40" fill={selectedSection?.id === 'sec-201' ? 'var(--color-teal)' : '#1e2452'} stroke="var(--color-gold)" strokeWidth="1.5" onClick={() => handleSelect(sections[4])} style={{ cursor: 'pointer', transition: 'fill 0.3s' }} />

          {/* Football Field Pitch */}
          <rect x="165" y="175" width="70" height="50" fill="url(#fieldGrad)" stroke="#fff" strokeWidth="1" style={{ pointerEvents: 'none' }} />
          <line x1="200" y1="175" x2="200" y2="225" stroke="#fff" strokeWidth="1" />
          <circle cx="200" cy="200" r="10" fill="none" stroke="#fff" strokeWidth="1" />
        </svg>
        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)', marginTop: '8px' }}>Select any seating block to view details & AI recommendations</span>
      </div>

      {/* Seating Details & AI Guidance */}
      <div className="glass-card no-hover">
        {selectedSection ? (
          <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 className="glass-card-title">{selectedSection.name}</h3>
              <span className="density-badge low">{selectedSection.price}</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px', fontSize: '0.85rem' }}>
              <div>
                <span style={{ color: 'var(--color-text-secondary)' }}>Capacity:</span>{' '}
                <strong>{selectedSection.capacity} seats</strong>
              </div>
              <div>
                <span style={{ color: 'var(--color-text-secondary)' }}>Occupancy:</span>{' '}
                <strong>{selectedSection.occupancy} ({Math.round((selectedSection.occupancy / selectedSection.capacity) * 100)}%)</strong>
              </div>
              <div>
                <span style={{ color: 'var(--color-text-secondary)' }}>Entry Gate:</span>{' '}
                <strong>{selectedSection.gate}</strong>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Accessibility:</span>{' '}
                {selectedSection.accessibility ? (
                  <Accessibility size={16} style={{ color: 'var(--color-teal)' }} title="Wheelchair accessible" />
                ) : (
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>Stairs only</span>
                )}
              </div>
            </div>

            {/* AI Guidance Area */}
            <div style={{ background: 'rgba(6,214,160,0.06)', borderLeft: '3px solid var(--color-teal)', padding: '10px 14px', borderRadius: '4px', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-teal)', fontWeight: 'bold', marginBottom: '4px' }}>
                <Shield size={14} />
                <span>AI Seating Guide</span>
              </div>
              <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                {selectedSection.aiTip}
              </p>
            </div>
          </div>
        ) : (
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-tertiary)', textAlign: 'center' }}>
            <HelpCircle size={32} style={{ marginBottom: '8px', opacity: 0.5 }} />
            <p>Select a section on the blueprint map to view security, tickets, capacity, and real-time AI access warnings.</p>
          </div>
        )}
      </div>
    </div>
  );
}
