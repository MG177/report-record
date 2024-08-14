import { IReport } from '@/models/Report'
import React from 'react'

interface ReportItemProps {
  report: IReport
}

const ReportItem: React.FC<ReportItemProps> = ({ report }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-black text-2xl sm:text-3xl md:text-4xl">{}</h2>
      <div className="h-1 bg-[#1e1e1e] rounded-full"></div>
      <div className="p-4 2 rounded-xl shadow border border-black/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
          <span className="text-black text-xl sm:text-2xl md:text-3xl">
            {report.title}
          </span>
        </div>
        <span className="text-black text-lg sm:text-xl md:text-2xl font-light">
          04-Agustus-2024 16:00
        </span>
      </div>
    </div>
  )
}

export default ReportItem
