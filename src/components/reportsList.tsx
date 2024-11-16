'use client'

import { memo } from 'react'
import ReportItem from './reportItem'
import { IReport } from '@/models/Report'

interface ReportsListProps {
  reports: IReport[]
}

const ReportsList = memo(function ReportsList({ reports }: ReportsListProps) {
  return (
    <div className="w-full flex flex-col gap-4">
      {reports.map((report) => (
        <ReportItem key={report._id} report={report} />
      ))}
    </div>
  )
})

export default ReportsList
