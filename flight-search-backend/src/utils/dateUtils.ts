import { format } from 'date-fns-tz';
import { utcToZonedTime } from 'date-fns-tz';

import { differenceInMinutes, parseISO } from 'date-fns';

/**
 * Convert local time string to UTC Date object
 * @param localTimeString - ISO string without timezone (e.g., "2024-03-15T08:30:00")
 * @param timezone - IANA timezone (e.g., "America/New_York")
 * @returns UTC Date object
 */
export function localTimeToUTC(localTimeString: string, timezone: string): Date {
  // Parse the local time string as UTC and adjust for timezone offset
  const date = parseISO(localTimeString);
  const zonedDate = utcToZonedTime(date, timezone);
  return new Date(date.getTime() - (zonedDate.getTime() - date.getTime()));
}

/**
 * Convert UTC Date to local time string in a specific timezone
 * @param utcDate - UTC Date object
 * @param timezone - IANA timezone
 * @returns ISO string in local time
 */
export function utcToLocalTime(utcDate: Date, timezone: string): string {
  const zonedDate = utcToZonedTime(utcDate, timezone);
  return format(zonedDate, "yyyy-MM-dd'T'HH:mm:ssXXX", { timeZone: timezone });
}

/**
 * Calculate duration between two dates in minutes
 * Handles timezone differences correctly
 */
export function calculateDuration(departureUTC: Date, arrivalUTC: Date): number {
  return differenceInMinutes(arrivalUTC, departureUTC);
}

/**
 * Calculate layover duration between two flights
 * @param firstArrivalUTC - First flight arrival in UTC
 * @param secondDepartureUTC - Second flight departure in UTC
 * @returns Duration in minutes
 */
export function calculateLayoverDuration(
  firstArrivalUTC: Date,
  secondDepartureUTC: Date
): number {
  return differenceInMinutes(secondDepartureUTC, firstArrivalUTC);
}

/**
 * Check if a date string matches a specific date (YYYY-MM-DD)
 * @param dateTimeString - ISO datetime string in local time
 * @param targetDate - Date string in YYYY-MM-DD format
 * @param timezone - IANA timezone
 */
export function matchesDate(
  dateTimeString: string,
  targetDate: string,
  timezone: string
): boolean {
  const utcDate = localTimeToUTC(dateTimeString, timezone);
  const localDate = utcToZonedTime(utcDate, timezone);
  const formattedDate = format(localDate, 'yyyy-MM-dd', { timeZone: timezone });
  return formattedDate === targetDate;
}

/**
 * Get date in YYYY-MM-DD format for a given timezone
 */
export function getLocalDate(date: Date, timezone: string): string {
  const zonedDate = utcToZonedTime(date, timezone);
  return format(zonedDate, 'yyyy-MM-dd', { timeZone: timezone });
}

/**
 * Parse date string to Date object
 */
export function parseDate(dateString: string): Date {
  return parseISO(dateString);
}

/**
 * Format duration in minutes to human-readable string
 */
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) {
    return `${mins}m`;
  }
  
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}