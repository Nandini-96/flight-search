import { format, parseISO } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

/**
 * Format duration in minutes to readable string
 * @example 125 -> "2h 5m"
 */
export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) {
    return `${mins}m`;
  }
  
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};

/**
 * Format time for display
 * @example "2024-02-07T14:30:00" -> "2:30 PM"
 */
export const formatTime = (isoDateTime: string): string => {
  return format(parseISO(isoDateTime), 'h:mm a');
};

/**
 * Format date for display
 * @example "2024-02-07T14:30:00" -> "Feb 7, 2024"
 */
export const formatDate = (isoDateTime: string): string => {
  return format(parseISO(isoDateTime), 'MMM d, yyyy');
};

/**
 * Format date and time for display
 * @example "2024-02-07T14:30:00" -> "Feb 7, 2:30 PM"
 */
export const formatDateTime = (isoDateTime: string): string => {
  return format(parseISO(isoDateTime), 'MMM d, h:mm a');
};

/**
 * Format price for display
 * @example 299.99 -> "$299.99"
 */
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(price);
};

/**
 * Get stop text
 * @example 0 -> "Direct"
 * @example 1 -> "1 stop"
 * @example 2 -> "2 stops"
 */
export const getStopText = (stops: number): string => {
  if (stops === 0) return 'Direct';
  if (stops === 1) return '1 stop';
  return `${stops} stops`;
};

/**
 * Calculate layover category for display
 */
export const getLayoverCategory = (minutes: number): {
  category: 'short' | 'moderate' | 'long';
  label: string;
} => {
  if (minutes < 90) {
    return { category: 'short', label: 'Quick layover' };
  } else if (minutes < 180) {
    return { category: 'moderate', label: 'Moderate layover' };
  } else {
    return { category: 'long', label: 'Long layover' };
  }
};

/**
 * Truncate airline name for display
 */
export const formatAirlineName = (airline: string): string => {
  // Remove "Airlines" suffix if present
  return airline.replace(/\s+Airlines?$/i, '');
};