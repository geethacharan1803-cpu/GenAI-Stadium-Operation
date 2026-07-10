// ============================================================
// Crowd Simulation Engine
// Generates realistic, continuously-updating crowd data.
// When judges upload real data, the simulator uses that instead.
// ============================================================

import {
  CrowdSnapshot,
  GateSnapshot,
  ZoneSnapshot,
  DensityLevel,
  StadiumConfig,
  AIInsight,
  ParsedData,
} from '../types';

function getDensityLevel(pct: number): DensityLevel {
  if (pct < 40) return 'low';
  if (pct < 65) return 'moderate';
  if (pct < 85) return 'high';
  return 'critical';
}

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

/** Simulates a realistic pre-match crowd buildup curve */
function getTimeFactor(): number {
  const now = new Date();
  const minutes = now.getMinutes() + now.getSeconds() / 60;
  // Create a sinusoidal pattern that simulates crowd waves
  const wave1 = Math.sin((minutes / 60) * Math.PI * 2) * 0.3;
  const wave2 = Math.sin((minutes / 20) * Math.PI * 2) * 0.15;
  const base = 0.5 + wave1 + wave2;
  return clamp(base, 0.1, 0.95);
}

export function generateCrowdSnapshot(
  stadium: StadiumConfig,
  previous?: CrowdSnapshot,
  uploadedData?: ParsedData
): CrowdSnapshot {
  const timeFactor = getTimeFactor();
  const smoothingFactor = 0.7; // How much previous values influence new ones

  // If uploaded data is crowd-type, use it as basis
  if (uploadedData && uploadedData.detectedType === 'crowd_data') {
    return generateFromUploadedData(stadium, uploadedData, timeFactor);
  }

  const gateData: GateSnapshot[] = stadium.gates.map((gate, i) => {
    const prevGate = previous?.gateData?.find(g => g.gateId === gate.id);
    const baseLoad = timeFactor * 100 + randomBetween(-15, 15);
    // Add gate-specific variation (some gates are naturally busier)
    const gateVariation = Math.sin(i * 1.5 + Date.now() / 10000) * 20;
    let load = clamp(baseLoad + gateVariation, 5, 98);

    if (prevGate) {
      load = prevGate.load * smoothingFactor + load * (1 - smoothingFactor);
    }

    const waitTime = Math.max(0, Math.round((load / 100) * 25 + randomBetween(-2, 2)));
    const throughput = Math.round(clamp(60 - (load / 100) * 35 + randomBetween(-3, 3), 15, 60));

    return {
      gateId: gate.id,
      load: Math.round(load),
      waitTime,
      throughput,
    };
  });

  const zoneData: ZoneSnapshot[] = stadium.zones
    .filter(z => z.type !== 'field')
    .map((zone, i) => {
      const prevZone = previous?.zoneData?.find(z => z.zoneId === zone.id);
      const baseOccupancy = timeFactor * zone.capacity;
      const zoneVariation = Math.sin(i * 2.1 + Date.now() / 12000) * zone.capacity * 0.1;
      let occupancy = clamp(baseOccupancy + zoneVariation + randomBetween(-zone.capacity * 0.05, zone.capacity * 0.05), 0, zone.capacity);

      if (prevZone) {
        occupancy = prevZone.occupancy * smoothingFactor + occupancy * (1 - smoothingFactor);
      }

      const densityPct = (occupancy / zone.capacity) * 100;

      return {
        zoneId: zone.id,
        occupancy: Math.round(occupancy),
        density: getDensityLevel(densityPct),
      };
    });

  const totalAttendance = zoneData.reduce((sum, z) => sum + z.occupancy, 0);
  const avgLoad = gateData.reduce((s, g) => s + g.load, 0) / gateData.length;
  const entryRate = gateData.reduce((s, g) => s + g.throughput, 0);
  const exitRate = Math.round(entryRate * randomBetween(0.05, 0.2));

  return {
    timestamp: new Date(),
    totalAttendance,
    gateData,
    zoneData,
    overallDensity: getDensityLevel(avgLoad),
    entryRate,
    exitRate,
  };
}

