import { Plane, Clock, DollarSign, MapPin, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import type { Itinerary } from '@/features/flights/types/flight.types';
import {
  formatDuration,
  formatTime,
  formatPrice,
  getStopText,
  formatAirlineName,
  getLayoverCategory,
} from '@/features/flights/utils/flightUtils';

interface FlightCardProps {
  itinerary: Itinerary;
}

export const FlightCard = ({ itinerary }: FlightCardProps) => {
  const { segments, layovers, totalDuration, totalPrice, stops } = itinerary;
  
  const firstSegment = segments[0];
  const lastSegment = segments[segments.length - 1];

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        {/* Header: Route Overview */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{firstSegment.origin}</div>
              <div className="text-xs text-muted-foreground">{firstSegment.originCity}</div>
              <div className="text-xs text-muted-foreground font-semibold">{firstSegment.originCountry}</div>
              <div className="text-sm text-muted-foreground">
                {formatTime(firstSegment.departureTime)}
              </div>
            </div>
            
            <div className="flex flex-col items-center px-4">
              <Plane className="h-5 w-5 text-primary mb-1" />
              <div className="text-xs text-muted-foreground font-medium">
                {getStopText(stops)}
              </div>
              <div className="text-xs text-muted-foreground">
                {formatDuration(totalDuration)}
              </div>
              {/* Show if route is international */}
              {!layovers.every(l => l.isDomestic) && (
                <div className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded mt-1">
                  International
                </div>
              )}
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold">{lastSegment.destination}</div>
              <div className="text-xs text-muted-foreground">{lastSegment.destinationCity}</div>
              <div className="text-xs text-muted-foreground font-semibold">{lastSegment.destinationCountry}</div>
              <div className="text-sm text-muted-foreground">
                {formatTime(lastSegment.arrivalTime)}
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-3xl font-bold text-primary">
              {formatPrice(totalPrice)}
            </div>
            <div className="text-xs text-muted-foreground">total price</div>
          </div>
        </div>

        {/* Flight Segments */}
        <div className="space-y-4">
          {segments.map((segment, index) => (
            <div key={`${segment.flightNumber}-${index}`}>
              {/* Segment Details */}
              <div className="flex items-start gap-4">
                {/* Timeline indicator */}
                <div className="flex flex-col items-center pt-1">
                  <div className="h-3 w-3 rounded-full bg-primary" />
                  {index < segments.length - 1 && (
                    <div className="w-0.5 h-full min-h-[60px] bg-border mt-1" />
                  )}
                </div>

                {/* Segment Info */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="font-semibold">
                        {formatAirlineName(segment.airline)} {segment.flightNumber}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {segment.origin} ({segment.originCity}, {segment.originCountry}) → {segment.destination} ({segment.destinationCity}, {segment.destinationCountry})
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDuration(segment.duration)}
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span>Depart: {formatTime(segment.departureTime)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span>Arrive: {formatTime(segment.arrivalTime)}</span>
                    </div>
                    <div className="text-muted-foreground">
                      ${segment.price.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Layover Information */}
              {index < layovers.length && layovers[index] && (
                <div className="ml-8 mt-3 mb-1">
                  <div className={`flex items-start gap-2 p-3 rounded-lg border ${
                    layovers[index].isDomestic 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-blue-50 border-blue-200'
                  }`}>
                    <AlertCircle 
                      className={`h-4 w-4 mt-0.5 ${
                        getLayoverCategory(layovers[index].duration).category === 'long'
                          ? 'text-yellow-600'
                          : layovers[index].isDomestic
                          ? 'text-green-600'
                          : 'text-blue-600'
                      }`}
                    />
                    <div className="flex-1 text-sm">
                      <div className="font-medium flex items-center gap-2">
                        <span>
                          {formatDuration(layovers[index].duration)} layover in{' '}
                          {layovers[index].airport}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded font-semibold ${
                          layovers[index].isDomestic
                            ? 'bg-green-100 text-green-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {layovers[index].isDomestic ? 'Domestic' : 'International'}
                        </span>
                      </div>
                      <div className="text-muted-foreground text-xs mt-1">
                        {layovers[index].airportCity}, {layovers[index].airportCountry}
                        {' • '}
                        {getLayoverCategory(layovers[index].duration).label}
                        {' • '}
                        Min required: {layovers[index].isDomestic ? '45' : '90'} min
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer: Quick Stats */}
        <div className="flex items-center gap-6 mt-6 pt-4 border-t text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>Total: {formatDuration(totalDuration)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Plane className="h-4 w-4" />
            <span>{segments.length} flight{segments.length > 1 ? 's' : ''}</span>
          </div>
          {stops > 0 && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{getStopText(stops)}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};