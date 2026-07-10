// ============================================================
// FIFA World Cup 2026 — Stadium Configuration Data
// Coordinates, capacities, gates, zones, and amenities
// ============================================================

import { StadiumConfig, MatchInfo } from '../types';

export const FIFA_2026_STADIUMS: StadiumConfig[] = [
  {
    id: 'metlife',
    name: 'MetLife Stadium',
    city: 'East Rutherford, NJ',
    country: 'USA',
    capacity: 82500,
    latitude: 40.8135,
    longitude: -74.0744,
    gates: [
      { id: 'gate-a', name: 'Gate A', direction: 'north', capacity: 5000, currentLoad: 0, waitTimeMinutes: 0, status: 'open', position: { x: 250, y: 30 } },
      { id: 'gate-b', name: 'Gate B', direction: 'east', capacity: 4500, currentLoad: 0, waitTimeMinutes: 0, status: 'open', position: { x: 470, y: 200 } },
      { id: 'gate-c', name: 'Gate C', direction: 'south', capacity: 5000, currentLoad: 0, waitTimeMinutes: 0, status: 'open', position: { x: 250, y: 370 } },
      { id: 'gate-d', name: 'Gate D', direction: 'west', capacity: 4500, currentLoad: 0, waitTimeMinutes: 0, status: 'open', position: { x: 30, y: 200 } },
      { id: 'gate-e', name: 'Gate E', direction: 'northeast', capacity: 3500, currentLoad: 0, waitTimeMinutes: 0, status: 'open', position: { x: 410, y: 70 } },
      { id: 'gate-f', name: 'Gate F', direction: 'southeast', capacity: 3500, currentLoad: 0, waitTimeMinutes: 0, status: 'open', position: { x: 410, y: 330 } },
    ],
    zones: [
      { id: 'zone-100', name: 'Lower Bowl - North', type: 'seating', capacity: 15000, currentOccupancy: 0, densityLevel: 'low', position: { x: 140, y: 80, width: 220, height: 60 } },
      { id: 'zone-200', name: 'Lower Bowl - East', type: 'seating', capacity: 12000, currentOccupancy: 0, densityLevel: 'low', position: { x: 360, y: 140, width: 60, height: 120 } },
      { id: 'zone-300', name: 'Lower Bowl - South', type: 'seating', capacity: 15000, currentOccupancy: 0, densityLevel: 'low', position: { x: 140, y: 260, width: 220, height: 60 } },
      { id: 'zone-400', name: 'Lower Bowl - West', type: 'seating', capacity: 12000, currentOccupancy: 0, densityLevel: 'low', position: { x: 80, y: 140, width: 60, height: 120 } },
      { id: 'zone-vip', name: 'VIP Suites', type: 'vip', capacity: 5000, currentOccupancy: 0, densityLevel: 'low', position: { x: 180, y: 150, width: 140, height: 100 } },
      { id: 'zone-concourse-n', name: 'North Concourse', type: 'concourse', capacity: 8000, currentOccupancy: 0, densityLevel: 'low', position: { x: 100, y: 50, width: 300, height: 30 } },
      { id: 'zone-concourse-s', name: 'South Concourse', type: 'concourse', capacity: 8000, currentOccupancy: 0, densityLevel: 'low', position: { x: 100, y: 320, width: 300, height: 30 } },
      { id: 'zone-field', name: 'Field', type: 'field', capacity: 0, currentOccupancy: 0, densityLevel: 'low', position: { x: 200, y: 170, width: 100, height: 60 } },
    ],
    amenities: [
      { id: 'food-1', name: 'Food Court Alpha', type: 'food', zone: 'zone-concourse-n', position: { x: 150, y: 55 }, waitTimeMinutes: 0, isOpen: true },
      { id: 'food-2', name: 'Food Court Beta', type: 'food', zone: 'zone-concourse-s', position: { x: 350, y: 330 }, waitTimeMinutes: 0, isOpen: true },
      { id: 'food-3', name: 'Premium Dining', type: 'food', zone: 'zone-vip', position: { x: 220, y: 160 }, waitTimeMinutes: 0, isOpen: true },
      { id: 'restroom-1', name: 'Restroom North', type: 'restroom', zone: 'zone-concourse-n', position: { x: 300, y: 55 }, waitTimeMinutes: 0, isOpen: true },
      { id: 'restroom-2', name: 'Restroom South', type: 'restroom', zone: 'zone-concourse-s', position: { x: 200, y: 330 }, waitTimeMinutes: 0, isOpen: true },
      { id: 'restroom-3', name: 'Restroom East', type: 'restroom', zone: 'zone-200', position: { x: 380, y: 200 }, waitTimeMinutes: 0, isOpen: true },
      { id: 'firstaid-1', name: 'Medical Station 1', type: 'first_aid', zone: 'zone-concourse-n', position: { x: 120, y: 55 }, waitTimeMinutes: 0, isOpen: true },
      { id: 'firstaid-2', name: 'Medical Station 2', type: 'first_aid', zone: 'zone-concourse-s', position: { x: 380, y: 330 }, waitTimeMinutes: 0, isOpen: true },
      { id: 'merch-1', name: 'Official FIFA Store', type: 'merchandise', zone: 'zone-concourse-n', position: { x: 250, y: 55 }, waitTimeMinutes: 0, isOpen: true },
      { id: 'merch-2', name: 'Team Merchandise', type: 'merchandise', zone: 'zone-concourse-s', position: { x: 150, y: 330 }, waitTimeMinutes: 0, isOpen: true },
      { id: 'info-1', name: 'Information Desk', type: 'info', zone: 'zone-concourse-n', position: { x: 200, y: 55 }, waitTimeMinutes: 0, isOpen: true },
      { id: 'water-1', name: 'Water Station', type: 'water', zone: 'zone-concourse-n', position: { x: 350, y: 55 }, waitTimeMinutes: 0, isOpen: true },
      { id: 'water-2', name: 'Water Station South', type: 'water', zone: 'zone-concourse-s', position: { x: 280, y: 330 }, waitTimeMinutes: 0, isOpen: true },
      { id: 'atm-1', name: 'ATM North', type: 'atm', zone: 'zone-concourse-n', position: { x: 180, y: 55 }, waitTimeMinutes: 0, isOpen: true },
    ],
  },
  {
    id: 'att',
    name: 'AT&T Stadium',
    city: 'Arlington, TX',
    country: 'USA',
    capacity: 80000,
    latitude: 32.7473,
    longitude: -97.0928,
    gates: [
      { id: 'gate-a', name: 'Gate A', direction: 'north', capacity: 5000, currentLoad: 0, waitTimeMinutes: 0, status: 'open', position: { x: 250, y: 30 } },
      { id: 'gate-b', name: 'Gate B', direction: 'east', capacity: 4000, currentLoad: 0, waitTimeMinutes: 0, status: 'open', position: { x: 470, y: 200 } },
      { id: 'gate-c', name: 'Gate C', direction: 'south', capacity: 5000, currentLoad: 0, waitTimeMinutes: 0, status: 'open', position: { x: 250, y: 370 } },
      { id: 'gate-d', name: 'Gate D', direction: 'west', capacity: 4000, currentLoad: 0, waitTimeMinutes: 0, status: 'open', position: { x: 30, y: 200 } },
    ],
    zones: [
      { id: 'zone-100', name: 'Lower Level', type: 'seating', capacity: 25000, currentOccupancy: 0, densityLevel: 'low', position: { x: 120, y: 80, width: 260, height: 240 } },
      { id: 'zone-200', name: 'Club Level', type: 'vip', capacity: 15000, currentOccupancy: 0, densityLevel: 'low', position: { x: 140, y: 100, width: 220, height: 200 } },
      { id: 'zone-300', name: 'Upper Level', type: 'seating', capacity: 30000, currentOccupancy: 0, densityLevel: 'low', position: { x: 100, y: 60, width: 300, height: 280 } },
      { id: 'zone-concourse', name: 'Main Concourse', type: 'concourse', capacity: 10000, currentOccupancy: 0, densityLevel: 'low', position: { x: 90, y: 45, width: 320, height: 310 } },
      { id: 'zone-field', name: 'Field', type: 'field', capacity: 0, currentOccupancy: 0, densityLevel: 'low', position: { x: 200, y: 170, width: 100, height: 60 } },
    ],
    amenities: [
      { id: 'food-1', name: 'BBQ Pavilion', type: 'food', zone: 'zone-concourse', position: { x: 150, y: 50 }, waitTimeMinutes: 0, isOpen: true },
      { id: 'food-2', name: 'International Cuisine', type: 'food', zone: 'zone-concourse', position: { x: 350, y: 350 }, waitTimeMinutes: 0, isOpen: true },
      { id: 'restroom-1', name: 'Restroom North', type: 'restroom', zone: 'zone-concourse', position: { x: 300, y: 50 }, waitTimeMinutes: 0, isOpen: true },
      { id: 'restroom-2', name: 'Restroom South', type: 'restroom', zone: 'zone-concourse', position: { x: 200, y: 350 }, waitTimeMinutes: 0, isOpen: true },
      { id: 'firstaid-1', name: 'Medical Center', type: 'first_aid', zone: 'zone-concourse', position: { x: 100, y: 200 }, waitTimeMinutes: 0, isOpen: true },
      { id: 'merch-1', name: 'FIFA Official Store', type: 'merchandise', zone: 'zone-concourse', position: { x: 250, y: 50 }, waitTimeMinutes: 0, isOpen: true },
      { id: 'info-1', name: 'Fan Info Hub', type: 'info', zone: 'zone-concourse', position: { x: 400, y: 200 }, waitTimeMinutes: 0, isOpen: true },
      { id: 'water-1', name: 'Hydration Station', type: 'water', zone: 'zone-concourse', position: { x: 180, y: 50 }, waitTimeMinutes: 0, isOpen: true },
    ],
  },
  {
    id: 'sofistadium',
    name: 'SoFi Stadium',
    city: 'Inglewood, CA',
    country: 'USA',
    capacity: 70240,
    latitude: 33.9534,
    longitude: -118.3387,
    gates: [
      { id: 'gate-a', name: 'Gate A', direction: 'north', capacity: 4500, currentLoad: 0, waitTimeMinutes: 0, status: 'open', position: { x: 250, y: 30 } },
      { id: 'gate-b', name: 'Gate B', direction: 'east', capacity: 4000, currentLoad: 0, waitTimeMinutes: 0, status: 'open', position: { x: 470, y: 200 } },
      { id: 'gate-c', name: 'Gate C', direction: 'south', capacity: 4500, currentLoad: 0, waitTimeMinutes: 0, status: 'open', position: { x: 250, y: 370 } },
      { id: 'gate-d', name: 'Gate D', direction: 'west', capacity: 4000, currentLoad: 0, waitTimeMinutes: 0, status: 'open', position: { x: 30, y: 200 } },
      { id: 'gate-e', name: 'Gate E', direction: 'northwest', capacity: 3000, currentLoad: 0, waitTimeMinutes: 0, status: 'open', position: { x: 90, y: 70 } },
    ],
    zones: [
      { id: 'zone-100', name: 'Premier Level', type: 'seating', capacity: 20000, currentOccupancy: 0, densityLevel: 'low', position: { x: 120, y: 80, width: 260, height: 240 } },
      { id: 'zone-200', name: 'Terrace Level', type: 'seating', capacity: 25000, currentOccupancy: 0, densityLevel: 'low', position: { x: 100, y: 60, width: 300, height: 280 } },
      { id: 'zone-vip', name: 'SoFi Club', type: 'vip', capacity: 10000, currentOccupancy: 0, densityLevel: 'low', position: { x: 160, y: 120, width: 180, height: 160 } },
      { id: 'zone-concourse', name: 'Grand Concourse', type: 'concourse', capacity: 15000, currentOccupancy: 0, densityLevel: 'low', position: { x: 90, y: 45, width: 320, height: 310 } },
      { id: 'zone-field', name: 'Field', type: 'field', capacity: 0, currentOccupancy: 0, densityLevel: 'low', position: { x: 200, y: 170, width: 100, height: 60 } },
    ],
    amenities: [
      { id: 'food-1', name: 'Hollywood Eats', type: 'food', zone: 'zone-concourse', position: { x: 150, y: 50 }, waitTimeMinutes: 0, isOpen: true },
      { id: 'food-2', name: 'World Street Food', type: 'food', zone: 'zone-concourse', position: { x: 350, y: 350 }, waitTimeMinutes: 0, isOpen: true },
      { id: 'restroom-1', name: 'Restroom A', type: 'restroom', zone: 'zone-concourse', position: { x: 300, y: 50 }, waitTimeMinutes: 0, isOpen: true },
      { id: 'restroom-2', name: 'Restroom B', type: 'restroom', zone: 'zone-concourse', position: { x: 200, y: 350 }, waitTimeMinutes: 0, isOpen: true },
      { id: 'firstaid-1', name: 'First Aid Station', type: 'first_aid', zone: 'zone-concourse', position: { x: 100, y: 200 }, waitTimeMinutes: 0, isOpen: true },
      { id: 'merch-1', name: 'FIFA Megastore', type: 'merchandise', zone: 'zone-concourse', position: { x: 250, y: 50 }, waitTimeMinutes: 0, isOpen: true },
      { id: 'info-1', name: 'Welcome Center', type: 'info', zone: 'zone-concourse', position: { x: 400, y: 200 }, waitTimeMinutes: 0, isOpen: true },
      { id: 'water-1', name: 'Water Refill', type: 'water', zone: 'zone-concourse', position: { x: 180, y: 350 }, waitTimeMinutes: 0, isOpen: true },
    ],
  },
  {
    id: 'azteca',
    name: 'Estadio Azteca',
    city: 'Mexico City',
    country: 'Mexico',
    capacity: 87523,
    latitude: 19.3029,
    longitude: -99.1505,
    gates: [
      { id: 'gate-a', name: 'Gate A', direction: 'north', capacity: 5500, currentLoad: 0, waitTimeMinutes: 0, status: 'open', position: { x: 250, y: 30 } },
      { id: 'gate-b', name: 'Gate B', direction: 'east', capacity: 5000, currentLoad: 0, waitTimeMinutes: 0, status: 'open', position: { x: 470, y: 200 } },
      { id: 'gate-c', name: 'Gate C', direction: 'south', capacity: 5500, currentLoad: 0, waitTimeMinutes: 0, status: 'open', position: { x: 250, y: 370 } },
      { id: 'gate-d', name: 'Gate D', direction: 'west', capacity: 5000, currentLoad: 0, waitTimeMinutes: 0, status: 'open', position: { x: 30, y: 200 } },
    ],
    zones: [
      { id: 'zone-100', name: 'Platea Baja', type: 'seating', capacity: 25000, currentOccupancy: 0, densityLevel: 'low', position: { x: 120, y: 80, width: 260, height: 240 } },
      { id: 'zone-200', name: 'Palcos (Suites)', type: 'vip', capacity: 12000, currentOccupancy: 0, densityLevel: 'low', position: { x: 140, y: 100, width: 220, height: 200 } },
      { id: 'zone-300', name: 'Gradas General', type: 'seating', capacity: 40000, currentOccupancy: 0, densityLevel: 'low', position: { x: 100, y: 60, width: 300, height: 280 } },
      { id: 'zone-concourse', name: 'Túnel Perimetral', type: 'concourse', capacity: 10523, currentOccupancy: 0, densityLevel: 'low', position: { x: 90, y: 45, width: 320, height: 310 } },
      { id: 'zone-field', name: 'Cancha', type: 'field', capacity: 0, currentOccupancy: 0, densityLevel: 'low', position: { x: 200, y: 170, width: 100, height: 60 } },
    ],
    amenities: [
      { id: 'food-1', name: 'Tacos el Azteca', type: 'food', zone: 'zone-concourse', position: { x: 150, y: 50 }, waitTimeMinutes: 0, isOpen: true },
      { id: 'food-2', name: 'Antojitos Mexicanos', type: 'food', zone: 'zone-concourse', position: { x: 350, y: 350 }, waitTimeMinutes: 0, isOpen: true },
      { id: 'restroom-1', name: 'Baños Norte', type: 'restroom', zone: 'zone-concourse', position: { x: 300, y: 50 }, waitTimeMinutes: 0, isOpen: true },
      { id: 'restroom-2', name: 'Baños Sur', type: 'restroom', zone: 'zone-concourse', position: { x: 200, y: 350 }, waitTimeMinutes: 0, isOpen: true },
      { id: 'firstaid-1', name: 'Primeros Auxilios', type: 'first_aid', zone: 'zone-concourse', position: { x: 100, y: 200 }, waitTimeMinutes: 0, isOpen: true },
      { id: 'merch-1', name: 'Tienda Oficial México 2026', type: 'merchandise', zone: 'zone-concourse', position: { x: 250, y: 50 }, waitTimeMinutes: 0, isOpen: true },
      { id: 'info-1', name: 'Módulo de Información', type: 'info', zone: 'zone-concourse', position: { x: 400, y: 200 }, waitTimeMinutes: 0, isOpen: true },
    ],
  },
  {
    id: 'bbva',
    name: 'Estadio BBVA',
    city: 'Monterrey',
    country: 'Mexico',
    capacity: 53500,
    latitude: 25.6692,
    longitude: -100.2447,
    gates: [
      { id: 'gate-a', name: 'Acceso A', direction: 'north', capacity: 3000, currentLoad: 0, waitTimeMinutes: 0, status: 'open', position: { x: 250, y: 30 } },
      { id: 'gate-b', name: 'Acceso B', direction: 'east', capacity: 2500, currentLoad: 0, waitTimeMinutes: 0, status: 'open', position: { x: 470, y: 200 } },
      { id: 'gate-c', name: 'Acceso C', direction: 'south', capacity: 3000, currentLoad: 0, waitTimeMinutes: 0, status: 'open', position: { x: 250, y: 370 } },
      { id: 'gate-d', name: 'Acceso D', direction: 'west', capacity: 2500, currentLoad: 0, waitTimeMinutes: 0, status: 'open', position: { x: 30, y: 200 } },
    ],
    zones: [
      { id: 'zone-100', name: 'Sección Inferior', type: 'seating', capacity: 20000, currentOccupancy: 0, densityLevel: 'low', position: { x: 120, y: 80, width: 260, height: 240 } },
      { id: 'zone-vip', name: 'Club Seats', type: 'vip', capacity: 8500, currentOccupancy: 0, densityLevel: 'low', position: { x: 140, y: 100, width: 220, height: 200 } },
      { id: 'zone-300', name: 'Sección Superior', type: 'seating', capacity: 20000, currentOccupancy: 0, densityLevel: 'low', position: { x: 100, y: 60, width: 300, height: 280 } },
      { id: 'zone-concourse', name: 'Pasillo Principal', type: 'concourse', capacity: 5000, currentOccupancy: 0, densityLevel: 'low', position: { x: 90, y: 45, width: 320, height: 310 } },
      { id: 'zone-field', name: 'Cancha', type: 'field', capacity: 0, currentOccupancy: 0, densityLevel: 'low', position: { x: 200, y: 170, width: 100, height: 60 } },
    ],
    amenities: [
      { id: 'food-1', name: 'Cabrito & Tacos', type: 'food', zone: 'zone-concourse', position: { x: 150, y: 50 }, waitTimeMinutes: 0, isOpen: true },
      { id: 'restroom-1', name: 'Sanitarios Damas/Caballeros', type: 'restroom', zone: 'zone-concourse', position: { x: 300, y: 50 }, waitTimeMinutes: 0, isOpen: true },
      { id: 'merch-1', name: 'Rayados Tienda / FIFA Store', type: 'merchandise', zone: 'zone-concourse', position: { x: 250, y: 50 }, waitTimeMinutes: 0, isOpen: true },
    ],
  },
  {
    id: 'bcplace',
    name: 'BC Place',
    city: 'Vancouver',
    country: 'Canada',
    capacity: 54500,
    latitude: 49.2767,
    longitude: -123.1120,
    gates: [
      { id: 'gate-a', name: 'Gate A', direction: 'west', capacity: 3500, currentLoad: 0, waitTimeMinutes: 0, status: 'open', position: { x: 30, y: 200 } },
      { id: 'gate-b', name: 'Gate B', direction: 'north', capacity: 3500, currentLoad: 0, waitTimeMinutes: 0, status: 'open', position: { x: 250, y: 30 } },
      { id: 'gate-c', name: 'Gate C', direction: 'east', capacity: 3000, currentLoad: 0, waitTimeMinutes: 0, status: 'open', position: { x: 470, y: 200 } },
      { id: 'gate-d', name: 'Gate D', direction: 'south', capacity: 3000, currentLoad: 0, waitTimeMinutes: 0, status: 'open', position: { x: 250, y: 370 } },
    ],
    zones: [
      { id: 'zone-100', name: 'Lower Bowl', type: 'seating', capacity: 22000, currentOccupancy: 0, densityLevel: 'low', position: { x: 120, y: 80, width: 260, height: 240 } },
      { id: 'zone-200', name: 'Club Lounges', type: 'vip', capacity: 7500, currentOccupancy: 0, densityLevel: 'low', position: { x: 140, y: 100, width: 220, height: 200 } },
      { id: 'zone-300', name: 'Upper Bowl', type: 'seating', capacity: 20000, currentOccupancy: 0, densityLevel: 'low', position: { x: 100, y: 60, width: 300, height: 280 } },
      { id: 'zone-concourse', name: 'Main Concourse', type: 'concourse', capacity: 5000, currentOccupancy: 0, densityLevel: 'low', position: { x: 90, y: 45, width: 320, height: 310 } },
      { id: 'zone-field', name: 'Field Pitch', type: 'field', capacity: 0, currentOccupancy: 0, densityLevel: 'low', position: { x: 200, y: 170, width: 100, height: 60 } },
    ],
    amenities: [
      { id: 'food-1', name: 'Poutine & Dogs', type: 'food', zone: 'zone-concourse', position: { x: 150, y: 50 }, waitTimeMinutes: 0, isOpen: true },
      { id: 'restroom-1', name: 'Washrooms West', type: 'restroom', zone: 'zone-concourse', position: { x: 300, y: 50 }, waitTimeMinutes: 0, isOpen: true },
      { id: 'merch-1', name: 'FIFA Fan Shop BC', type: 'merchandise', zone: 'zone-concourse', position: { x: 250, y: 50 }, waitTimeMinutes: 0, isOpen: true },
    ],
  }
];

