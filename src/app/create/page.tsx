'use client'

import { useRouter } from 'next/navigation'
import { HeaderNewReports } from '../../components/header'
import ReportForm from '../../components/ReportForm'
import { ReportFormData } from '../../models/Report'

export default function CreateReport() {
  const router = useRouter()

  const handleSubmit = async (formData: ReportFormData) => {
    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          date: formData.date?.toISOString() || '',
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
