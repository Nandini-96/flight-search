import { AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';

interface EmptyStateProps {
  origin?: string;
  destination?: string;
  date?: string;
}

export const EmptyState = ({ origin, destination, date }: EmptyStateProps) => {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-muted p-4 mb-4">
          <AlertCircle className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No Flights Found</h3>
        <p className="text-sm text-muted-foreground max-w-md mb-4">
          {origin && destination ? (
            <>
              We couldn't find any flights from <strong>{origin}</strong> to <strong>{destination}</strong>
              {date && <> on <strong>{date}</strong></>}.
            </>
          ) : (
            'No flights match your search criteria.'
          )}
        </p>
        <div className="text-xs text-muted-foreground space-y-1">
          <p>Try searching for:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>A different date</li>
            <li>Alternative airports nearby</li>
            <li>Different origin or destination</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};