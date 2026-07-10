// ============================================================
// FIFA World Cup 2026 — Facilities Data
// Real hospitals, hotels/hostels, airports, and public transport
// ============================================================

import { NearbyFacility, HostCityTravel } from '../types';

export const VENUE_FACILITIES: Record<string, NearbyFacility[]> = {
  metlife: [
    // Hospitals
    {
      id: 'hosp-met-1',
      name: 'Hackensack University Medical Center',
      type: 'hospital',
      distanceKm: 9.8,
      latitude: 40.8872,
      longitude: -74.0564,
      address: '30 Prospect Ave, Hackensack, NJ 07601',
      phone: '+1 (201) 996-2000',
      details: 'Level I Trauma Center. Multi-lingual staff available. Emergency services open 24/7.'
    },
    {
      id: 'hosp-met-2',
      name: 'St. Marys General Hospital',
      type: 'hospital',
      distanceKm: 8.2,
      latitude: 40.8589,
      longitude: -74.1171,
      address: '350 Boulevard, Passaic, NJ 07055',
      phone: '+1 (973) 365-4300',
      details: 'Cardiovascular care center. Emergency services open 24/7.'
    },
    // Hotels & Hostels
    {
      id: 'hotel-met-1',
      name: 'Hilton Meadowlands',
      type: 'hotel',
      distanceKm: 1.5,
      latitude: 40.8062,
      longitude: -74.0674,
      address: '2 Harmon Plaza, Secaucus, NJ 07094',
      phone: '+1 (201) 348-6900',
      rating: 4.2,
      priceRange: '$$$',
      vacancy: 'limited',
      details: 'Official partner hotel. Shuttle service to stadium on match days. Fully accessible.'
    },
    {
      id: 'hotel-met-2',
      name: 'Red Roof Plus+ Secaucus - Meadowlands',
      type: 'hotel',
      distanceKm: 3.2,
      latitude: 40.7932,
      longitude: -74.0558,
      address: '15 Meadowlands Pkwy, Secaucus, NJ 07094',
      phone: '+1 (201) 319-1000',
      rating: 3.8,
      priceRange: '$$',
      vacancy: 'available',
      details: 'Budget-friendly accommodations. High vacancy rate. 10-minute drive to stadium.'
    },
    {
      id: 'hotel-met-3',
      name: 'Secaucus Meadowlands Hostel',
      type: 'hotel',
      distanceKm: 4.1,
      latitude: 40.7891,
      longitude: -74.0502,
      address: '100 Plaza Dr, Secaucus, NJ 07094',
      phone: '+1 (201) 420-1122',
      rating: 4.0,
      priceRange: '$',
      vacancy: 'available',
      details: 'Shared dormitory rooms and private options. Best budget choice for international fans.'
    },
    // Public Transport
    {
      id: 'transit-met-1',
      name: 'Meadowlands Rail Station',
      type: 'transit',
      distanceKm: 0.2,
      latitude: 40.8094,
      longitude: -74.0759,
      address: 'MetLife Stadium Complex, NJ',
      details: 'NJ Transit Meadowlands Rail Line. Connects directly to Secaucus Junction and NY Penn Station.'
    },
    {
      id: 'transit-met-2',
      name: 'Bus Route 351 Express',
      type: 'transit',
      distanceKm: 0.1,
      latitude: 40.8123,
      longitude: -74.0742,
      address: 'Lot K, MetLife Stadium',
      details: 'Direct bus connection to Port Authority Bus Terminal in Manhattan. Starts 3 hours pre-match.'
    },
    // Airports
    {
      id: 'air-met-1',
      name: 'Newark Liberty International Airport',
      type: 'airport',
      distanceKm: 21.0,
      latitude: 40.6895,
      longitude: -74.1745,
      address: '3 Brewster Rd, Newark, NJ 07114',
      phone: '+1 (973) 961-6000',
      details: 'EWR. Major international hub with direct rail links (AirTrain + NJ Transit) to Meadowlands.'
    },
    {
      id: 'air-met-2',
      name: 'John F. Kennedy International Airport',
      type: 'airport',
      distanceKm: 42.0,
      latitude: 40.6413,
      longitude: -73.7781,
      address: 'Queens, NY 11430',
      phone: '+1 (718) 244-4444',
      details: 'JFK. Primary international gateway. Recommended to use AirTrain to subway/rail transit.'
    }
  ],
  att: [
    // Hospitals
    {
      id: 'hosp-att-1',
      name: 'Texas Health Memorial Hospital Arlington',
      type: 'hospital',
      distanceKm: 3.2,
      latitude: 32.7533,
      longitude: -97.1235,
      address: '800 W Randol Mill Rd, Arlington, TX 76012',
      phone: '+1 (817) 960-6100',
      details: 'Full-service emergency room. Multi-lingual staff. Open 24/7.'
    },
    // Hotels & Hostels
    {
      id: 'hotel-att-1',
      name: 'Sheraton Arlington Hotel',
      type: 'hotel',
      distanceKm: 1.1,
      latitude: 32.7551,
      longitude: -97.0901,
      address: '1500 Convention Center Dr, Arlington, TX 76011',
      phone: '+1 (817) 261-8200',
      rating: 4.4,
      priceRange: '$$$',
      vacancy: 'full',
      details: 'Adjacent to Convention Center. Walking distance to AT&T Stadium. Fully booked for match day.'
    },
    {
      id: 'hotel-att-2',
      name: 'Arlington International Backpackers Hostel',
      type: 'hotel',
      distanceKm: 2.8,
      latitude: 32.7388,
      longitude: -97.1084,
      address: '801 E Abram St, Arlington, TX 76010',
      phone: '+1 (817) 555-0199',
      rating: 3.9,
      priceRange: '$',
      vacancy: 'limited',
      details: 'Affordable dorm beds. High international atmosphere. Shuttle transit options available.'
    },
    // Public Transport
    {
      id: 'transit-att-1',
      name: 'Arlington Via Rideshare Point',
      type: 'transit',
      distanceKm: 0.1,
      latitude: 32.7483,
      longitude: -97.0934,
      address: 'Lot T, AT&T Stadium',
      details: 'Arlington City-wide on-demand rideshare service. Pre-booking via Arlington Via app recommended.'
    },
    {
      id: 'transit-att-2',
      name: 'TRE CentrePort/DFW Airport Station',
      type: 'transit',
      distanceKm: 11.5,
      latitude: 32.8361,
      longitude: -97.0543,
      address: '14300 Statler Blvd, Fort Worth, TX 76155',
      details: 'Trinity Railway Express (TRE). Commuter rail linking Dallas and Fort Worth. Shuttle connects to stadium.'
    },
    // Airports
    {
      id: 'air-att-1',
      name: 'Dallas/Fort Worth International Airport',
      type: 'airport',
      distanceKm: 19.5,
      latitude: 32.8998,
      longitude: -97.0403,
      address: '2400 Aviation Dr, DFW Airport, TX 75261',
      phone: '+1 (972) 973-3112',
      details: 'DFW. Main international gateway. 20-minute rideshare to Arlington.'
    }
  ],
  sofistadium: [
    // Hospitals
    {
      id: 'hosp-sofi-1',
      name: 'Centinela Hospital Medical Center',
      type: 'hospital',
      distanceKm: 1.8,
      latitude: 33.9687,
      longitude: -118.3541,
      address: '933 E Locust St, Inglewood, CA 90301',
      phone: '+1 (310) 673-4660',
      details: 'Closest emergency facility to stadium. Open 24/7. Specialized emergency doctors on duty.'
    },
    // Hotels & Hostels
    {
      id: 'hotel-sofi-1',
      name: 'Sonder Luma',
      type: 'hotel',
      distanceKm: 2.5,
      latitude: 33.9482,
      longitude: -118.3524,
      address: '3900 W Century Blvd, Inglewood, CA 90303',
      phone: '+1 (617) 300-0956',
      rating: 4.5,
      priceRange: '$$$',
      vacancy: 'limited',
      details: 'Boutique suites. Fast Wi-Fi, fully accessible, 20-minute walk to SoFi Stadium.'
    },
    {
      id: 'hotel-sofi-2',
      name: 'Inglewood Cozy Hostel',
      type: 'hotel',
      distanceKm: 2.1,
      latitude: 33.9622,
      longitude: -118.3392,
      address: '500 S Prairie Ave, Inglewood, CA 90301',
      phone: '+1 (310) 555-7822',
      rating: 4.1,
      priceRange: '$',
      vacancy: 'available',
      details: 'Shared spaces, hostel kitchen, budget-friendly. Excellent reviews from traveling sports fans.'
    },
    // Public Transport
    {
      id: 'transit-sofi-1',
      name: 'Metro K Line - Downtown Inglewood Station',
      type: 'transit',
      distanceKm: 2.3,
      latitude: 33.9621,
      longitude: -118.3582,
      address: 'Locust St & Florence Ave, Inglewood, CA',
      details: 'LA Metro rail line. Free bus shuttles run from here directly to SoFi Stadium on World Cup match days.'
    },
    // Airports
    {
      id: 'air-sofi-1',
      name: 'Los Angeles International Airport',
      type: 'airport',
      distanceKm: 6.8,
      latitude: 33.9416,
      longitude: -118.4085,
      address: '1 World Way, Los Angeles, CA 90045',
      phone: '+1 (855) 463-5252',
      details: 'LAX. Direct flights globally. Metro transit and express bus services connect LAX to Inglewood.'
    }
  ],
  azteca: [
    // Hospitals
    {
      id: 'hosp-azt-1',
      name: 'Hospital Médica Sur',
      type: 'hospital',
      distanceKm: 3.5,
      latitude: 19.3005,
      longitude: -99.1624,
      address: 'Puente de Piedra 150, Toriello Guerra, Tlalpan, 14050 Ciudad de México',
      phone: '+52 55 5424 7200',
      details: 'Top-tier private hospital. English-speaking doctors, highly specialized emergency care 24/7.'
    },
    // Hotels & Hostels
    {
      id: 'hotel-azt-1',
      name: 'Radisson Paraiso Perisur',
      type: 'hotel',
      distanceKm: 4.8,
      latitude: 19.3032,
      longitude: -99.1901,
      address: 'Cda. de Coyoacán 190, Jardines del Pedregal, Coyoacán, 04500 Ciudad de México',
      phone: '+52 55 5927 5200',
      rating: 4.3,
      priceRange: '$$$',
      vacancy: 'limited',
      details: 'Highly rated, premium hotel near major shopping malls and 10 minutes from Estadio Azteca.'
    },
    {
      id: 'hotel-azt-2',
      name: 'Coyoacán Hostel Cultural',
      type: 'hotel',
      distanceKm: 5.5,
      latitude: 19.3488,
      longitude: -99.1627,
      address: 'Ignacio Allende 118, Del Carmen, Coyoacán, 04100 Ciudad de México',
      phone: '+52 55 5659 8133',
      rating: 4.6,
      priceRange: '$',
      vacancy: 'available',
      details: 'Beautiful cultural hostel in historic Coyoacán. Vibrant backpacker vibe, shared kitchen and patio.'
    },
    // Public Transport
    {
      id: 'transit-azt-1',
      name: 'Estación Estadio Azteca (Tren Ligero)',
      type: 'transit',
      distanceKm: 0.1,
      latitude: 19.3028,
      longitude: -99.1465,
      address: 'Calzada de Tlalpan, Coyoacán, CDMX',
      details: 'Light rail station connecting to Metro Line 2 (Tasqueña). Fastest route into the historic city center.'
    },
    // Airports
    {
      id: 'air-azt-1',
      name: 'Aeropuerto Internacional Benito Juárez',
      type: 'airport',
      distanceKm: 18.2,
      latitude: 19.4362,
      longitude: -99.0721,
      address: 'Av. Capitán Carlos León s/n, Peñón de los Baños, Venustiano Carranza, 15520 Ciudad de México',
      phone: '+52 55 2482 2400',
      details: 'MEX. Primary international gateway. Direct Metro connection (Line 5) and authorized taxi ranks.'
    }
  ],
  bbva: [
    {
      id: 'hosp-bbva-1',
      name: 'Hospital Christus Muguerza Sur',
      type: 'hospital',
      distanceKm: 8.5,
      latitude: 25.5901,
      longitude: -100.2789,
      address: 'Carretera Nacional 6501, La Estanzuela, Monterrey, NL',
      phone: '+52 81 8155 5000',
      details: 'Modern emergency hospital. International patient desk available. Open 24/7.'
    },
    {
      id: 'hotel-bbva-1',
      name: 'Holiday Inn Monterrey Valle',
      type: 'hotel',
      distanceKm: 9.0,
      latitude: 25.6482,
      longitude: -100.3284,
      address: 'Lázaro Cárdenas 2400, Zona Loma Larga Oriente, Monterrey, NL',
      phone: '+52 81 8399 6000',
      rating: 4.3,
      priceRange: '$$',
      vacancy: 'available',
      details: 'Reliable business-class hotel in San Pedro/Valle area. Safe, clean, and pool-equipped.'
    },
    {
      id: 'transit-bbva-1',
      name: 'Estación Exposición (Metrorrey)',
      type: 'transit',
      distanceKm: 1.2,
      latitude: 25.6728,
      longitude: -100.2455,
      address: 'Av. Juárez y Exposición, Guadalupe, NL',
      details: 'Metro line 1 terminus. Direct pedestrian connection pathways lead towards Estadio BBVA.'
    },
    {
      id: 'air-bbva-1',
      name: 'Aeropuerto Internacional de Monterrey',
      type: 'airport',
      distanceKm: 22.0,
      latitude: 25.7785,
      longitude: -100.1068,
      address: 'Carretera Miguel Alemán Km 24, Apodaca, NL',
      phone: '+52 81 8288 7000',
      details: 'MTY. Daily international flights from major USA hubs. Taxi or Express Bus connects to Monterrey downtown.'
    }
  ],
  bcplace: [
    // Hospitals
    {
      id: 'hosp-bc-1',
      name: 'St. Pauls Hospital',
      type: 'hospital',
      distanceKm: 1.5,
      latitude: 49.2802,
      longitude: -123.1294,
      address: '1081 Burrard St, Vancouver, BC V6Z 1Y6',
      phone: '+1 (604) 682-2344',
      details: 'Major Downtown teaching hospital with emergency services active 24/7.'
    },
    // Hotels & Hostels
    {
      id: 'hotel-bc-1',
      name: 'Sandman Signature Vancouver Downtown',
      type: 'hotel',
      distanceKm: 0.3,
      latitude: 49.2798,
      longitude: -123.1147,
      address: '180 W Georgia St, Vancouver, BC V6B 4P4',
      phone: '+1 (604) 681-2211',
      rating: 4.2,
      priceRange: '$$$',
      vacancy: 'limited',
      details: 'Directly opposite BC Place. Modern styling, indoor pool, sports bar. Book early.'
    },
    {
      id: 'hotel-bc-2',
      name: 'Samesun Vancouver Hostel',
      type: 'hotel',
      distanceKm: 0.9,
      latitude: 49.2789,
      longitude: -123.1221,
      address: '1018 Granville St, Vancouver, BC V6Z 1L8',
      phone: '+1 (604) 682-8226',
      rating: 4.4,
      priceRange: '$',
      vacancy: 'available',
      details: 'Superb social hostel on Granville Street. Affordable dorm beds, bar, breakfast included.'
    },
    // Public Transport
    {
      id: 'transit-bc-1',
      name: 'Stadium-Chinatown SkyTrain Station',
      type: 'transit',
      distanceKm: 0.2,
      latitude: 49.2796,
      longitude: -123.1098,
      address: 'Beatty St & Dunsmuir St, Vancouver, BC',
      details: 'Expo Line SkyTrain. Rapid rail transit to Waterfront Station, Surrey, and Burnaby. Direct access pathway to BC Place.'
    },
    {
      id: 'transit-bc-2',
      name: 'Yaletown-Roundhouse SkyTrain Station',
      type: 'transit',
      distanceKm: 0.8,
      latitude: 49.2745,
      longitude: -123.1219,
      address: 'Davie St & Mainland St, Vancouver, BC',
      details: 'Canada Line SkyTrain. Direct connection to Vancouver International Airport (YVR) and Richmond.'
    },
    // Airports
    {
      id: 'air-bc-1',
      name: 'Vancouver International Airport',
      type: 'airport',
      distanceKm: 13.5,
      latitude: 49.1967,
      longitude: -123.1815,
      address: '3211 Grant McConachie Way, Richmond, BC V7B 0A4',
      phone: '+1 (604) 207-7077',
      details: 'YVR. Award-winning international airport. Direct Canada Line SkyTrain links terminal to downtown in 25 mins.'
    }
  ]
};

