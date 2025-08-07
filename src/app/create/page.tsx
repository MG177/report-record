'use client'

import { useRouter } from 'next/navigation'
import { HeaderNewReports } from '@/app/components/header'
import ReportForm from '@/app/components/reportForm'
import { ReportCreate } from '@lib/validations/report'
import { toISOString } from '@utils/dateUtils'

export default function CreateReport() {
  const router = useRouter()

  const handleSubmit = async (formData: ReportCreate) => {
    try {
      // Ensure we have a valid date
      let dateToSend: string
      if (formData.date instanceof Date && !isNaN(formData.date.getTime())) {
        dateToSend = toISOString(formData.date)
      } else if (typeof formData.date === 'string') {
        // If it's already a string, validate it's a proper ISO string
        const parsedDate = new Date(formData.date)
        if (!isNaN(parsedDate.getTime())) {
          dateToSend = formData.date
        } else {
          throw new Error('Invalid date format')
        }
      } else {
        // Fallback to current date
        dateToSend = toISOString(new Date())
      }

      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          date: dateToSend,
        }),
      })

      if (response.ok) {
        router.push('/')
        router.refresh()
      } else {
        throw new Error('Failed to create report')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      // Handle error appropriately
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center w-full mx-auto">
      <HeaderNewReports />
      <ReportForm onSubmit={handleSubmit} />
    </main>
  )
}
