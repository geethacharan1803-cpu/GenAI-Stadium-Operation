// ============================================================
// Sample Data for Judge Testing
// Downloadable CSV/JSON for testing the data upload feature
// ============================================================

export const SAMPLE_CROWD_CSV = `timestamp,gate_id,gate_name,people_count,wait_time_minutes,throughput_per_minute,status
2026-07-10T17:00:00,gate-a,Gate A,320,3,45,open
2026-07-10T17:00:00,gate-b,Gate B,580,8,38,congested
2026-07-10T17:00:00,gate-c,Gate C,210,2,52,open
2026-07-10T17:00:00,gate-d,Gate D,450,6,41,open
2026-07-10T17:15:00,gate-a,Gate A,680,7,42,congested
2026-07-10T17:15:00,gate-b,Gate B,890,14,35,congested
2026-07-10T17:15:00,gate-c,Gate C,390,4,48,open
2026-07-10T17:15:00,gate-d,Gate D,720,9,39,congested
2026-07-10T17:30:00,gate-a,Gate A,1200,12,38,congested
2026-07-10T17:30:00,gate-b,Gate B,1450,18,30,congested
2026-07-10T17:30:00,gate-c,Gate C,780,7,44,open
2026-07-10T17:30:00,gate-d,Gate D,1100,11,36,congested
2026-07-10T17:45:00,gate-a,Gate A,1800,16,34,congested
2026-07-10T17:45:00,gate-b,Gate B,1920,22,28,congested
2026-07-10T17:45:00,gate-c,Gate C,1350,10,40,congested
2026-07-10T17:45:00,gate-d,Gate D,1650,14,33,congested
2026-07-10T18:00:00,gate-a,Gate A,2100,18,32,congested
2026-07-10T18:00:00,gate-b,Gate B,2350,25,26,congested
2026-07-10T18:00:00,gate-c,Gate C,1800,13,37,congested
2026-07-10T18:00:00,gate-d,Gate D,1950,16,31,congested
2026-07-10T18:15:00,gate-a,Gate A,1500,11,39,congested
2026-07-10T18:15:00,gate-b,Gate B,1200,9,42,congested
2026-07-10T18:15:00,gate-c,Gate C,900,6,46,open
2026-07-10T18:15:00,gate-d,Gate D,1100,8,43,congested
2026-07-10T18:30:00,gate-a,Gate A,600,4,50,open
2026-07-10T18:30:00,gate-b,Gate B,450,3,52,open
2026-07-10T18:30:00,gate-c,Gate C,300,2,54,open
2026-07-10T18:30:00,gate-d,Gate D,380,3,51,open`;

export const SAMPLE_ZONE_CSV = `timestamp,zone_id,zone_name,occupancy,capacity,density_pct,density_level
2026-07-10T17:00:00,zone-100,Lower Bowl North,2100,15000,14,low
2026-07-10T17:00:00,zone-200,Lower Bowl East,1800,12000,15,low
2026-07-10T17:00:00,zone-300,Lower Bowl South,1500,15000,10,low
2026-07-10T17:00:00,zone-400,Lower Bowl West,1200,12000,10,low
2026-07-10T17:00:00,zone-vip,VIP Suites,800,5000,16,low
2026-07-10T17:30:00,zone-100,Lower Bowl North,7500,15000,50,moderate
2026-07-10T17:30:00,zone-200,Lower Bowl East,6200,12000,52,moderate
2026-07-10T17:30:00,zone-300,Lower Bowl South,5800,15000,39,moderate
2026-07-10T17:30:00,zone-400,Lower Bowl West,5100,12000,43,moderate
2026-07-10T17:30:00,zone-vip,VIP Suites,2800,5000,56,moderate
2026-07-10T18:00:00,zone-100,Lower Bowl North,12800,15000,85,high
2026-07-10T18:00:00,zone-200,Lower Bowl East,10200,12000,85,high
2026-07-10T18:00:00,zone-300,Lower Bowl South,11500,15000,77,high
2026-07-10T18:00:00,zone-400,Lower Bowl West,9600,12000,80,high
2026-07-10T18:00:00,zone-vip,VIP Suites,4200,5000,84,high
2026-07-10T18:30:00,zone-100,Lower Bowl North,14200,15000,95,critical
2026-07-10T18:30:00,zone-200,Lower Bowl East,11400,12000,95,critical
2026-07-10T18:30:00,zone-300,Lower Bowl South,13800,15000,92,critical
2026-07-10T18:30:00,zone-400,Lower Bowl West,11200,12000,93,critical
2026-07-10T18:30:00,zone-vip,VIP Suites,4700,5000,94,critical`;

export function downloadSampleCSV(type: 'crowd' | 'zone') {
  const data = type === 'crowd' ? SAMPLE_CROWD_CSV : SAMPLE_ZONE_CSV;
  const filename = type === 'crowd' ? 'sample_crowd_sensors.csv' : 'sample_zone_occupancy.csv';
  const blob = new Blob([data], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
