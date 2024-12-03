/**
 * Converts an ISO date string to a formatted object with date and time.
 *
 * @param isoString - The ISO date string to convert (e.g., "2024-08-14T11:22:29.753Z").
 * @returns An object containing the formatted date and time.
 *          Example:
 *          {
 *              date: "08-14-2024",
 *              time: "11:22"
 *          }
 */
export default function convertDate(isoString: Date): {
  date: string
  time: string
} {
  const date = new Date(isoString)

  // Extract date components using local time
  const month = (date.getMonth() + 1).toString().padStart(2, '0') // Month (01-12)
  const day = date.getDate().toString().padStart(2, '0') // Day of the month (01-31)
  const year = date.getFullYear() // Full year (e.g., 2024)

  // Format the date as "MM-DD-YYYY"
  const formattedDate = `${month}-${day}-${year}`

  // Extract time components using local time
  const hours = date.getHours().toString().padStart(2, '0') // Hours (0-23)
  const minutes = date.getMinutes().toString().padStart(2, '0') // Minutes (0-59)

  // Format the time as "HH:mm"
  const formattedTime = `${hours}:${minutes}`

  return {
    date: formattedDate,
    time: formattedTime,
  }
}
