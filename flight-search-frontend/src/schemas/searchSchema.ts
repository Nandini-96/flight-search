import { z } from 'zod';

// IATA airport code regex (3 uppercase letters)
const IATA_CODE_REGEX = /^[A-Z]{3}$/;

export const searchFormSchema = z.object({
  origin: z
    .string()
    .min(1, 'Origin airport is required')
    .length(3, 'Airport code must be exactly 3 letters')
    .regex(IATA_CODE_REGEX, 'Airport code must be 3 uppercase letters (e.g., JFK)')
    .transform(val => val.toUpperCase()),
  
  destination: z
    .string()
    .min(1, 'Destination airport is required')
    .length(3, 'Airport code must be exactly 3 letters')
    .regex(IATA_CODE_REGEX, 'Airport code must be 3 uppercase letters (e.g., LAX)')
    .transform(val => val.toUpperCase()),
  
  date: z
    .date()
    .refine((date) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date >= today;
    }, 'Departure date cannot be in the past'),
}).refine(
  (data) => data.origin !== data.destination,
  {
    message: 'Origin and destination must be different',
    path: ['destination'],
  }
);

export type SearchFormSchema = z.infer<typeof searchFormSchema>;