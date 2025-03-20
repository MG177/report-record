'use client'

import { useEffect, useState, useCallback } from 'react'
import debounce from 'lodash/debounce'
import HeaderDefault from '@components/header'
import { ReportDocument } from '@/models/Report'
import useFetch from '@hooks/useFetch'
import Loading from '@/components/Loading'
import ReportItem from '@/components/reportItem'
export default function Home() {
  const [reports, setReports] = useState<ReportDocument[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [sortField, setSortField] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('desc')

  const { data, loading, error } = useFetch<{
    reports: ReportDocument[]
    total: number
    totalPages: number
    currentPage: number
  }>(
    `/api/reports?sort=${sortField}&order=${sortOrder}&search=${debouncedSearchTerm}`
  )

  const debouncedSearch = useCallback(
    debounce((term: string) => {
      setDebouncedSearchTerm(term)
    }, 3000),
    []
  )

  useEffect(() => {
    debouncedSearch(searchTerm)
  }, [searchTerm, debouncedSearch])

  useEffect(() => {
    if (data) {
      setReports(data.reports)
    }
  }, [data])

  const handleSearch = (term: string) => {
    setSearchTerm(term)
  }

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('desc')
    }
  }

  const handleSortOrderChange = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
  }

  useEffect(() => {
    if (data) {
      setReports(data.reports)
    }
  }, [data])

  if (loading) {
    return <Loading />
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div>Error: {error}</div>
      </div>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-6 md:p-9 w-full max-w-7xl mx-auto font-['Calibri']">
      <HeaderDefault title="Reports" />
      <div className="w-full mb-6">
        <div className="bg-white p-4 rounded-2xl shadow-lg border border-blue-100 space-y-4">
          {/* <div className="relative">
          <input
            type="text"
            placeholder="Search reports..."
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-lg placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
          />
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
              clipRule="evenodd"
            />
          </svg>
        </div> */}

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <span>Sort by:</span>
              <select
                value={sortField}
                onChange={(e) => handleSort(e.target.value)}
                className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer"
              >
                <option value="createdAt">Date</option>
                <option value="location">Location</option>
              </select>
            </div>

            <button
              onClick={handleSortOrderChange}
              className="flex items-center gap-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <span className="text-sm">Order</span>
              {sortOrder === 'asc' ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col gap-4">
        {reports.map((report, index) => (
          <ReportItem key={index} report={report} />
        ))}
      </div>
    </main>
  )
}
