// Core flight data types matching backend schema

export interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
  timezone: string;
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
  departureTime: string; // ISO 8601 datetime
  arrivalTime: string;   // ISO 8601 datetime
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

export interface SearchParams {
  origin: string;
  destination: string;
  date: string; // YYYY-MM-DD
}

export interface SearchResponse {
  itineraries: Itinerary[];
  searchParams: SearchParams;
  totalResults: number;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

// UI State types
export interface SearchFormData {
  origin: string;
  destination: string;
  date: Date;
}