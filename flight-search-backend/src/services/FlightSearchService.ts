import type {
  SearchParams,
  SearchResponse,
  Itinerary,
  FlightSegment,
  Layover,
  FlightWithMetadata,
  ConnectionCandidate,
} from '../types';
import DataLoader from './DataLoader';
import { calculateLayoverDuration, utcToLocalTime } from '../utils/dateUtils';
import { canConnect, isDomesticConnection } from '../utils/connectionRules';
import { v4 as uuidv4 } from 'uuid';

/**
 * FlightSearchService - Core business logic for finding flight itineraries
 * 
 * Algorithm Overview:
 * 1. Find all direct flights
 * 2. Find all 1-stop connections (BFS-like approach)
 * 3. Find all 2-stop connections
 * 4. Validate connections based on layover rules
 * 5. Sort by total duration (shortest first)
 */
class FlightSearchService {
  private dataLoader: DataLoader;

  constructor() {
    this.dataLoader = DataLoader.getInstance();
  }

  /**
   * Main search method - finds all valid itineraries
   */
  public search(params: SearchParams): SearchResponse {
    const { origin, destination, date } = params;

    // Validate inputs
    this.validateSearchParams(params);

    const itineraries: Itinerary[] = [];

    // Find direct flights
    const directFlights = this.findDirectFlights(origin, destination, date);
    itineraries.push(...this.convertToItineraries(directFlights));

    // Find 1-stop connections
    const oneStopConnections = this.findOneStopConnections(origin, destination, date);
    itineraries.push(...this.convertToItineraries(oneStopConnections));

    // Find 2-stop connections
    const twoStopConnections = this.findTwoStopConnections(origin, destination, date);
    itineraries.push(...this.convertToItineraries(twoStopConnections));

    // Sort by total duration (shortest first)
    itineraries.sort((a, b) => a.totalDuration - b.totalDuration);

    return {
      itineraries,
      searchParams: params,
      totalResults: itineraries.length,
    };
  }

  /**
   * Find direct flights
   */
  private findDirectFlights(
    origin: string,
    destination: string,
    date: string
  ): ConnectionCandidate[] {
    const directFlights = this.dataLoader.getDirectFlights(origin, destination, date);

    return directFlights.map(flight => ({
      segments: [flight],
      totalDuration: flight.durationMinutes,
      totalPrice: flight.price,
    }));
  }

  /**
   * Find 1-stop connections
   * Algorithm: For each flight from origin, find connecting flights to destination
   */
  private findOneStopConnections(
    origin: string,
    destination: string,
    date: string
  ): ConnectionCandidate[] {
    const connections: ConnectionCandidate[] = [];

    // Get all flights from origin on the specified date
    const firstLegFlights = this.dataLoader.getFlightsByOriginAndDate(origin, date);

    for (const firstFlight of firstLegFlights) {
      // Skip if it's a direct flight to destination
      if (firstFlight.destination === destination) {
        continue;
      }

      // Find all flights from the connection airport to destination
      const secondLegFlights = this.dataLoader.getFlightsDepartingFrom(
        firstFlight.destination
      );

      for (const secondFlight of secondLegFlights) {
        // Must go to our destination
        if (secondFlight.destination !== destination) {
          continue;
        }

        // Calculate layover duration
        const layoverMinutes = calculateLayoverDuration(
          firstFlight.arrivalDateUTC,
          secondFlight.departureDateUTC
        );

        // Validate connection
        if (canConnect(firstFlight, secondFlight, layoverMinutes)) {
          const totalDuration = firstFlight.durationMinutes + 
                               layoverMinutes + 
                               secondFlight.durationMinutes;

          connections.push({
            segments: [firstFlight, secondFlight],
            totalDuration,
            totalPrice: firstFlight.price + secondFlight.price,
          });
        }
      }
    }

    return connections;
  }