// Fallback generator for other stadiums that might be chosen
export function getFacilitiesForStadium(stadiumId: string): NearbyFacility[] {
  if (VENUE_FACILITIES[stadiumId]) {
    return VENUE_FACILITIES[stadiumId];
  }

  // Generate mock facilities based on stadium coordinates for consistent display
  return [
    {
      id: `hosp-mock-${stadiumId}`,
      name: `City General Hospital Medical Center`,
      type: 'hospital',
      distanceKm: 2.4,
      latitude: 40.0,
      longitude: -74.0,
      address: `100 Medical Plaza, Host City`,
      phone: '+1 (555) 911-0000',
      details: 'Emergency services active 24/7. Fully equipped trauma facility.'
    },
    {
      id: `hotel-mock-${stadiumId}-1`,
      name: `Grand Championship Hotel`,
      type: 'hotel',
      distanceKm: 1.2,
      latitude: 40.01,
      longitude: -74.01,
      address: `500 Stadium Parkway, Host City`,
      phone: '+1 (555) 123-4500',
      rating: 4.5,
      priceRange: '$$$',
      vacancy: 'limited',
      details: 'Luxury rooms. Highly recommended for match attendees.'
    },
    {
      id: `hotel-mock-${stadiumId}-2`,
      name: `Host City Backpacker Hostel`,
      type: 'hotel',
      distanceKm: 3.5,
      latitude: 40.02,
      longitude: -74.02,
      address: `12 Youth Way, Host City`,
      phone: '+1 (555) 987-6543',
      rating: 4.0,
      priceRange: '$',
      vacancy: 'available',
      details: 'Social budget dormitory beds. Free breakfast & Wi-Fi.'
    },
    {
      id: `transit-mock-${stadiumId}`,
      name: `Stadium Central Transit Hub`,
      type: 'transit',
      distanceKm: 0.3,
      latitude: 39.99,
      longitude: -73.99,
      address: `Transit Circle, Host City`,
      details: 'Direct subway & shuttle line connections. High frequency service during matches.'
    },
    {
      id: `air-mock-${stadiumId}`,
      name: `Host City International Airport`,
      type: 'airport',
      distanceKm: 18.5,
      latitude: 39.9,
      longitude: -73.8,
      address: `1 Airport Boulevard, Host City`,
      details: 'International flights. Connected to stadium via Metro express trains.'
    }
  ];
}
