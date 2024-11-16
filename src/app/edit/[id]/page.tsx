'use client'

import { useParams, useRouter } from 'next/navigation'
import { Suspense } from 'react'
import { HeaderEditReports } from '@/components/header'
import useFetch from '@/hooks/useFetch'
import { IReport, ReportFormData } from '@/models/Report'
import Loading from '@/components/loading'
import ReportForm from '@/components/ReportForm'
import { toast } from 'react-hot-toast'

export default function EditReport() {
  const params = useParams()
  const router = useRouter()
  const id = params.id
  const { data: report, loading, error } = useFetch<IReport>(`/api/reports/${id}`)

  const handleUpdate = async (formData: ReportFormData) => {
    try {
      const response = await fetch(`/api/reports/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          date: formData.date?.toISOString() || '',
        }),
      })

      if (response.ok) {
        toast.success('Report updated successfully')
        router.push('/')
        router.refresh()
      } else {
        throw new Error('Failed to update report')
      }
    } catch (error) {
      console.error('Error updating report:', error)
      toast.error('Failed to update report')
    }
  }

  if (error) {
    toast.error('Failed to load report')
    return (
      <main className="flex min-h-screen flex-col items-center w-full mx-auto">
        <HeaderEditReports />
        <div className="text-red-500">Error loading report</div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center w-full mx-auto">
      <HeaderEditReports />
      {loading ? (
        <Loading />
      ) : report ? (
        <ReportForm 
          onSubmit={handleUpdate}
          initialData={{
            title: '',
            date: new Date(report.date),
            description: report.description,
            location: report.location,
            problem: report.problem as string,
            solve: report.solve as string,
            images: report.images || [],
          }}
        />
      ) : (
        <div>Report not found</div>
      )}
    </main>
  )
}
