'use client'

import Search from '@/components/search'
import ReportItem from '@/components/reportItem'
import { IReport } from '@/models/Report'
import useFetch from '@/hooks/useFetch'
import { useEffect, useState, useCallback } from 'react'
import debounce from 'lodash/debounce'
import Button from '@/components/button'
import { exportObjectToXLS } from '@/utils/exportXLS'
import convertDate from '@/utils/convertDate'
import Modal from '@/components/modal'

export default function Home() {
  const [reports, setReports] = useState<IReport[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [sortField, setSortField] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('desc')
  const [isSearching, setIsSearching] = useState(false)
  const [isSorting, setIsSorting] = useState(false)

  const { data, loading, error } = useFetch<IReport[]>(
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
    if (data) {
      setReports(data)
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
      setReports(data)
      setIsSorting(false)
    }
  }, [data])

  const isLoading = loading || isSearching || isSorting

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-6 md:p-9  w-full max-w-7xl mx-auto font-['Calibri']">
      <HeaderReports />
      <Search
        searchTerm={searchTerm}
        onSearch={handleSearch}
        sortField={sortField}
        sortOrder={sortOrder}
        onSort={handleSort}
        onSortOrderChange={handleSortOrderChange}
      />
      {isLoading ? (
        <div className="w-full text-center py-4">Loading...</div>
      ) : (
        <div className="w-full flex flex-col gap-4">
          {reports.map((report) => (
            <ReportItem key={report._id} report={report} />
          ))}
        </div>
      )}
    </main>
  )
}

function HeaderReports() {
  return (
    <div className="w-full space-y-4 sm:space-y-6 py-4">
      <div className="flex flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-text text-3xl sm:text-5xl md:text-6xl font-bold ">
            Reports
          </h1>
        </div>
        <div className="flex flex-row gap-4">
          <ExportButton />
          <Button text="+ Add Report" link="/newReport" />
        </div>
      </div>
      <div className="h-1 bg-[#5e5e5e] rounded-full"></div>
    </div>
  )
}

function ExportButton() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [exportData, setExportData] = useState<IReport[]>([])

  const handleExport = () => {
    setIsModalOpen(true)
  }

  const fetchData = async (startDate: string, endDate: string) => {
    const response = await fetch(
      `/api/reports?startDate=${startDate}&endDate=${endDate}&sort=date&order=desc`
    )
    const data = await response.json()
    return data
  }

  const exportDataForRange = async (range: string) => {
    const endDate = new Date().toISOString().split('T')[0]
    let startDate: string

    switch (range) {
      case 'today':
        startDate = endDate
        break
      case 'week':
        startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0]
        break
      case 'month':
        startDate = new Date(new Date().setMonth(new Date().getMonth() - 1))
          .toISOString()
          .split('T')[0]
        break
      default:
        return
    }

    const data = await fetchData(startDate, endDate)
    const formattedData = data.map((item: IReport) => ({
      title: item.title,
      description: item.description,
      date: convertDate(item.date).date,
      time: convertDate(item.date).time,
    }))

    exportObjectToXLS(formattedData)
    setIsModalOpen(false)
  }

  return (
    <>
      <Button text="Export" onClick={handleExport} />
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="flex flex-col gap-2">
          <Button text="Today" onClick={() => exportDataForRange('today')} />
          <Button text="This Week" onClick={() => exportDataForRange('week')} />
          <Button
            text="This Month"
            onClick={() => exportDataForRange('month')}
          />
        </div>
        <button
          className="w-full text-end mt-6"
          onClick={() => setIsModalOpen(false)}
        >
          Cancel
        </button>
      </Modal>
    </>
  )
}
