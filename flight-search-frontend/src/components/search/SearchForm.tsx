import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Search, Calendar, MapPin } from 'lucide-react';
import { searchFormSchema, type SearchFormSchema } from '@/schemas/searchSchema';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';

interface SearchFormProps {
  onSearch: (data: SearchFormSchema) => void;
  isLoading?: boolean;
}

export const SearchForm = ({ onSearch, isLoading }: SearchFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SearchFormSchema>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      origin: '',
      destination: '',
      date: new Date(),
    },
  });

  const origin = watch('origin');
  const destination = watch('destination');

  const onSubmit = (data: SearchFormSchema) => {
    onSearch(data);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <Search className="h-6 w-6" />
          Search Flights
        </CardTitle>
        <CardDescription>
          Find the best flights with direct connections and multi-stop options
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Origin Input */}
          <div className="space-y-2">
            <label htmlFor="origin" className="text-sm font-medium flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Origin
            </label>
            <Input
              id="origin"
              placeholder="JFK"
              maxLength={3}
              className={errors.origin ? 'border-destructive' : ''}
              {...register('origin')}
              autoCapitalize="characters"
              disabled={isLoading}
            />
            {errors.origin && (
              <p className="text-sm text-destructive">{errors.origin.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              3-letter airport code
            </p>
          </div>

          {/* Destination Input */}
          <div className="space-y-2">
            <label htmlFor="destination" className="text-sm font-medium flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Destination
            </label>
            <Input
              id="destination"
              placeholder="LAX"
              maxLength={3}
              className={errors.destination ? 'border-destructive' : ''}
              {...register('destination')}
              autoCapitalize="characters"
              disabled={isLoading}
            />
            {errors.destination && (
              <p className="text-sm text-destructive">{errors.destination.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              3-letter airport code
            </p>
          </div>

          {/* Date Input */}
          <div className="space-y-2">
            <label htmlFor="date" className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Departure Date
            </label>
            <Input
              id="date"
              type="date"
              className={errors.date ? 'border-destructive' : ''}
              {...register('date', {
                valueAsDate: true,
              })}
              min={new Date().toISOString().split('T')[0]}
              disabled={isLoading}
            />
            {errors.date && (
              <p className="text-sm text-destructive">{errors.date.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Searching...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Search Flights
              </>
            )}
          </Button>

          {/* Search Summary */}
          {origin && destination && (
            <div className="text-sm text-muted-foreground text-center pt-2 border-t">
              <strong className="text-foreground">{origin.toUpperCase()}</strong>
              {' → '}
              <strong className="text-foreground">{destination.toUpperCase()}</strong>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};