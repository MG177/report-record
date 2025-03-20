import { formatDateTime } from './dateLocalization'

/**
 * Converts an ISO date string to a formatted object with date and time.
 * The date and time will be displayed in the user's local time zone.
 *
 * @param isoString - The ISO date string to convert (e.g., "2024-08-14T11:22:29.753Z").
 * @returns An object containing the formatted date and time.
 *          Example:
 *          {
 *              date: "08/14/2024",
 *              time: "11:22 GMT+8" // Time zone will be based on user's location
 *          }
 */
export default function convertDate(isoString: string): {
  date: string
  time: string
} {
  // return formatDateTime(isoString)
  const date = new Date(isoString) // Convert the string into a Date object

  return {
    date: date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    }),
    time: date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    }),
  }
}
