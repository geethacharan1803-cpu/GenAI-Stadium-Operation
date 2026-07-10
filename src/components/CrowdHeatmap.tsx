import { CrowdSnapshot, StadiumConfig } from '../types';
import { DENSITY_COLORS } from '../utils/stadiumData';

interface CrowdHeatmapProps {
  stadium: StadiumConfig;
  crowdData: CrowdSnapshot;
}

export default function CrowdHeatmap({ stadium, crowdData }: CrowdHeatmapProps) {
  const zones = stadium.zones.filter(z => z.type !== 'field');

  // Create a grid representation
  const gridSize = Math.ceil(Math.sqrt(zones.length + stadium.gates.length));

  const items = [
    ...zones.map(zone => {
      const data = crowdData.zoneData.find(z => z.zoneId === zone.id);
      const occupancyPct = data ? Math.round((data.occupancy / zone.capacity) * 100) : 0;
      return {
        id: zone.id,
        label: zone.name.split(' - ').pop()?.split(' ').slice(-1)[0] || zone.name,
        value: occupancyPct,
        density: data?.density || 'low',
        type: 'zone' as const,
      };
    }),
    ...stadium.gates.map(gate => {
      const data = crowdData.gateData.find(g => g.gateId === gate.id);
      return {
        id: gate.id,
        label: gate.name.replace('Gate ', 'G'),
        value: data?.load || 0,
        density: data && data.load > 85 ? 'critical' : data && data.load > 65 ? 'high' : data && data.load > 40 ? 'moderate' : 'low',
        type: 'gate' as const,
      };
    }),
  ];

  return (
    <div
      className="heatmap-grid"
      style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
      role="img"
      aria-label="Crowd density heatmap"
    >
      {items.map(item => {
        const color = DENSITY_COLORS[item.density] || DENSITY_COLORS.low;
        const opacity = 0.15 + (item.value / 100) * 0.7;

        return (
          <div
            key={item.id}
            className="heatmap-cell"
            style={{
              backgroundColor: color,
              opacity,
              border: `1px solid ${color}33`,
            }}
            title={`${item.label}: ${item.value}%`}
            role="gridcell"
            aria-label={`${item.label}: ${item.value}% ${item.density}`}
          >
            <div className="heatmap-cell-label">
              {item.label}
              <br />
              {item.value}%
            </div>
          </div>
        );
      })}
    </div>
  );
}
