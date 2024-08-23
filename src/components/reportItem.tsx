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
            <div className="text-black text-sm sm:text-md md:text-lg font-light text-center justify-center">
              {reportDate.time} | {reportDate.date}
            </div>
          </span>
        </div>
      </div>
      <div className="mt-2">
        <span className="text-lg font-bold">Description: </span>
        {report.description} Fugiat exercitation amet ea aute officia eu fugiat
        ipsum non exercitation incididunt ipsum. Incididunt dolore adipisicing
        qui cillum in reprehenderit ea dolor. Amet ex qui proident est sit
        proident commodo in culpa duis culpa proident.
      </div>
    </div>
  )
}

export default ReportItem
