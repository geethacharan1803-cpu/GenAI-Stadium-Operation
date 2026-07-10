// ============================================================
// Smart Stadium GenAI Platform — Core Type Definitions
// FIFA World Cup 2026
// ============================================================

// --- Stadium & Venue ---

export interface StadiumConfig {
  id: string;
  name: string;
  city: string;
  country: string;
  capacity: number;
  latitude: number;
  longitude: number;
  gates: Gate[];
  zones: Zone[];
  amenities: Amenity[];
}

export interface Gate {
  id: string;
  name: string;
  direction: 'north' | 'south' | 'east' | 'west' | 'northeast' | 'northwest' | 'southeast' | 'southwest';
  capacity: number;
  currentLoad: number; // 0-100 percentage
  waitTimeMinutes: number;
  status: 'open' | 'congested' | 'closed';
  position: { x: number; y: number }; // SVG coordinates
}

export interface Zone {
  id: string;
  name: string;
  type: 'seating' | 'concourse' | 'vip' | 'general' | 'field';
  capacity: number;
  currentOccupancy: number;
  densityLevel: DensityLevel;
  position: { x: number; y: number; width: number; height: number };
}

export type DensityLevel = 'low' | 'moderate' | 'high' | 'critical';

export interface Amenity {
  id: string;
  name: string;
  type: AmenityType;
  zone: string;
  position: { x: number; y: number };
  waitTimeMinutes: number;
  isOpen: boolean;
}

export type AmenityType = 'restroom' | 'food' | 'merchandise' | 'first_aid' | 'info' | 'atm' | 'water';

// --- Crowd Intelligence ---

export interface CrowdSnapshot {
  timestamp: Date;
  totalAttendance: number;
  gateData: GateSnapshot[];
  zoneData: ZoneSnapshot[];
  overallDensity: DensityLevel;
  entryRate: number; // people per minute entering
  exitRate: number; // people per minute exiting
}

export interface GateSnapshot {
  gateId: string;
  load: number; // 0-100
  waitTime: number; // minutes
  throughput: number; // people per minute
}

export interface ZoneSnapshot {
  zoneId: string;
  occupancy: number;
  density: DensityLevel;
}

export interface CrowdPrediction {
  time: string;
  predictedAttendance: number;
  predictedDensity: DensityLevel;
  recommendation: string;
}

// --- Navigation ---

export interface RouteRecommendation {
  id: string;
  from: string;
  to: string;
  estimatedTimeMinutes: number;
  congestionLevel: DensityLevel;
  steps: RouteStep[];
  reasoning: string;
  alternativeRoutes: number;
}

export interface RouteStep {
  instruction: string;
  landmark?: string;
  distance?: string;
  congestion: DensityLevel;
}

// --- AI / Chat ---

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

export interface AIInsight {
  id: string;
  type: 'alert' | 'recommendation' | 'prediction' | 'info';
  title: string;
  content: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  relatedData?: string;
}

// --- Data Upload ---

export interface UploadedFile {
  id: string;
  name: string;
  type: 'csv' | 'pdf' | 'txt' | 'docx';
  size: number;
  uploadedAt: Date;
  status: 'parsing' | 'parsed' | 'error' | 'analyzing';
  parsedData?: ParsedData;
  aiAnalysis?: string;
  error?: string;
}

export interface ParsedData {
  headers: string[];
  rows: Record<string, string | number>[];
  rowCount: number;
  summary: string;
  detectedType: 'crowd_data' | 'gate_data' | 'event_schedule' | 'amenity_data' | 'unknown';
}

// --- Live Metrics ---

export interface LiveMetric {
  label: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  trendValue: number;
  icon?: string;
}

// --- Time Series Data ---

export interface TimeSeriesPoint {
  time: string;
  value: number;
  label?: string;
}

// --- App State ---

export interface AppState {
  apiKey: string | null;
  selectedStadium: StadiumConfig;
  crowdData: CrowdSnapshot;
  crowdHistory: CrowdSnapshot[];
  uploadedFiles: UploadedFile[];
  aiInsights: AIInsight[];
  isSimulationRunning: boolean;
  simulationSpeed: number; // 1x, 2x, 5x
  matchInfo: MatchInfo;
  language: LanguageCode;
  selectedMatchId: string | null;
}

export interface MatchInfo {
  id: string;
  homeTeam: string;
  awayTeam: string;
  kickoffTime: string;
  venue: string;
  stage: string;
  matchDay: string;
  homeFlag?: string;
  awayFlag?: string;
  group?: string;
}

// --- Travel, Accommodations & Facilities ---

export type FacilityType = 'hospital' | 'hotel' | 'transit' | 'airport';

export interface NearbyFacility {
  id: string;
  name: string;
  type: FacilityType;
  distanceKm: number;
  latitude: number;
  longitude: number;
  address: string;
  phone?: string;
  rating?: number;
  priceRange?: string; // e.g. "$$", "$$$"
  vacancy?: 'available' | 'limited' | 'full';
  details?: string;
}

export interface FlightInfo {
  id: string;
  airline: string;
  route: string;
  duration: string;
  frequency: string;
  priceEstimate: string;
  departureAirport: string;
  arrivalAirport: string;
}

export interface TransportOption {
  type: 'bus' | 'train' | 'subway' | 'shuttle';
  name: string;
  route: string;
  frequency: string;
  price: string;
  duration: string;
}

export interface HostCityTravel {
  city: string;
  flights: FlightInfo[];
  hotels: NearbyFacility[];
  localTransport: TransportOption[];
  airports: NearbyFacility[];
  hospitals: NearbyFacility[];
}

// --- Blueprint & Visualizations ---

export interface StadiumBlueprintConfig {
  stadiumId: string;
  sections: {
    id: string;
    name: string;
    capacity: number;
    occupancyRate: number;
    ticketPriceRange: string;
    accessibility: boolean;
    aiGuideTips: string;
    svgPath: string; // SVG shape definitions
  }[];
}

// --- i18n ---

export type LanguageCode = 'en' | 'es' | 'fr';

