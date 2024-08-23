import * as XLSX from 'xlsx'

/**
 * Export an object to an XLS file.
 * @param data - The object data to export.
 * @param fileName - The name of the output XLS file.
 */

export function exportObjectToXLS(data: Record<string, any>[]): void {
  // Create a new worksheet from the data array
  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data)

  // Create a new workbook and append the worksheet
  const workbook: XLSX.WorkBook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')

  // Convert the workbook to binary data
  const excelBuffer: any = XLSX.write(workbook, {
    bookType: 'xlsx',
    type: 'array',
  })

  // Create a Blob from the binary data and generate a download link
  const blob: Blob = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })

  // Create a link element and trigger the download
  const link: HTMLAnchorElement = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `Report-${Date.now().toString()}.xlsx`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
