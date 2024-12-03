import { formatRelative, formatDistance, Locale } from 'date-fns'
import { format, toZonedTime } from 'date-fns-tz'
import { id, enUS } from 'date-fns/locale'

type DateFormat = 'full' | 'short' | 'relative' | 'time' | 'distance'
type LocaleType = 'id' | 'en'

const locales: Record<LocaleType, Locale> = {
  id,
  en: enUS
}

const dateFormats: Record<DateFormat, string> = {
  full: 'dd MMMM yyyy HH:mm zzz', // Added time zone
  short: 'MM/dd/yyyy',
  time: 'HH:mm zzz', // Added time zone
  relative: '',
  distance: ''
}

/**
 * Gets the user's local time zone
 */
export function getUserTimeZone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone
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
 * formatDate(new Date())
 * 
 * // Using specific time zone
 * formatDate(new Date(), { timeZone: 'Asia/Tokyo' })
 * 
 * // Full format with specific locale and time zone
 * formatDate(new Date(), { 
 *   formatType: 'full',
 *   locale: 'en',
 *   timeZone: 'America/New_York'
 * })
 */
export function formatDate(
  date: Date | string | number,
  options: DateOptions = {}
): string {
  const {
    formatType = 'full',
    locale = 'id',
    timeZone = getUserTimeZone()
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
        addSuffix: true
      })
    default:
      return format(zonedDate, dateFormats[formatType], {
        locale: selectedLocale,
        timeZone
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
 * formatDateTime(new Date())
 * 
 * // Using specific time zone
 * formatDateTime(new Date(), { timeZone: 'Europe/London' })
 */
export function formatDateTime(
  date: Date | string | number,
  options: Omit<DateOptions, 'formatType'> = {}
): { date: string; time: string } {
  const { locale = 'id', timeZone = getUserTimeZone() } = options

  return {
    date: formatDate(date, { formatType: 'short', locale, timeZone }),
    time: formatDate(date, { formatType: 'time', locale, timeZone })
  }
}
