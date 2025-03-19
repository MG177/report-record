'use client'

import { memo } from 'react'
import ReportItem from './reportItem'
import { ReportDocument } from '@/models/Report'

interface ReportsListProps {
  reports: ReportDocument[]
}

const ReportsList = memo(function ReportsList({ reports }: ReportsListProps) {
  return (
    <div className="w-full flex flex-col gap-4">
      {reports.map((report, index) => (
        <ReportItem key={index} report={report} />
      ))}
    </div>
  )
})

export default ReportsList
