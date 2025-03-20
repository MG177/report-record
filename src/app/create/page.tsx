'use client'

import { useRouter } from 'next/navigation'
import { HeaderNewReports } from '@/components/header'
import ReportForm from '@/components/reportForm'
import { ReportCreate } from '@/lib/validations/report'

export default function CreateReport() {
  const router = useRouter()

  const handleSubmit = async (formData: ReportCreate) => {
    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          date: formData.date?.toString() || '',
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