  /**
   * Find 2-stop connections
   * Algorithm: Extend 1-stop logic by adding another layer
   */
  private findTwoStopConnections(
    origin: string,
    destination: string,
    date: string
  ): ConnectionCandidate[] {
    const connections: ConnectionCandidate[] = [];

    // Get all flights from origin on the specified date
    const firstLegFlights = this.dataLoader.getFlightsByOriginAndDate(origin, date);

    for (const firstFlight of firstLegFlights) {
      // Skip if direct to destination
      if (firstFlight.destination === destination) {
        continue;
      }

      // Find second leg flights from first connection
      const secondLegFlights = this.dataLoader.getFlightsDepartingFrom(
        firstFlight.destination
      );

      for (const secondFlight of secondLegFlights) {
        // Skip if reaches destination (that's 1-stop, not 2-stop)
        if (secondFlight.destination === destination) {
          continue;
        }

        // Skip if goes back to origin (circular route)
        if (secondFlight.destination === origin) {
          continue;
        }

        // Validate first connection
        const firstLayover = calculateLayoverDuration(
          firstFlight.arrivalDateUTC,
          secondFlight.departureDateUTC
        );

        if (!canConnect(firstFlight, secondFlight, firstLayover)) {
          continue;
        }

        // Find third leg flights to destination
        const thirdLegFlights = this.dataLoader.getFlightsDepartingFrom(
          secondFlight.destination
        );

        for (const thirdFlight of thirdLegFlights) {
          // Must reach destination
          if (thirdFlight.destination !== destination) {
            continue;
          }

          // Validate second connection
          const secondLayover = calculateLayoverDuration(
            secondFlight.arrivalDateUTC,
            thirdFlight.departureDateUTC
          );

          if (canConnect(secondFlight, thirdFlight, secondLayover)) {
            const totalDuration = 
              firstFlight.durationMinutes +
              firstLayover +
              secondFlight.durationMinutes +
              secondLayover +
              thirdFlight.durationMinutes;

            connections.push({
              segments: [firstFlight, secondFlight, thirdFlight],
              totalDuration,
              totalPrice: firstFlight.price + secondFlight.price + thirdFlight.price,
            });
          }
        }
      }
    }

    return connections;
  }

  /**
   * Convert ConnectionCandidate to Itinerary with proper formatting
   */
  private convertToItineraries(candidates: ConnectionCandidate[]): Itinerary[] {
    return candidates.map(candidate => this.candidateToItinerary(candidate));
  }

  /**
   * Convert a single candidate to an Itinerary
   */
  private candidateToItinerary(candidate: ConnectionCandidate): Itinerary {
    const segments: FlightSegment[] = candidate.segments.map(flight => ({
      flightNumber: flight.flightNumber,
      airline: flight.airline,
      origin: flight.origin,
      originCountry: flight.originAirport.country,  //  Added country
      originCity: flight.originAirport.city,        // Added city
      destination: flight.destination,
      destinationCountry: flight.destinationAirport.country,  // Added country
      destinationCity: flight.destinationAirport.city,        // Added city
      departureTime: utcToLocalTime(
        flight.departureDateUTC,
        flight.originAirport.timezone
      ),
      arrivalTime: utcToLocalTime(
        flight.arrivalDateUTC,
        flight.destinationAirport.timezone
      ),
      duration: flight.durationMinutes,
      price: flight.price,
    }));

    const layovers: Layover[] = [];

    // Calculate layovers between segments
    for (let i = 0; i < candidate.segments.length - 1; i++) {
      const currentFlight = candidate.segments[i];
      const nextFlight = candidate.segments[i + 1];

      const layoverDuration = calculateLayoverDuration(
        currentFlight.arrivalDateUTC,
        nextFlight.departureDateUTC
      );

      const isDomestic = isDomesticConnection(currentFlight, nextFlight);

      layovers.push({
        airport: currentFlight.destination,
        airportCity: currentFlight.destinationAirport.city,      // Added city
        airportCountry: currentFlight.destinationAirport.country, // Added country
        duration: layoverDuration,
        isDomestic,
      });
    }

    return {
      id: uuidv4(),
      segments,
      layovers,
      totalDuration: candidate.totalDuration,
      totalPrice: candidate.totalPrice,
      stops: candidate.segments.length - 1,
    };
  }

  /**
   * Validate search parameters
   */
  private validateSearchParams(params: SearchParams): void {
    const { origin, destination, date } = params;

    // Check if airports exist
    const originAirport = this.dataLoader.getAirport(origin);
    const destinationAirport = this.dataLoader.getAirport(destination);

    if (!originAirport) {
      throw new Error(`Invalid origin airport code: ${origin}`);
    }

    if (!destinationAirport) {
      throw new Error(`Invalid destination airport code: ${destination}`);
    }

    // Check if origin and destination are different
    if (origin === destination) {
      throw new Error('Origin and destination must be different');
    }

    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw new Error('Invalid date format. Expected YYYY-MM-DD');
    }
  }
}

export default FlightSearchService;