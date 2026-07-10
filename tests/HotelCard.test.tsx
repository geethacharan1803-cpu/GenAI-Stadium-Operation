import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import HotelCard from '../src/components/HotelCard';
import { NearbyFacility } from '../src/types';

const mockHotel: NearbyFacility = {
  id: 'hotel-1',
  name: 'Tournament Luxury Plaza',
  type: 'hotel',
  distanceKm: 1.2,
  latitude: 40.8,
  longitude: -74.0,
  address: '100 Plaza Dr, Secaucus, NJ',
  rating: 4.8,
  priceRange: '$$$',
  vacancy: 'available',
  details: 'Free high-speed Wi-Fi and shuttle access.'
};

describe('HotelCard Component', () => {
  it('should render hotel title, address, price, and details', () => {
    render(<HotelCard hotel={mockHotel} />);

    expect(screen.getByText('Tournament Luxury Plaza')).toBeDefined();
    expect(screen.getByText('100 Plaza Dr, Secaucus, NJ')).toBeDefined();
    expect(screen.getByText('Price Range:')).toBeDefined();
    expect(screen.getByText('Free high-speed Wi-Fi and shuttle access.')).toBeDefined();
    expect(screen.getByText('Vacancies Available')).toBeDefined();
  });
});
