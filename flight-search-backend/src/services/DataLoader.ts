import fs from 'fs';
import path from 'path';
import type { FlightData, Airport, Flight, FlightWithMetadata } from '../types';
import { localTimeToUTC, calculateDuration } from '../utils/dateUtils';

/**
 * DataLoader - Responsible for loading and indexing flight data
 * Implements singleton pattern to ensure data is loaded only once
 */
class DataLoader {
  private static instance: DataLoader;
  private flightData: FlightData | null = null;
  private airportMap: Map<string, Airport> = new Map();
  private flightsWithMetadata: FlightWithMetadata[] = [];
  private flightsByOrigin: Map<string, FlightWithMetadata[]> = new Map();
  private flightsByDestination: Map<string, FlightWithMetadata[]> = new Map();
  private flightsByDate: Map<string, FlightWithMetadata[]> = new Map();

  private constructor() {}

  /**
   * Get singleton instance
   */
  public static getInstance(): DataLoader {
    if (!DataLoader.instance) {
      DataLoader.instance = new DataLoader();
    }
    return DataLoader.instance;
  }

  /**
   * Load flight data from JSON file
   */
  public loadData(filePath: string): void {
    try {
      const absolutePath = path.resolve(filePath);
      const rawData = fs.readFileSync(absolutePath, 'utf-8');
      this.flightData = JSON.parse(rawData) as FlightData;

      console.log(`Loaded ${this.flightData.flights.length} flights from ${this.flightData.airports.length} airports`);

      this.buildIndices();
      console.log('Built search indices');
    } catch (error) {
      console.error('Failed to load flight data:', error);
      throw new Error(`Failed to load flight data: ${error}`);
    }
  }

  /**
   * Build indices for fast lookups
   */
  private buildIndices(): void {
    if (!this.flightData) {
      throw new Error('Flight data not loaded');
    }

    // Build airport map
    this.flightData.airports.forEach(airport => {
      this.airportMap.set(airport.code, airport);
    });

    // Process flights and build metadata
    this.flightsWithMetadata = this.flightData.flights.map(flight => 
      this.enrichFlightWithMetadata(flight)
    );

    // Index by origin
    this.flightsWithMetadata.forEach(flight => {
      const flights = this.flightsByOrigin.get(flight.origin) || [];
      flights.push(flight);
      this.flightsByOrigin.set(flight.origin, flights);
    });

    // Index by destination
    this.flightsWithMetadata.forEach(flight => {
      const flights = this.flightsByDestination.get(flight.destination) || [];
      flights.push(flight);
      this.flightsByDestination.set(flight.destination, flights);
    });

    // Index by departure date (in origin timezone)
    this.flightsWithMetadata.forEach(flight => {
      // Extract date from departure time in local timezone
      const departureDate = flight.departureTime.split('T')[0];
      const flights = this.flightsByDate.get(departureDate) || [];
      flights.push(flight);
      this.flightsByDate.set(departureDate, flights);
    });
  }

  /**
   * Enrich a flight with metadata (airports, UTC times, duration)
   */
  private enrichFlightWithMetadata(flight: Flight): FlightWithMetadata {
    const originAirport = this.airportMap.get(flight.origin);
    const destinationAirport = this.airportMap.get(flight.destination);

    if (!originAirport || !destinationAirport) {
      throw new Error(
        `Missing airport data for flight ${flight.flightNumber}: ${flight.origin} -> ${flight.destination}`
      );
    }

    // Convert local times to UTC
    const departureDateUTC = localTimeToUTC(
      flight.departureTime,
      originAirport.timezone
    );
    
    const arrivalDateUTC = localTimeToUTC(
      flight.arrivalTime,
      destinationAirport.timezone
    );

    const durationMinutes = calculateDuration(departureDateUTC, arrivalDateUTC);

    return {
      ...flight,
      originAirport,
      destinationAirport,
      departureDateUTC,
      arrivalDateUTC,
      durationMinutes,
    };
  }

  /**
   * Get airport by code
   */
  public getAirport(code: string): Airport | undefined {
    return this.airportMap.get(code);
  }

  /**
   * Get all airports
   */
  public getAllAirports(): Airport[] {
    return Array.from(this.airportMap.values());
  }

  /**
   * Get flights departing from an airport on a specific date
   */
  public getFlightsByOriginAndDate(origin: string, date: string): FlightWithMetadata[] {
    const allFlightsFromOrigin = this.flightsByOrigin.get(origin) || [];
    
    // Filter by date (considering timezone)
    return allFlightsFromOrigin.filter(flight => {
      const departureDate = flight.departureTime.split('T')[0];
      return departureDate === date;
    });
  }

  /**
   * Get flights arriving at an airport
   */
  public getFlightsByDestination(destination: string): FlightWithMetadata[] {
    return this.flightsByDestination.get(destination) || [];
  }

  /**
   * Get flights from origin to destination on a specific date
   */
  public getDirectFlights(
    origin: string,
    destination: string,
    date: string
  ): FlightWithMetadata[] {
    const flightsFromOrigin = this.getFlightsByOriginAndDate(origin, date);
    return flightsFromOrigin.filter(flight => flight.destination === destination);
  }

  /**
   * Get all flights departing from an airport (for finding connections)
   */
  public getFlightsDepartingFrom(airport: string): FlightWithMetadata[] {
    return this.flightsByOrigin.get(airport) || [];
  }

  /**
   * Get all flights arriving at an airport (for finding connections)
   */
  public getFlightsArrivingAt(airport: string): FlightWithMetadata[] {
    return this.flightsByDestination.get(airport) || [];
  }

  /**
   * Check if data is loaded
   */
  public isDataLoaded(): boolean {
    return this.flightData !== null;
  }

  /**
   * Get statistics about loaded data
   */
  public getStats() {
    return {
      totalAirports: this.airportMap.size,
      totalFlights: this.flightsWithMetadata.length,
      airports: Array.from(this.airportMap.keys()).sort(),
    };
  }
}

export default DataLoader;