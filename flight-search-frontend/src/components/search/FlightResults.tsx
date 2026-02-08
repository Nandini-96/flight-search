import { FlightCard } from './FlightCard';
import { EmptyState } from './EmptyState';
import type { SearchResponse } from '@/features/flights/types/flight.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Plane } from 'lucide-react';

interface FlightResultsProps {
  searchResponse: SearchResponse;
}

export const FlightResults = ({ searchResponse }: FlightResultsProps) => {
  const { itineraries, searchParams, totalResults } = searchResponse;

  if (totalResults === 0) {
    return (
      <EmptyState
        origin={searchParams.origin}
        destination={searchParams.destination}
        date={searchParams.date}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Plane className="h-6 w-6 text-primary" />
              <span>
                {totalResults} Flight{totalResults !== 1 ? 's' : ''} Found
              </span>
            </div>
            <div className="text-sm font-normal text-muted-foreground">
              {searchParams.origin} → {searchParams.destination} on {searchParams.date}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div>
              Direct flights: {itineraries.filter(i => i.stops === 0).length}
            </div>
            <div className="h-4 w-px bg-border" />
            <div>
              1-stop flights: {itineraries.filter(i => i.stops === 1).length}
            </div>
            <div className="h-4 w-px bg-border" />
            <div>
              2-stop flights: {itineraries.filter(i => i.stops === 2).length}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Flight Cards */}
      <div className="space-y-4">
        {itineraries.map((itinerary) => (
          <FlightCard key={itinerary.id} itinerary={itinerary} />
        ))}
      </div>

      {/* Results Footer */}
      {totalResults > 10 && (
        <div className="text-center text-sm text-muted-foreground py-4">
          Showing {Math.min(10, totalResults)} of {totalResults} results
        </div>
      )}
    </div>
  );
};