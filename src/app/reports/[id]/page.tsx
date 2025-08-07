'use client'

import { useParams } from 'next/navigation'
import useFetch from '@hooks/useFetch'
import { IReport } from '@/models/Report'
import Loading from '@/app/components/Loading'
import Image from 'next/image'
import { toast } from 'react-hot-toast'
import Link from 'next/link'
import { formatDateTimeForDisplay } from '@utils/timezoneUtils'

export default function ReportDetail() {
  const params = useParams()
  const id = params.id
  const {
    data: report,
    loading,
    error,
  } = useFetch<IReport>(`/api/reports/${id}`)

  if (error) {
    toast.error('Failed to load report')
    return (
      <main className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6">
            <div className="text-red-500">Error loading report</div>
            <Link
              href="/"
              className="text-blue-600 hover:text-blue-700 mt-4 inline-block"
            >
              ← Back to Reports
            </Link>
          </div>
        </div>
      </main>
    )
  }

  if (loading || !report) {
    return (
      <main className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          <Loading />
        </div>
      </main>
    )
  }

  const reportDateTime = formatDateTimeForDisplay(report.date)

  return (
    <main className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
          {/* Header */}
          <div className="border-b border-blue-100">
            <div className="p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <Link
                    href="javascript:history.back()"
                    className="text-blue-600 hover:text-blue-700 mb-4 inline-block"
                  >
                    ← Back to Reports
                  </Link>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Report Details
                  </h1>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-gray-900">
                    {report.location}
                  </div>
                  <div className="text-sm text-gray-500">
                    {reportDateTime.date} at {reportDateTime.time}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-8">
            {/* Images */}
            {report.images && report.images.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900">Images</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {report.images.map((image, index) => (
                    <div
                      key={index}
                      className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <Image
                        src={image}
                        alt={`Report image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Problem */}
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-gray-900">Problem</h2>
                <div className="bg-gray-50 rounded-xl p-4 text-gray-700">
                  {report.problem || 'No problem description provided'}
                </div>
              </div>

              {/* Solution */}
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-gray-900">
                  Solution
                </h2>
                <div className="bg-gray-50 rounded-xl p-4 text-gray-700">
                  {report.solve || 'No solution provided'}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-gray-900">
                Description
              </h2>
              <div className="bg-gray-50 rounded-xl p-4 text-gray-700">
                {report.description || 'No additional description provided'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
