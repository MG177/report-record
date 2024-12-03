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
export default function convertDate(isoString: Date): {
  date: string
  time: string
} {
  return formatDateTime(isoString)
}
