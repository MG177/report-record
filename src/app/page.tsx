'use client'

import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import Loading from '@/components/loading'
import ReportItem from '@/components/reportItem'
import { ReportDocument } from '@/models/Report'
import useFetch from '@/hooks/useFetch'
import { useEffect, useState, useCallback } from 'react'
import debounce from 'lodash/debounce'
import Button from '@/components/button'
import { exportObjectToXLS } from '@/utils/exportXLS'
import convertDate from '@/utils/convertDate'
import Modal from '@/components/modal'
import HeaderDefault from '@/components/header'

// Dynamically import components that are not immediately needed
const Search = dynamic(() => import('@/components/search'), {
  loading: () => <Loading />,
})

const ReportsList = dynamic(() => import('@/components/reportsList'), {
  loading: () => <Loading />,
})

export default function Home() {
  const [reports, setReports] = useState<ReportDocument[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [sortField, setSortField] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('desc')
  const [isSearching, setIsSearching] = useState(false)
  const [isSorting, setIsSorting] = useState(false)

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
      setIsSearching(false)
    }, 3000),
    []
  )

  useEffect(() => {
    setIsSearching(true)
    debouncedSearch(searchTerm)
  }, [searchTerm, debouncedSearch])

  useEffect(() => {
    console.log(data)

    if (data) {
      setReports(data.reports)
    }
  }, [data])

  const handleSearch = (term: string) => {
    setSearchTerm(term)
  }

  const handleSort = (field: string) => {
    setIsSorting(true)
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('desc')
    }
  }

  const handleSortOrderChange = () => {
    setIsSorting(true)
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
  }

  useEffect(() => {
    if (data) {
      setReports(data.reports)
      setIsSorting(false)
    }
  }, [data])

  const isLoading = loading || isSearching || isSorting

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-6 md:p-9 w-full max-w-7xl mx-auto font-['Calibri']">
      <HeaderDefault title="Reports" />
      <Suspense fallback={<Loading />}>
        <Search
          searchTerm={searchTerm}
          onSearch={handleSearch}
          sortField={sortField}
          sortOrder={sortOrder}
          onSort={handleSort}
          onSortOrderChange={handleSortOrderChange}
        />
      </Suspense>
      {isLoading ? (
        <Loading />
      ) : (
        <Suspense fallback={<Loading />}>
          <ReportsList reports={reports} />
        </Suspense>
      )}
    </main>
  )
}

function ExportButton() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const handleExport = () => setIsModalOpen(true)

  const fetchData = async (startDate, endDate) => {
    const response = await fetch(
      `/api/reports?startDate=${startDate}&endDate=${endDate}&sort=date&order=desc`
    )
    return response.json()
  }

  const exportDataForRange = async () => {
    const data = await fetchData(startDate, endDate)
    const formattedData = data.map(({ date, location, problem }) => ({
      date: convertDate(date).date,
      location,
      problem,
    }))

    exportObjectToXLS(formattedData)
    setIsModalOpen(false)
  }

  const setDateRange = (rangeType) => {
    const today = new Date()
    let start, end

    switch (rangeType) {
      case 'today':
        start = end = today.toISOString().split('T')[0]
        break
      case 'week':
        const lastWeek = new Date(today.setDate(today.getDate() - 7))
        start = lastWeek.toISOString().split('T')[0]
        end = new Date().toISOString().split('T')[0]
        break
      case 'month':
        const lastMonth = new Date(today.setMonth(today.getMonth() - 1))
        start = lastMonth.toISOString().split('T')[0]
        end = new Date().toISOString().split('T')[0]
        break
      case 'year':
        const lastYear = new Date(today.setFullYear(today.getFullYear() - 1))
        start = lastYear.toISOString().split('T')[0]
        end = new Date().toISOString().split('T')[0]
        break
      default:
        return
    }

    setStartDate(start)
    setEndDate(end)
  }

  useEffect(() => {
    console.log(startDate, endDate)
  }, [startDate, endDate])

  return (
    <>
      <Button text="Export" onClick={handleExport} />
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        header="Export Reports"
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4">
            <DateInput
              label="Start Date"
              id="start-date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <DateInput
              label="End Date"
              id="end-date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Button
              className="bg-slate-50 text-text text-center border border-text text-md px-1 py-1"
              text="Today"
              onClick={() => setDateRange('today')}
            />
            <Button
              className="bg-slate-50 text-text text-center border border-text text-md px-1 py-1"
              text="This Week"
              onClick={() => setDateRange('week')}
            />
            <Button
              className="bg-slate-50 text-text text-center border border-text text-md px-1 py-1"
              text="This Month"
              onClick={() => setDateRange('month')}
            />
            <Button
              className="bg-slate-50 text-text text-center border border-text text-md px-1 py-1"
              text="This Year"
              onClick={() => setDateRange('year')}
            />
          </div>
          <div className="flex flex-row justify-end gap-4 mt-2">
            <button className="text-end" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <Button
              text="Export"
              onClick={exportDataForRange}
              disabled={!startDate || !endDate}
              className="w-fit truncate "
            />
          </div>
        </div>
      </Modal>
    </>
  )
}

function DateInput({ label, id, value, onChange }) {
  return (
    <div className="flex flex-col">
      <label htmlFor={id} className="mb-1 text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        type="date"
        id={id}
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      />
    </div>
  )
}
