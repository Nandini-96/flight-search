/**
 * Core domain types for the flight search system
 */

export interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
  timezone: string;
}

export interface Flight {
  flightNumber: string;
  airline: string;
  origin: string;
  destination: string;
  departureTime: string; // ISO 8601 string in local time
  arrivalTime: string;   // ISO 8601 string in local time
  price: number;
  aircraft: string;
}

export interface FlightData {
  airports: Airport[];
  flights: Flight[];
}

// Search domain types

export interface SearchParams {
  origin: string;
  destination: string;
  date: string; // YYYY-MM-DD format
}

export interface FlightSegment {
  flightNumber: string;
  airline: string;
  origin: string;
  originCountry: string;      
  originCity: string;          
  destination: string;
  destinationCountry: string;  
  destinationCity: string;     
  departureTime: string; // ISO 8601 with timezone
  arrivalTime: string;   // ISO 8601 with timezone
  duration: number;      // minutes
  price: number;
}

export interface Layover {
  airport: string;
  airportCity: string;     
  airportCountry: string;  
  duration: number; // minutes
  isDomestic: boolean;
}

export interface Itinerary {
  id: string;
  segments: FlightSegment[];
  layovers: Layover[];
  totalDuration: number; // minutes
  totalPrice: number;
  stops: number;
}

export interface SearchResponse {
  itineraries: Itinerary[];
  searchParams: SearchParams;
  totalResults: number;
}

// Internal types for processing

export interface FlightWithMetadata extends Flight {
  originAirport: Airport;
  destinationAirport: Airport;
  departureDateUTC: Date;
  arrivalDateUTC: Date;
  durationMinutes: number;
}

export interface ConnectionCandidate {
  segments: FlightWithMetadata[];
  totalDuration: number;
  totalPrice: number;
}