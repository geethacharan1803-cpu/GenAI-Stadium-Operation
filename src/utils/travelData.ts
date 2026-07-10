// ============================================================
// FIFA World Cup 2026 — Travel & Accommodation Data
// Flights, hotel vacancy indices, and local transit schedules
// ============================================================

import { FlightInfo, TransportOption } from '../types';

export const FLIGHT_SCHEDULES: Record<string, FlightInfo[]> = {
  metlife: [
    { id: 'fl-1', airline: 'United Airlines', route: 'DFW to EWR', duration: '3h 15m', frequency: '8 flights daily', priceEstimate: '$240', departureAirport: 'DFW', arrivalAirport: 'EWR' },
    { id: 'fl-2', airline: 'American Airlines', route: 'LAX to JFK', duration: '5h 30m', frequency: '12 flights daily', priceEstimate: '$310', departureAirport: 'LAX', arrivalAirport: 'JFK' },
    { id: 'fl-3', airline: 'Aeromexico', route: 'MEX to EWR', duration: '4h 45m', frequency: '4 flights daily', priceEstimate: '$380', departureAirport: 'MEX', arrivalAirport: 'EWR' },
    { id: 'fl-4', airline: 'Air Canada', route: 'YVR to LGA', duration: '5h 15m', frequency: '3 flights daily', priceEstimate: '$410', departureAirport: 'YVR', arrivalAirport: 'LGA' }
  ],
  att: [
    { id: 'fl-5', airline: 'American Airlines', route: 'EWR to DFW', duration: '3h 30m', frequency: '8 flights daily', priceEstimate: '$240', departureAirport: 'EWR', arrivalAirport: 'DFW' },
    { id: 'fl-6', airline: 'Delta Air Lines', route: 'LAX to DFW', duration: '3h 05m', frequency: '10 flights daily', priceEstimate: '$180', departureAirport: 'LAX', arrivalAirport: 'DFW' },
    { id: 'fl-7', airline: 'VivaAerobus', route: 'MTY to DFW', duration: '1h 25m', frequency: '5 flights daily', priceEstimate: '$120', departureAirport: 'MTY', arrivalAirport: 'DFW' }
  ],
  sofistadium: [
    { id: 'fl-8', airline: 'Delta Air Lines', route: 'JFK to LAX', duration: '6h 00m', frequency: '12 flights daily', priceEstimate: '$310', departureAirport: 'JFK', arrivalAirport: 'LAX' },
    { id: 'fl-9', airline: 'United Airlines', route: 'DFW to LAX', duration: '3h 15m', frequency: '10 flights daily', priceEstimate: '$180', departureAirport: 'DFW', arrivalAirport: 'LAX' },
    { id: 'fl-10', airline: 'Volaris', route: 'MEX to LAX', duration: '3h 40m', frequency: '6 flights daily', priceEstimate: '$210', departureAirport: 'MEX', arrivalAirport: 'LAX' }
  ],
  azteca: [
    { id: 'fl-11', airline: 'Aeromexico', route: 'LAX to MEX', duration: '3h 50m', frequency: '6 flights daily', priceEstimate: '$210', departureAirport: 'LAX', arrivalAirport: 'MEX' },
    { id: 'fl-12', airline: 'American Airlines', route: 'MIA to MEX', duration: '3h 25m', frequency: '5 flights daily', priceEstimate: '$260', departureAirport: 'MIA', arrivalAirport: 'MEX' },
    { id: 'fl-13', airline: 'United Airlines', route: 'IAH to MEX', duration: '2h 10m', frequency: '8 flights daily', priceEstimate: '$190', departureAirport: 'IAH', arrivalAirport: 'MEX' }
  ]
};

export const LOCAL_TRANSIT_OPTIONS: Record<string, TransportOption[]> = {
  metlife: [
    { type: 'train', name: 'NJ Transit Meadowlands Rail', route: 'Secaucus Junction ⇄ Stadium', frequency: 'Every 10-15 mins on match days', price: '$4.25', duration: '12 mins' },
    { type: 'bus', name: '351 Express Bus', route: 'NYC Port Authority ⇄ Stadium', frequency: 'Continuous pre & post match', price: '$6.00', duration: '20 mins' },
    { type: 'shuttle', name: 'Hostel Shuttle Service', route: 'Partner Hostels ⇄ Stadium Lot G', frequency: 'Scheduled departures', price: 'Free for guests', duration: '15 mins' }
  ],
  att: [
    { type: 'shuttle', name: 'TRE Arlington Stadium Shuttle', route: 'CentrePort Station ⇄ Stadium', frequency: 'Every 15 mins starting 3h pre-match', price: '$5.00 round trip', duration: '15 mins' },
    { type: 'bus', name: 'Via On-Demand rideshare', route: 'Any Arlington Location ⇄ Stadium', frequency: 'On-demand via app', price: '$3.00 - $5.00', duration: 'Depends on traffic' }
  ],
  sofistadium: [
    { type: 'subway', name: 'LA Metro K Line', route: 'Expo/Crenshaw ⇄ Downtown Inglewood', frequency: 'Every 8-12 mins', price: '$1.75', duration: '10 mins' },
    { type: 'shuttle', name: 'SoFi Express Metro Shuttle', route: 'Downtown Inglewood Station ⇄ Stadium', frequency: 'Continuous loop on match days', price: 'Free with Metro fare', duration: '8 mins' }
  ],
  azteca: [
    { type: 'train', name: 'Tren Ligero (Light Rail)', route: 'Metro Tasqueña ⇄ Estadio Azteca', frequency: 'Every 5 mins', price: '$3.00 MXN ($0.15 USD)', duration: '18 mins' },
    { type: 'bus', name: 'RTP Bus Route 112', route: 'Coyoacán ⇄ Estadio Azteca', frequency: 'Every 10 mins', price: '$4.00 MXN', duration: '25 mins' }
  ],
  bcplace: [
    { type: 'subway', name: 'SkyTrain Expo Line', route: 'Waterfront Station ⇄ Stadium-Chinatown', frequency: 'Every 2-4 mins', price: '$3.15 CAD', duration: '3 mins' },
    { type: 'subway', name: 'SkyTrain Canada Line', route: 'YVR Airport ⇄ Yaletown-Roundhouse', frequency: 'Every 6-8 mins', price: '$4.45 CAD', duration: '22 mins' }
  ]
};

export function getFlightsForStadium(stadiumId: string): FlightInfo[] {
  return FLIGHT_SCHEDULES[stadiumId] || [
    { id: `fl-mock-1`, airline: 'Delta Air Lines', route: 'LAX to Host City', duration: '4h 00m', frequency: '4 flights daily', priceEstimate: '$280', departureAirport: 'LAX', arrivalAirport: 'APT' },
    { id: `fl-mock-2`, airline: 'American Airlines', route: 'DFW to Host City', duration: '3h 10m', frequency: '3 flights daily', priceEstimate: '$220', departureAirport: 'DFW', arrivalAirport: 'APT' }
  ];
}

export function getTransitForStadium(stadiumId: string): TransportOption[] {
  return LOCAL_TRANSIT_OPTIONS[stadiumId] || [
    { type: 'bus', name: 'Tournament Shuttle Bus', route: 'Host City Center ⇄ Stadium Hub', frequency: 'Every 10 mins on match days', price: 'Free with Match Ticket', duration: '25 mins' }
  ];
}
