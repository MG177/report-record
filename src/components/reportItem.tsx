import { IReport } from '@/models/Report'
import convertDate from '@/utils/convertDate'
import React from 'react'

interface ReportItemProps {
  report: IReport
}

const ReportItem: React.FC<ReportItemProps> = ({ report }) => {
  const reportDate = convertDate(report.date)

  return (
    <div className="flex flex-col p-4 rounded-xl shadow border border-black/20">
      <div className="flex flex-row justify-between items-end sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
          <span className="text-black text-xl sm:text-2xl md:text-3xl">
            {report.title}
            <div className="text-black text-sm sm:text-md md:text-lg font-light text-start justify-center">
              {reportDate.time} | {reportDate.date}
            </div>
          </span>
        </div>
      </div>
      <p className="mt-2 line-clamp-3">
        <span className="text-lg font-bold">Problem: </span>
        {report.problem}
      </p>
      <p className="mt-2 line-clamp-3">
        <span className="text-lg font-bold">Solve: </span>
        {report.solve}
      </p>
      <p className="mt-2 line-clamp-3">
        <span className="text-lg font-bold">Description: </span>
        {report.description}
      </p>
    </div>
  )
}

export default ReportItem
