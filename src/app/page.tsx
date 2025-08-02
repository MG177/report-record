'use client'

import { useEffect, useState, useCallback } from 'react'
import debounce from 'lodash/debounce'
import HeaderDefault from '@/app/components/header'
import { ReportDocument } from '@/models/Report'
import useFetch from '@hooks/useFetch'
import Loading from '@/app/components/Loading'
import ReportItem from '@/app/components/reportItem'
import FloatingActionButton from '@/app/components/FloatingActionButton'
import { Search, Filter, SortAsc, SortDesc } from 'lucide-react'

export default function Home() {
  const [reports, setReports] = useState<ReportDocument[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [sortField, setSortField] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('desc')
  const [showFilters, setShowFilters] = useState(false)

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
    }, 500),
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

  if (loading) {
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
      <HeaderDefault title="Reports" />

      {/* Floating Search Bar */}
      <div className="sticky top-4 z-10 mb-6">
        <div className="relative">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-12 pr-20 py-4 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-500"
            />
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Filter className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="mb-6 animate-in slide-in-from-top-2 duration-300">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort by
                </label>
                <select
                  value={sortField}
                  onChange={(e) => handleSort(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer"
                >
                  <option value="createdAt">Date Created</option>
                  <option value="location">Location</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={handleSortOrderChange}
                  className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <span className="text-sm font-medium">Order</span>
                  {sortOrder === 'asc' ? (
                    <SortAsc className="h-4 w-4" />
                  ) : (
                    <SortDesc className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reports Grid */}
      <div className="space-y-4">
        {reports.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📋</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No reports found
            </h3>
            <p className="text-gray-500">
              {searchTerm
                ? 'Try adjusting your search terms'
                : 'Create your first report to get started'}
            </p>
          </div>
        ) : (
          reports.map((report, index) => (
            <ReportItem key={index} report={report} />
          ))
        )}
      </div>

      {/* Floating Action Button */}
      <FloatingActionButton />

      {/* Bottom Spacing for Mobile */}
      <div className="h-20 sm:hidden" />
    </main>
  )
}
