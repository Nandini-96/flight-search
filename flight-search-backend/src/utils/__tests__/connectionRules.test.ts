import {
  isDomesticConnection,
  isValidLayoverDuration,
  canConnect,
  // LAYOVER_CONSTRAINTS,
} from '../connectionRules';
import { Airport, FlightWithMetadata } from '../../types';

describe('Connection Rules', () => {
  const usAirport: Airport = {
    code: 'JFK',
    name: 'JFK',
    city: 'New York',
    country: 'US',
    timezone: 'America/New_York',
  };

  const ukAirport: Airport = {
    code: 'LHR',
    name: 'Heathrow',
    city: 'London',
    country: 'GB',
    timezone: 'Europe/London',
  };

  const mockFlight = (
    origin: Airport,
    dest: Airport,
    depTime: Date,
    arrTime: Date
  ): FlightWithMetadata => ({
    flightNumber: 'TEST123',
    airline: 'Test Airlines',
    origin: origin.code,
    destination: dest.code,
    departureTime: depTime.toISOString(),
    arrivalTime: arrTime.toISOString(),
    price: 100,
    aircraft: 'A320',
    originAirport: origin,
    destinationAirport: dest,
    departureDateUTC: depTime,
    arrivalDateUTC: arrTime,
    durationMinutes: 60,
  });

  describe('isDomesticConnection', () => {
    it('should identify domestic connections correctly', () => {
      // Both flights connect at US airports (same country)
      const usAirport2: Airport = {
        code: 'ORD',
        name: 'ORD',
        city: 'Chicago',
        country: 'US',
        timezone: 'America/Chicago',
      };
      
      // Flight1 arrives at US airport, Flight2 departs from US airport
      const flight1 = mockFlight(usAirport, usAirport2, new Date(), new Date());
      const flight2 = mockFlight(usAirport2, usAirport, new Date(), new Date());

      expect(isDomesticConnection(flight1, flight2)).toBe(true);
    });

    it('should identify international connections correctly', () => {
      // Flight1 arrives at UK airport, Flight2 departs from US airport (different countries)
      // This represents arriving in UK and departing from a different country
      const usAirport2: Airport = {
        code: 'ORD',
        name: 'ORD',
        city: 'Chicago',
        country: 'US',
        timezone: 'America/Chicago',
      };
      
      // Flight1: arrives at UK (destination is UK)
      const flight1 = mockFlight(usAirport, ukAirport, new Date(), new Date());
      // Flight2: departs from US (origin is US, but should be UK for connection)
      // Actually we need: flight1 destination country != flight2 origin country
      const flight2 = mockFlight(usAirport2, ukAirport, new Date(), new Date());

      expect(isDomesticConnection(flight1, flight2)).toBe(false);
    });
  });

  describe('isValidLayoverDuration', () => {
    it('should accept valid domestic layover (45-360 minutes)', () => {
      expect(isValidLayoverDuration(45, true)).toBe(true);
      expect(isValidLayoverDuration(120, true)).toBe(true);
      expect(isValidLayoverDuration(360, true)).toBe(true);
    });

    it('should reject domestic layover below minimum', () => {
      expect(isValidLayoverDuration(44, true)).toBe(false);
      expect(isValidLayoverDuration(30, true)).toBe(false);
    });

    it('should accept valid international layover (90-360 minutes)', () => {
      expect(isValidLayoverDuration(90, false)).toBe(true);
      expect(isValidLayoverDuration(180, false)).toBe(true);
      expect(isValidLayoverDuration(360, false)).toBe(true);
    });

    it('should reject international layover below minimum', () => {
      expect(isValidLayoverDuration(89, false)).toBe(false);
      expect(isValidLayoverDuration(60, false)).toBe(false);
    });

    it('should reject layover above maximum', () => {
      expect(isValidLayoverDuration(361, true)).toBe(false);
      expect(isValidLayoverDuration(500, false)).toBe(false);
    });
  });

  describe('canConnect', () => {
    it('should allow valid domestic connection', () => {
      const arrivalTime = new Date('2024-03-15T10:00:00Z');
      const departureTime = new Date('2024-03-15T11:00:00Z'); // 60 min layover

      const flight1 = mockFlight(usAirport, usAirport, new Date(), arrivalTime);
      const flight2 = mockFlight(usAirport, usAirport, departureTime, new Date());

      expect(canConnect(flight1, flight2, 60)).toBe(true);
    });

    it('should reject connection at different airports', () => {
      const arrivalTime = new Date('2024-03-15T10:00:00Z');
      const departureTime = new Date('2024-03-15T11:00:00Z');

      const flight1 = mockFlight(usAirport, usAirport, new Date(), arrivalTime);
      const flight2 = mockFlight(ukAirport, ukAirport, departureTime, new Date());

      expect(canConnect(flight1, flight2, 60)).toBe(false);
    });

    it('should reject connection with insufficient layover', () => {
      const arrivalTime = new Date('2024-03-15T10:00:00Z');
      const departureTime = new Date('2024-03-15T10:30:00Z'); // 30 min layover

      const flight1 = mockFlight(usAirport, usAirport, new Date(), arrivalTime);
      const flight2 = mockFlight(usAirport, usAirport, departureTime, new Date());

      expect(canConnect(flight1, flight2, 30)).toBe(false);
    });
  });
});