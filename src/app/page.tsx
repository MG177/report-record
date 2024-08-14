'use client'

import { HeaderReports } from '@/components/header'
import Search from '@/components/search'
import ReportItem from '@/components/reportItem'
import { useEffect, useState } from 'react'
import { IReport } from '@/models/Report'
import useFetch from '@/hooks/useFetch'

export default function Home() {
  const [reports, setReports] = useState<IReport[]>([])
  const { data , loading, error } = useFetch<IReport[]>('/api/reports')

  useEffect(() => {
    if (data) {
      setReports(data)
    }
  }, [data])

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 sm:p-6 md:p-9  w-full max-w-7xl mx-auto font-['Calibri']">
      <HeaderReports />
      {/* <Search searchTerm={'search...'} /> */}
      <div className="w-full mt-6 flex flex-col gap-4">
        {reports.map((report) => (
          <ReportItem key={report._id} report={report} />
        ))}
        {/* {[
          'Today',
          'Yesterday',
          'This week',
          'This month',
          'This year',
          'Older',
        ].map((period) => (
          <ReportItem key={period} period={period} />
        ))} */}
      </div>
    </main>
  )
}
