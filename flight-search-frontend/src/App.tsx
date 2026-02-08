import { useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { SearchForm } from './components/search/SearchForm';
import { FlightResults } from './components/search/FlightResults';
import { LoadingSpinner } from './components/common/LoadingSpinner';
import { Alert, AlertDescription, AlertTitle } from './components/ui/Alert';
import { useFlightSearch } from './features/flights/hooks/useFlightSearch';
import type { SearchFormSchema } from './schemas/searchSchema';
import { AlertCircle, Plane } from 'lucide-react';

function FlightSearchApp() {
  const [searchParams, setSearchParams] = useState<SearchFormSchema | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Use the custom hook for flight search
  const { data, isLoading, error, refetch } = useFlightSearch({
    origin: searchParams?.origin || '',
    destination: searchParams?.destination || '',
    date: searchParams?.date || new Date(),
    enabled: hasSearched && !!searchParams,
  });

  const handleSearch = (formData: SearchFormSchema) => {
    setSearchParams(formData);
    setHasSearched(true);
    // Refetch with new params
    setTimeout(() => refetch(), 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center gap-3">
            <div className="p-2 bg-primary rounded-lg">
              <Plane className="h-8 w-8 text-white" />
            </div>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900">
                FlightFinder
              </h1>
              <p className="text-sm text-muted-foreground">
                Search and compare flight connections worldwide
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Side by Side Layout */}
      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="flex flex-col lg:flex-row gap-6 h-full">
          {/* Left Side - Search Form (Smaller - 1/3 width) */}
          <div className="lg:w-1/3 flex-shrink-0">
            <div className="sticky top-8">
              <SearchForm onSearch={handleSearch} isLoading={isLoading} />
            </div>
          </div>

          {/* Right Side - Results (Larger - 2/3 width) */}
          <div className="lg:w-2/3 flex-1">
            {/* Results Section */}
            {hasSearched ? (
              <div className="space-y-6">
                {/* Loading State */}
                {isLoading && (
                  <div className="flex items-center justify-center py-12">
                    <LoadingSpinner size="lg" message="Searching for the best flights..." />
                  </div>
                )}

                {/* Error State */}
                {error && !isLoading && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error Searching Flights</AlertTitle>
                    <AlertDescription>
                      {error.message || 'An unexpected error occurred. Please try again.'}
                      {error.code && (
                        <div className="mt-2 text-xs opacity-75">Error Code: {error.code}</div>
                      )}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Results */}
                {data && !isLoading && !error && (
                  <FlightResults searchResponse={data} />
                )}
              </div>
            ) : (
              /* Initial State - Before Search */
              <div className="text-center py-12 space-y-4">
                {/* Animated Plane Icon */}
                <div className="inline-block p-4 bg-primary/10 rounded-full mb-4 relative">
                  <Plane className="h-12 w-12 text-primary animate-plane-fly" />
                  {/* Cloud decorations */}
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full opacity-70 animate-float-slow"></div>
                  <div className="absolute -bottom-1 -left-1 w-6 h-6 bg-white rounded-full opacity-50 animate-float-fast"></div>
                </div>
                
                <h2 className="text-2xl font-semibold text-gray-900 animate-fade-in">
                  Ready to Find Your Perfect Flight?
                </h2>
                <p className="text-muted-foreground max-w-md mx-auto animate-fade-in-delay">
                  Enter your travel details in the search form to find direct flights and multi-stop connections.
                  We'll find the best options for you!
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mt-8">
                  <div className="p-4 bg-white rounded-lg border shadow-sm hover:shadow-lg transition-shadow duration-300 animate-slide-up-1">
                    <div className="text-3xl font-bold text-primary mb-2">Direct</div>
                    <div className="text-sm text-muted-foreground">
                      Non-stop flights for fastest travel
                    </div>
                  </div>
                  <div className="p-4 bg-white rounded-lg border shadow-sm hover:shadow-lg transition-shadow duration-300 animate-slide-up-2">
                    <div className="text-3xl font-bold text-primary mb-2">1-Stop</div>
                    <div className="text-sm text-muted-foreground">
                      Connections with one layover
                    </div>
                  </div>
                  <div className="p-4 bg-white rounded-lg border shadow-sm hover:shadow-lg transition-shadow duration-300 animate-slide-up-3">
                    <div className="text-3xl font-bold text-primary mb-2">2-Stop</div>
                    <div className="text-sm text-muted-foreground">
                      Extended routes with two layovers
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-auto">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>© 2024 FlightFinder. Built with React, TypeScript, and TanStack Query.</p>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <FlightSearchApp />
    </QueryClientProvider>
  );
}

export default App;