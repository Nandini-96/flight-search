import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Disable automatic refetching
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      
      // Cache for 5 minutes
      staleTime: 5 * 60 * 1000,
      
      // Keep unused data for 10 minutes
      gcTime: 10 * 60 * 1000,
      
      // Retry failed requests once
      retry: 1,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      // Don't retry mutations by default
      retry: false,
    },
  },
});