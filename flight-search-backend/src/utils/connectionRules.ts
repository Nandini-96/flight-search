import type { FlightWithMetadata } from '../types';

/**
 * Connection rules and validation logic
 */

// Layover time constraints (in minutes)
export const LAYOVER_CONSTRAINTS = {
  MIN_DOMESTIC: 45,      // Minimum layover for domestic connections
  MIN_INTERNATIONAL: 90, // Minimum layover for international connections
  MAX: 360,              // Maximum layover (6 hours)
} as const;

/**
 * Check if a connection between two flights is domestic
 * A connection is domestic if both flights are within the same country
 */
export function isDomesticConnection(
  arrivingFlight: FlightWithMetadata,
  departingFlight: FlightWithMetadata
): boolean {
  return arrivingFlight.destinationAirport.country === departingFlight.originAirport.country;
}

/**
 * Validate if a layover meets the minimum and maximum time requirements
 */
export function isValidLayoverDuration(
  layoverMinutes: number,
  isDomestic: boolean
): boolean {
  const minRequired = isDomestic 
    ? LAYOVER_CONSTRAINTS.MIN_DOMESTIC 
    : LAYOVER_CONSTRAINTS.MIN_INTERNATIONAL;
  
  return layoverMinutes >= minRequired && layoverMinutes <= LAYOVER_CONSTRAINTS.MAX;
}

/**
 * Validate if two flights can connect at an airport
 * Checks:
 * 1. Arriving and departing from same airport
 * 2. Layover duration is valid
 * 3. Second flight departs after first flight arrives
 */
export function canConnect(
  firstFlight: FlightWithMetadata,
  secondFlight: FlightWithMetadata,
  layoverMinutes: number
): boolean {
  // Must be at the same airport
  if (firstFlight.destination !== secondFlight.origin) {
    return false;
  }

  // Second flight must depart after first flight arrives
  if (secondFlight.departureDateUTC <= firstFlight.arrivalDateUTC) {
    return false;
  }

  // Check layover duration constraints
  const isDomestic = isDomesticConnection(firstFlight, secondFlight);
  return isValidLayoverDuration(layoverMinutes, isDomestic);
}

/**
 * Validate a complete itinerary path
 * Ensures all segments connect properly
 */
export function isValidItinerary(segments: FlightWithMetadata[]): boolean {
  if (segments.length === 0) {
    return false;
  }

  // For single segment (direct flight), always valid
  if (segments.length === 1) {
    return true;
  }

  // Check each connection
  for (let i = 0; i < segments.length - 1; i++) {
    const currentFlight = segments[i];
    const nextFlight = segments[i + 1];
    
    // Calculate layover
    const layoverMinutes = Math.floor(
      (nextFlight.departureDateUTC.getTime() - currentFlight.arrivalDateUTC.getTime()) / 
      (1000 * 60)
    );

    if (!canConnect(currentFlight, nextFlight, layoverMinutes)) {
      return false;
    }
  }

  return true;
}

/**
 * Get the minimum required layover for a connection
 */
export function getMinimumLayover(
  arrivingFlight: FlightWithMetadata,
  departingFlight: FlightWithMetadata
): number {
  const isDomestic = isDomesticConnection(arrivingFlight, departingFlight);
  return isDomestic 
    ? LAYOVER_CONSTRAINTS.MIN_DOMESTIC 
    : LAYOVER_CONSTRAINTS.MIN_INTERNATIONAL;
}

/**
 * Check if an airport code is valid (3 uppercase letters)
 */
export function isValidAirportCode(code: string): boolean {
  return /^[A-Z]{3}$/.test(code);
}

/**
 * Check if a date string is valid (YYYY-MM-DD)
 */
export function isValidDateFormat(date: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(date);
}