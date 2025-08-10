import { format, toZonedTime } from 'date-fns-tz'

/**
 * Comprehensive date utilities for multi-timezone applications
 * Consolidates all date handling functions in one place
 */

// ===== BASIC UTILITY FUNCTIONS =====

/**
 * Gets the user's local timezone
 */
export function getUserTimeZone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone
}

/**
 * Gets the current date in local timezone
 */
export function getCurrentDate(): Date {
  return new Date()
}

/**
 * Validates if a date is valid
 */
export function isValidDate(date: Date): boolean {
  return date instanceof Date && !isNaN(date.getTime())
}

// ===== TIMEZONE CONVERSION FUNCTIONS =====

/**
 * Creates a UTC date from local date/time inputs
 * This is the correct way to handle user input in their local timezone
 *
 * @param dateString - Date string (YYYY-MM-DD)
 * @param timeString - Time string (HH:MM)
 * @param timeZone - User's timezone (defaults to browser timezone)
 * @returns UTC Date object for storage
 */
export function createUTCFromLocalInput(
  dateString: string,
  timeString: string,
  timeZone: string = getUserTimeZone()
): Date {
  // Create ISO string in the user's timezone
  const isoString = `${dateString}T${timeString}:00`

  // Parse as if it's in the user's timezone, then convert to UTC
  const localDate = new Date(isoString)

  // Get the timezone offset in minutes
  const timezoneOffset = localDate.getTimezoneOffset()

  // Adjust the date by the timezone offset to get UTC
  const utcDate = new Date(localDate.getTime() + timezoneOffset * 60 * 1000)

  return utcDate
}

/**
 * Converts a UTC date to a specific timezone for display
 *
 * @param utcDate - UTC Date object from database
 * @param timeZone - Target timezone for display
 * @returns Date object in target timezone
 */
export function convertUTCToTimeZone(
  utcDate: Date,
  timeZone: string = getUserTimeZone()
): Date {
  return toZonedTime(utcDate, timeZone)
}

// ===== FORMATTING FUNCTIONS =====

/**
 * Formats a UTC date for HTML date input in a specific timezone
 *
 * @param utcDate - UTC Date object from database
 * @param timeZone - Target timezone
 * @returns Date string for HTML input (YYYY-MM-DD)
 */
export function formatDateForInput(
  utcDate: Date,
  timeZone: string = getUserTimeZone()
): string {
  const zonedDate = toZonedTime(utcDate, timeZone)
  return format(zonedDate, 'yyyy-MM-dd', { timeZone })
}

/**
 * Formats a UTC date for HTML time input in a specific timezone
 *
 * @param utcDate - UTC Date object from database
 * @param timeZone - Target timezone
 * @returns Time string for HTML input (HH:MM)
 */
export function formatTimeForInputInTimeZone(
  utcDate: Date,
  timeZone: string = getUserTimeZone()
): string {
  const zonedDate = toZonedTime(utcDate, timeZone)
  return format(zonedDate, 'HH:mm', { timeZone })
}

/**
 * Formats a UTC date for display in a specific timezone
 *
 * @param utcDate - UTC Date object from database
 * @param timeZone - Target timezone
 * @returns Formatted date string
 */
export function formatDateForDisplay(
  utcDate: Date,
  timeZone: string = getUserTimeZone()
): string {
  const zonedDate = toZonedTime(utcDate, timeZone)
  return format(zonedDate, 'MM/dd/yyyy', { timeZone })
}

/**
 * Formats a UTC date/time for display in a specific timezone
 *
 * @param utcDate - UTC Date object from database
 * @param timeZone - Target timezone
 * @returns Object with formatted date and time
 */
export function formatDateTimeForDisplay(
  utcDate: Date,
  timeZone: string = getUserTimeZone()
): { date: string; time: string } {
  const zonedDate = toZonedTime(utcDate, timeZone)
  return {
    date: format(zonedDate, 'MM/dd/yyyy', { timeZone }),
    time: format(zonedDate, 'hh:mm aa zzz', { timeZone }),
  }
}

// ===== ISO CONVERSION FUNCTIONS =====

/**
 * Converts a date to ISO string for API calls
 * @param date - Date to convert
 * @returns ISO string
 */
export function toISOString(date: Date): string {
  return date.toISOString()
}

/**
 * Converts a date to ISO string while preserving timezone information
 *
 * @param date - Date to convert
 * @param timeZone - Timezone context
 * @returns ISO string
 */
export function toISOStringWithTimeZone(
  date: Date,
  timeZone: string = getUserTimeZone()
): string {
  const zonedDate = toZonedTime(date, timeZone)
  return zonedDate.toISOString()
}

// ===== TIMEZONE UTILITY FUNCTIONS =====
