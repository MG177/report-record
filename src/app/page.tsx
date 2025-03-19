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