function generateFromUploadedData(
  stadium: StadiumConfig,
  data: ParsedData,
  timeFactor: number
): CrowdSnapshot {
  // Use uploaded data rows to seed realistic values
  const latestRows = data.rows.slice(-stadium.gates.length);

  const gateData: GateSnapshot[] = stadium.gates.map((gate, i) => {
    const row = latestRows[i % latestRows.length];
    const load = typeof row?.['people_count'] === 'number'
      ? clamp((row['people_count'] as number / gate.capacity) * 100, 5, 98)
      : timeFactor * 100 + randomBetween(-10, 10);

    return {
      gateId: gate.id,
      load: Math.round(clamp(load, 5, 98)),
      waitTime: (row?.['wait_time_minutes'] as number) || Math.round(load / 5),
      throughput: (row?.['throughput_per_minute'] as number) || Math.round(60 - load / 3),
    };
  });

  const zoneData: ZoneSnapshot[] = stadium.zones
    .filter(z => z.type !== 'field')
    .map(zone => {
      const occ = Math.round(timeFactor * zone.capacity * randomBetween(0.8, 1.2));
      return {
        zoneId: zone.id,
        occupancy: clamp(occ, 0, zone.capacity),
        density: getDensityLevel((occ / zone.capacity) * 100),
      };
    });

  const totalAttendance = zoneData.reduce((s, z) => s + z.occupancy, 0);
  const entryRate = gateData.reduce((s, g) => s + g.throughput, 0);

  return {
    timestamp: new Date(),
    totalAttendance,
    gateData,
    zoneData,
    overallDensity: getDensityLevel(gateData.reduce((s, g) => s + g.load, 0) / gateData.length),
    entryRate,
    exitRate: Math.round(entryRate * 0.1),
  };
}

/** Generate AI insights based on current crowd data */
export function generateInsights(snapshot: CrowdSnapshot, stadium: StadiumConfig): AIInsight[] {
  const insights: AIInsight[] = [];
  const now = new Date();

  // Find the most congested gate
  const sortedGates = [...snapshot.gateData].sort((a, b) => b.load - a.load);
  const busiestGate = sortedGates[0];
  const leastBusyGate = sortedGates[sortedGates.length - 1];
  const busiestGateName = stadium.gates.find(g => g.id === busiestGate.gateId)?.name || busiestGate.gateId;
  const leastBusyGateName = stadium.gates.find(g => g.id === leastBusyGate.gateId)?.name || leastBusyGate.gateId;

  if (busiestGate.load > 80) {
    insights.push({
      id: `alert-gate-${now.getTime()}`,
      type: 'alert',
      title: `${busiestGateName} Congestion Alert`,
      content: `${busiestGateName} is at ${busiestGate.load}% capacity with ${busiestGate.waitTime} min wait. Consider redirecting to ${leastBusyGateName} (${leastBusyGate.load}% capacity).`,
      severity: busiestGate.load > 90 ? 'critical' : 'high',
      timestamp: now,
    });
  }

  // Overall attendance insight
  const attendancePct = Math.round((snapshot.totalAttendance / stadium.capacity) * 100);
  if (attendancePct > 70) {
    insights.push({
      id: `info-attendance-${now.getTime()}`,
      type: 'info',
      title: 'Stadium Filling Up',
      content: `Stadium is at ${attendancePct}% capacity (${snapshot.totalAttendance.toLocaleString()} / ${stadium.capacity.toLocaleString()}). Entry rate: ${snapshot.entryRate} people/min.`,
      severity: attendancePct > 90 ? 'critical' : 'medium',
      timestamp: now,
    });
  }

  // Find critical zones
  const criticalZones = snapshot.zoneData.filter(z => z.density === 'critical');
  if (criticalZones.length > 0) {
    const zoneNames = criticalZones.map(z => stadium.zones.find(sz => sz.id === z.zoneId)?.name || z.zoneId).join(', ');
    insights.push({
      id: `alert-zones-${now.getTime()}`,
      type: 'alert',
      title: 'Critical Zone Density',
      content: `${criticalZones.length} zone(s) at critical density: ${zoneNames}. Recommend activating crowd flow protocols.`,
      severity: 'critical',
      timestamp: now,
    });
  }

  // Recommendation for best entry
  insights.push({
    id: `rec-entry-${now.getTime()}`,
    type: 'recommendation',
    title: 'Best Entry Gate Right Now',
    content: `${leastBusyGateName} has the shortest wait (${leastBusyGate.waitTime} min) at ${leastBusyGate.load}% capacity. Throughput: ${leastBusyGate.throughput} people/min.`,
    severity: 'low',
    timestamp: now,
  });

  return insights;
}
