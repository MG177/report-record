'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ReportDocument } from '@/models/Report'
import useFetch from '@hooks/useFetch'
import Loading from '@/app/components/Loading'
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  ArrowLeft,
  Clock,
  MapPin,
  Plus,
  Filter,
} from 'lucide-react'
import Link from 'next/link'
import { formatDateTimeForDisplay } from '@utils/dateUtils'

export default function CalendarView() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Get initial date from URL params or use current date
  const getInitialDate = () => {
    const yearParam = searchParams.get('year')
    const monthParam = searchParams.get('month')
    const dayParam = searchParams.get('day')

    if (yearParam && monthParam) {
      const year = parseInt(yearParam)
      const month = parseInt(monthParam) - 1 // Month is 0-indexed
      const day = dayParam ? parseInt(dayParam) : 1
      return new Date(year, month, day)
    }
    return new Date()
  }

  const [currentDate, setCurrentDate] = useState(getInitialDate)
  const [selectedDate, setSelectedDate] = useState<Date | null>(() => {
    const dayParam = searchParams.get('day')
    if (dayParam) {
      const year = parseInt(
        searchParams.get('year') || new Date().getFullYear().toString()
      )
      const month =
        parseInt(
          searchParams.get('month') || (new Date().getMonth() + 1).toString()
        ) - 1
      const day = parseInt(dayParam)
      return new Date(year, month, day)
    }
    return null
  })
  const [reports, setReports] = useState<ReportDocument[]>([])
  const [loading, setLoading] = useState(true)

  // Update URL when currentDate or selectedDate changes
  const updateURL = useCallback(
    (newCurrentDate: Date, newSelectedDate: Date | null) => {
      const params = new URLSearchParams()
      params.set('year', newCurrentDate.getFullYear().toString())
      params.set('month', (newCurrentDate.getMonth() + 1).toString())

      if (newSelectedDate) {
        params.set('day', newSelectedDate.getDate().toString())
      }

      const newURL = `${window.location.pathname}?${params.toString()}`
      window.history.replaceState({}, '', newURL)
    },
    []
  )

  // Update URL when dates change
  useEffect(() => {
    updateURL(currentDate, selectedDate)
  }, [currentDate, selectedDate, updateURL])

  // Get current month's start and end dates
  const startOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  )
  const endOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  )

  // Fetch reports for the current month
  const {
    data,
    loading: fetchLoading,
    error,
  } = useFetch<{
    reports: ReportDocument[]
    total: number
    totalPages: number
    currentPage: number
  }>(
    `/api/reports?startDate=${startOfMonth.toISOString()}&endDate=${endOfMonth.toISOString()}&limit=100`
  )

  useEffect(() => {
    if (data) {
      setReports(data.reports)
      setLoading(false)
    }
  }, [data])

  // Generate calendar days
  const generateCalendarDays = (): Date[] => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())

    const days: Date[] = []
    const currentDay = new Date(startDate)

    while (currentDay <= lastDay || currentDay.getDay() !== 0) {
      days.push(new Date(currentDay))
      currentDay.setDate(currentDay.getDate() + 1)
    }

    return days
  }

  // Get reports for a specific date
  const getReportsForDate = (date: Date) => {
    return reports.filter((report) => {
      const reportDate = new Date(report.date)
      return (
        reportDate.getDate() === date.getDate() &&
        reportDate.getMonth() === date.getMonth() &&
        reportDate.getFullYear() === date.getFullYear()
      )
    })
  }

  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    )
  }

  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    )
  }

  // Navigate to today
  const goToToday = () => {
    const today = new Date()
    setCurrentDate(today)
    setSelectedDate(null)
  }

  // Handle date selection
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
  }

  const calendarDays = generateCalendarDays()
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]

  if (loading || fetchLoading) {
    return <Loading />
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="text-center">
          <div className="text-red-500 text-lg font-medium mb-2">Error</div>
          <div className="text-gray-600">{error}</div>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen">
      {/* Header */}
      <div className="w-full mb-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors p-2 rounded-lg hover:bg-blue-50"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="font-medium hidden sm:inline">Back</span>
              </Link>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Calendar View
            </h1>
            <Link
              href="/create"
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">New Report</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Calendar Navigation */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center justify-between sm:justify-start gap-4">
            <button
              onClick={goToPreviousMonth}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <h2 className="text-lg sm:text-2xl font-semibold text-gray-900">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <button
              onClick={goToNextMonth}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={goToToday}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
            >
              Today
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Day headers */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div
              key={day}
              className="p-2 text-center text-sm font-medium text-gray-500"
            >
              {day}
            </div>
          ))}

          {/* Calendar days */}
          {calendarDays.map((day, index) => {
            const isCurrentMonth = day.getMonth() === currentDate.getMonth()
            const isToday = day.toDateString() === new Date().toDateString()
            const isSelected =
              selectedDate && day.toDateString() === selectedDate.toDateString()
            const dayReports = getReportsForDate(day)

            return (
              <div
                key={index}
                onClick={() => handleDateSelect(day)}
                className={`
                  min-h-[100px] sm:min-h-[120px] p-2 border border-gray-100 rounded-lg cursor-pointer transition-all
                  ${isCurrentMonth ? 'bg-white' : 'bg-gray-50'}
                  ${isToday ? 'ring-2 ring-blue-500 shadow-md' : ''}
                  ${
                    isSelected
                      ? 'ring-2 ring-blue-600 bg-blue-50 shadow-md'
                      : ''
                  }
                  hover:bg-gray-50 hover:shadow-sm
                `}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`
                    text-sm font-medium
                    ${isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}
                    ${isToday ? 'text-blue-600 font-semibold' : ''}
                  `}
                  >
                    {day.getDate()}
                  </span>
                  {dayReports.length > 0 && (
                    <span className="text-xs bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full font-medium">
                      {dayReports.length}
                    </span>
                  )}
                </div>

                {/* Show first report preview */}
                {dayReports.length > 0 && (
                  <div className="space-y-1">
                    {dayReports.slice(0, 2).map((report, reportIndex) => (
                      <div
                        key={reportIndex}
                        className="text-xs text-gray-600 truncate hover:text-gray-900 bg-gray-50 px-1 py-0.5 rounded"
                        title={report.location}
                      >
                        {report.location}
                      </div>
                    ))}
                    {dayReports.length > 2 && (
                      <div className="text-xs text-gray-400 text-center">
                        +{dayReports.length - 2} more
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Selected Date Reports */}
      {selectedDate && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
              Reports for{' '}
              {selectedDate.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </h3>
            <button
              onClick={() => setSelectedDate(null)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {getReportsForDate(selectedDate).length === 0 ? (
            <div className="text-center py-8">
              <CalendarIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No reports for this date</p>
              <Link
                href="/create"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
              >
                <Plus className="h-4 w-4" />
                Create Report
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {getReportsForDate(selectedDate).map((report, index) => {
                const reportDateTime = formatDateTimeForDisplay(
                  report.date.toString()
                )
                return (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors cursor-pointer border border-gray-200"
                    onClick={() => router.push(`/reports/${report._id}`)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 truncate">
                          {report.location}
                        </h4>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{reportDateTime.time}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{reportDateTime.date}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                          {report.problem}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Bottom Spacing for Mobile */}
      <div className="h-20 sm:hidden" />
    </main>
  )
}
