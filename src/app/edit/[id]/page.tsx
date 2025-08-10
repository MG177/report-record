'use client'

import { useParams, useRouter } from 'next/navigation'
import { HeaderEditReports } from '@/app/components/header'
import useFetch from '@hooks/useFetch'
import { IReport } from '@/models/Report'
import Loading from '@/app/components/Loading'
import ReportForm from '@/app/components/reportForm'
import { toast } from 'react-hot-toast'
import { ReportCreate } from '@lib/validations/report'
import {
  convertUTCToTimeZone,
  getUserTimeZone,
  toISOStringWithTimeZone,
} from '@utils/dateUtils'

export default function EditReport() {
  const params = useParams()
  const router = useRouter()
  const id = params.id
  const {
    data: report,
    loading,
    error,
  } = useFetch<IReport>(`/api/reports/${id}`)

  const handleUpdate = async (formData: ReportCreate) => {
    try {
      const response = await fetch(`/api/reports/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          date:
            formData.date instanceof Date
              ? toISOStringWithTimeZone(formData.date, getUserTimeZone())
              : formData.date,
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
            date: convertUTCToTimeZone(report.date, getUserTimeZone()),
            description: report.description,
            location: report.location,
            problem: report.problem as string,
            solve: report.solve as string,
            images: report.images ?? [],
            status: report.status,
            priority: report.priority,
          }}
        />
      ) : (
        <div>Report not found</div>
      )}
    </main>
  )
}
