import { IReport } from '@/models/Report'
import convertDate from '@/utils/convertDate'
import React, { useState } from 'react'
import Button from './button'
import Modal from './modal'

interface ReportItemProps {
  report: IReport
}

const ReportItem: React.FC<ReportItemProps> = ({ report }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const reportDate = convertDate(report.date)

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/reports/`, {
        body: JSON.stringify({ id: report._id }),
        method: 'DELETE',
      })
      if (response.ok) {
        window.location.reload()
      } else {
        console.error('Failed to delete report')
      }
    } catch (error) {
      console.error('Error deleting report:', error)
    }
  }

  const openDeleteModal = () => setIsModalOpen(true)

  return (
    <div className="flex flex-col p-4 rounded-xl shadow border border-black/20 relative">
      <div className="flex flex-row justify-between items-end sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
          <span className="text-black text-xl sm:text-2xl md:text-3xl">
            {report.location}
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
      <button
        className="w-20 h-8 px-0 py-0 text-center text-white rounded-lg justify-center bg-red-400 absolute right-5"
        onClick={openDeleteModal}
      >
        Delete
      </button>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        header="Confirm Delete"
      >
        <p>Are you sure want to delete this report?</p>
        <div className="flex flex-row justify-end gap-4 mt-2">
          <button className="text-end" onClick={() => setIsModalOpen(false)}>
            Cancel
          </button>
          <button
            className="w-fit truncate bg-red-400 px-2 text-white rounded-md"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  )
}

export default ReportItem