export const MATCH_SCHEDULE: MatchInfo[] = [
  {
    id: 'm-1',
    homeTeam: 'USA',
    awayTeam: 'Brazil',
    kickoffTime: '2026-06-12T19:00:00-04:00',
    venue: 'MetLife Stadium',
    stage: 'Group Stage',
    matchDay: 'Matchday 1',
    homeFlag: '🇺🇸',
    awayFlag: '🇧🇷',
    group: 'Group A'
  },
  {
    id: 'm-2',
    homeTeam: 'Spain',
    awayTeam: 'Japan',
    kickoffTime: '2026-06-13T18:00:00-05:00',
    venue: 'AT&T Stadium',
    stage: 'Group Stage',
    matchDay: 'Matchday 2',
    homeFlag: '🇪🇸',
    awayFlag: '🇯🇵',
    group: 'Group B'
  },
  {
    id: 'm-3',
    homeTeam: 'France',
    awayTeam: 'Australia',
    kickoffTime: '2026-06-14T17:00:00-07:00',
    venue: 'SoFi Stadium',
    stage: 'Group Stage',
    matchDay: 'Matchday 3',
    homeFlag: '🇫🇷',
    awayFlag: '🇦🇺',
    group: 'Group C'
  },
  {
    id: 'm-5',
    homeTeam: 'Mexico',
    awayTeam: 'Germany',
    kickoffTime: '2026-06-11T20:00:00-06:00',
    venue: 'Estadio Azteca',
    stage: 'Opening Match (Group A)',
    matchDay: 'Matchday 1',
    homeFlag: '🇲🇽',
    awayFlag: '🇩🇪',
    group: 'Group A'
  },
  {
    id: 'm-6',
    homeTeam: 'Argentina',
    awayTeam: 'Morocco',
    kickoffTime: '2026-06-15T19:00:00-06:00',
    venue: 'Estadio BBVA',
    stage: 'Group Stage',
    matchDay: 'Matchday 4',
    homeFlag: '🇦🇷',
    awayFlag: '🇲🇦',
    group: 'Group D'
  },
  {
    id: 'm-8',
    homeTeam: 'Canada',
    awayTeam: 'Nigeria',
    kickoffTime: '2026-06-12T17:00:00-07:00',
    venue: 'BC Place',
    stage: 'Group Stage',
    matchDay: 'Matchday 1',
    homeFlag: '🇨🇦',
    awayFlag: '🇳🇬',
    group: 'Group B'
  }
];

export function getDefaultStadium(): StadiumConfig {
  return JSON.parse(JSON.stringify(FIFA_2026_STADIUMS[0]));
}

export function getDefaultMatch(): MatchInfo {
  return { ...MATCH_SCHEDULE[0] };
}

export function getStadiumById(id: string): StadiumConfig | undefined {
  const s = FIFA_2026_STADIUMS.find(s => s.id === id);
  return s ? JSON.parse(JSON.stringify(s)) : undefined;
}

export function getMatchForStadium(stadiumName: string): MatchInfo | undefined {
  return MATCH_SCHEDULE.find(m => m.venue === stadiumName);
}

export const AMENITY_ICONS: Record<string, string> = {
  restroom: '🚻',
  food: '🍔',
  merchandise: '🛍️',
  first_aid: '🏥',
  info: 'ℹ️',
  atm: '💳',
  water: '💧',
};

export const DENSITY_COLORS: Record<string, string> = {
  low: '#06d6a0',
  moderate: '#ffd166',
  high: '#f77f00',
  critical: '#e63946',
};
