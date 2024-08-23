/**
 * Converts an ISO date string to a formatted object with date and time.
 *
 * @param isoString - The ISO date string to convert (e.g., "2024-08-14T11:22:29.753Z").
 * @returns An object containing the formatted date and time.
 *          Example:
 *          {
 *              date: "14-Agustus-2024",
 *              time: "11:22"
 *          }
 */
export default function convertDate(isoString: Date): {
  date: string
  time: string
} {
  const date = new Date(isoString)

  // Define Indonesian month names
  const indonesianMonths = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ]

  // Extract date components using local time
  const day = date.getDate().toString().padStart(2, '0') // Day of the month (1-31)
  const monthIndex = date.getMonth() // Month index (0-11)
  const monthName = indonesianMonths[monthIndex] // Indonesian month name
  const year = date.getFullYear() // Full year (e.g., 2024)

  // Format the date as "DD-MMMM-YYYY"
  const formattedDate = `${day}-${monthName}-${year}`

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
