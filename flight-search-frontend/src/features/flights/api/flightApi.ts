import { format } from 'date-fns';
import apiClient from '@/lib/axios';
import type { SearchParams, SearchResponse } from '../types/flight.types';

export const flightApi = {
  /**
   * Search for flight itineraries
   */
  searchFlights: async (params: SearchParams): Promise<SearchResponse> => {
    const response = await apiClient.get<SearchResponse>('/flights/search', {
      params: {
        origin: params.origin.toUpperCase(),
        destination: params.destination.toUpperCase(),
        date: params.date, // Should be in YYYY-MM-DD format
      },
    });
    
    return response.data;
  },

  /**
   * Helper to format date for API
   */
  formatDateForApi: (date: Date): string => {
    return format(date, 'yyyy-MM-dd');
  },
};

export default flightApi;