import { useQuery } from '@tanstack/react-query';
import flightApi from '../api/flightApi';
import type { SearchParams, SearchResponse, ApiError } from '../types/flight.types';

export const FLIGHT_SEARCH_QUERY_KEY = 'flightSearch';

interface UseFlightSearchParams {
  origin: string;
  destination: string;
  date: Date;
  enabled?: boolean;
}

export const useFlightSearch = ({ origin, destination, date, enabled = false }: UseFlightSearchParams) => {
  const searchParams: SearchParams = {
    origin: origin.toUpperCase(),
    destination: destination.toUpperCase(),
    date: flightApi.formatDateForApi(date),
  };

  return useQuery<SearchResponse, ApiError>({
    queryKey: [FLIGHT_SEARCH_QUERY_KEY, searchParams],
    queryFn: () => flightApi.searchFlights(searchParams),
    enabled: enabled && !!origin && !!destination && !!date,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};