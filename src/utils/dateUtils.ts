import { formatDateTime, getUserTimeZone } from './dateLocalization'

/**
 * Utility functions for consistent date handling across the application
 */

/**
 * Formats a date for display in the UI
 * @param date - Date to format
 * @returns Formatted date string
 */
export function formatDateForDisplay(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return formatDateTime(dateObj, { timeZone: getUserTimeZone() }).date
}

/**
 * Formats a time for display in the UI
 * @param date - Date to format
 * @returns Formatted time string
 */
export function formatTimeForDisplay(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return formatDateTime(dateObj, { timeZone: getUserTimeZone() }).time
}

/**
 * Formats a date and time for display in the UI
 * @param date - Date to format
 * @returns Object with formatted date and time
 */
export function formatDateTimeForDisplay(date: Date | string): {
  date: string
  time: string
} {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return formatDateTime(dateObj, { timeZone: getUserTimeZone() })
}

/**
 * Converts a date to ISO string for API calls
 * @param date - Date to convert
 * @returns ISO string
 */
export function toISOString(date: Date): string {
  return date.toISOString()
}

/**
 * Creates a date from ISO string
 * @param isoString - ISO date string
 * @returns Date object
 */
export function fromISOString(isoString: string): Date {
  return new Date(isoString)
}

/**
 * Validates if a date is valid
 * @param date - Date to validate
 * @returns True if valid
 */
export function isValidDate(date: Date): boolean {
  return date instanceof Date && !isNaN(date.getTime())
}

/**
 * Gets the current date in local timezone
 * @returns Current date
 */
export function getCurrentDate(): Date {
  return new Date()
}

/**
 * Formats a date for HTML date input (YYYY-MM-DD)
 * @param date - Date to format
 * @returns Date string for HTML input
 */
export function formatDateForInput(date: Date): string {
  return date.toISOString().split('T')[0]
}

/**
 * Formats a time for HTML time input (HH:MM)
 * @param date - Date to format
 * @returns Time string for HTML input
 */
export function formatTimeForInput(date: Date): string {
  return date.toTimeString().slice(0, 5)
}
