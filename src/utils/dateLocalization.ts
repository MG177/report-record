import { formatRelative, formatDistance, Locale } from 'date-fns'
import { format, toZonedTime } from 'date-fns-tz'
import { id, enUS } from 'date-fns/locale'

type DateFormat = 'full' | 'short' | 'relative' | 'time' | 'distance'
type LocaleType = 'id' | 'en'

const locales: Record<LocaleType, Locale> = {
  id,
  en: enUS,
}

const dateFormats: Record<DateFormat, string> = {
  full: 'MMMM dd, yyyy hh:mm aa zzz', // US format with 12-hour time
  short: 'MM/dd/yyyy', // US format MM/DD/YYYY
  time: 'hh:mm aa zzz', // 12-hour time with AM/PM
  relative: '',
  distance: '',
}

/**
 * Creates a proper timezone-aware date from date and time strings
 * Converts local date/time to UTC for storage
 *
 * @param dateString - Date string in YYYY-MM-DD format
 * @param timeString - Time string in HH:MM format
 * @param timeZone - Target timezone (defaults to user's timezone)
 * @returns UTC Date object for storage
 */
export function createTimeZoneAwareDateTime(
  dateString: string,
  timeString: string,
  timeZone: string = getUserTimeZone()
): Date {
  const [year, month, day] = dateString.split('-').map(Number)
  const [hours, minutes] = timeString.split(':').map(Number)

  // Create date string in the target timezone
  const dateTimeString = `${year}-${month.toString().padStart(2, '0')}-${day
    .toString()
    .padStart(2, '0')}T${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:00`

  // Create a date object and convert it to the target timezone, then get UTC
  const localDate = new Date(dateTimeString)
  const zonedDate = toZonedTime(localDate, timeZone)
  return zonedDate
}

/**
 * Converts a UTC date back to a specific timezone for display
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

/**
 * Gets the user's local time zone
 */
export function getUserTimeZone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone
}

/**
 * Formats a date for HTML date input (YYYY-MM-DD) in a specific timezone
 * @param date - UTC Date object
 * @param timeZone - Target timezone
 * @returns Date string for HTML input
 */
export function formatDateForInputInTimeZone(
  date: Date,
  timeZone: string = getUserTimeZone()
): string {
  const zonedDate = toZonedTime(date, timeZone)
  return format(zonedDate, 'yyyy-MM-dd', { timeZone })
}

/**
 * Formats a time for HTML time input (HH:MM) in a specific timezone
 * @param date - UTC Date object
 * @param timeZone - Target timezone
 * @returns Time string for HTML input
 */
export function formatTimeForInputInTimeZone(
  date: Date,
  timeZone: string = getUserTimeZone()
): string {
  const zonedDate = toZonedTime(date, timeZone)
  return format(zonedDate, 'HH:mm', { timeZone })
}

interface DateOptions {
  formatType?: DateFormat
  locale?: LocaleType
  timeZone?: string
}

/**
 * Formats a date with proper time zone and localization support
 *
 * @param date - Date to format
 * @param options - Formatting options
 * @returns Formatted date string
 *
 * @example
 * // Using browser's time zone
 * formatDate(new Date())  // "August 14, 2024 11:22 AM EDT"
 *
 * // Using specific time zone
 * formatDate(new Date(), { timeZone: 'America/New_York' })
 *
 * // Short format
 * formatDate(new Date(), { formatType: 'short' })  // "08/14/2024"
 */
export function formatDate(
  date: Date | string | number,
  options: DateOptions = {}
): string {
  const {
    formatType = 'full',
    locale = 'en', // Default to English locale
    timeZone = getUserTimeZone(),
  } = options

  const dateObj = new Date(date)
  const zonedDate = toZonedTime(dateObj, timeZone)
  const selectedLocale = locales[locale]

  switch (formatType) {
    case 'relative':
      return formatRelative(zonedDate, new Date(), { locale: selectedLocale })
    case 'distance':
      return formatDistance(zonedDate, new Date(), {
        locale: selectedLocale,
        addSuffix: true,
      })
    default:
      return format(zonedDate, dateFormats[formatType], {
        locale: selectedLocale,
        timeZone,
      })
  }
}

/**
 * Formats a date into a date-time object with proper time zone support
 *
 * @param date - Date to format
 * @param options - Formatting options
 * @returns Object containing formatted date and time
 *
 * @example
 * // Using browser's time zone
 * formatDateTime(new Date())  // { date: "08/14/2024", time: "11:22 AM EDT" }
 */
export function formatDateTime(
  date: Date | string | number,
  options: Omit<DateOptions, 'formatType'> = {}
): { date: string; time: string } {
  const { locale = 'en', timeZone = getUserTimeZone() } = options

  return {
    date: formatDate(date, { formatType: 'short', locale, timeZone }),
    time: formatDate(date, { formatType: 'time', locale, timeZone }),
  }
}
