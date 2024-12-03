import { IReport } from '@/models/Report'
import convertDate from '@/utils/convertDate'
import React, { useState } from 'react'
import Button from './button'
import Modal from './modal'
import Image from 'next/image'

interface ReportItemProps {
  report: IReport
}

const ReportItem: React.FC<ReportItemProps> = ({ report }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const reportDate = convertDate(report.date)

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/reports/${report._id}`, {
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

  const handleEdit = () => {
    window.location.href = `/edit/${report._id}`
  }

  const openDeleteModal = () => setIsModalOpen(true)

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index)
    setIsImageModalOpen(true)
  }

  const nextImage = () => {
    setSelectedImageIndex((prev) => 
      prev === report.images.length - 1 ? 0 : prev + 1
    )
  }

  const previousImage = () => {
    setSelectedImageIndex((prev) => 
      prev === 0 ? report.images.length - 1 : prev - 1
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden transition-all duration-200 hover:shadow-xl">
      <div className="p-6">
        <div className="flex flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            {report.images?.length > 0 ? (
              <div 
                className="w-14 h-14 rounded-xl overflow-hidden cursor-pointer shadow-md hover:shadow-lg transition-shadow"
                onClick={() => handleImageClick(0)}
              >
                <Image
                  src={report.images[0]}
                  alt={report.location}
                  width={56}
                  height={56}
                  className="object-cover w-full h-full"
                />
              </div>
            ) : (
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold">
                {report.location[0]}
              </div>
            )}
            <div className="flex flex-col">
              <span className="text-gray-900 text-xl font-semibold">
                {report.location}
              </span>
              <span className="text-gray-500 text-sm">
                {reportDate.time} | {reportDate.date}
              </span>
            </div>
          </div>
          <div className="flex gap-2 self-end sm:self-auto">
            <Button
              text=""
              onClick={handleEdit}
              variant="secondary"
              icon="pi-pencil"
            />
            <Button
              text=""
              onClick={openDeleteModal}
              variant="danger"
              icon="pi-trash"
            />
          </div>
        </div>

        {report.images?.length > 0 && (
          <div className="mt-6 grid grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-3">
            {report.images.map((image, index) => (
              <div
                key={index}
                className="relative aspect-square cursor-pointer rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                onClick={() => handleImageClick(index)}
              >
                <Image
                  src={image}
                  alt={`${report.location} ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 space-y-4">
          <div>
            <h3 className="text-gray-900 font-semibold mb-2">Problem</h3>
            <p className="text-gray-600 line-clamp-3">{report.problem}</p>
          </div>
          <div>
            <h3 className="text-gray-900 font-semibold mb-2">Solution</h3>
            <p className="text-gray-600 line-clamp-3">{report.solve}</p>
          </div>
          <div>
            <h3 className="text-gray-900 font-semibold mb-2">Description</h3>
            <p className="text-gray-600 line-clamp-3">{report.description}</p>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        header="Confirm Delete"
      >
        <div className="p-6">
          <p className="text-gray-600 mb-6">Are you sure you want to delete this report?</p>
          <div className="flex justify-end gap-3">
            <Button
              text="Cancel"
              onClick={() => setIsModalOpen(false)}
              variant="secondary"
            />
            <Button
              text="Delete"
              onClick={handleDelete}
              variant="danger"
            />
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        header="Report Images"
      >
        <div className="relative w-full">
          <div className="relative w-full h-[60vh]">
            <Image
              src={report.images?.[selectedImageIndex] || ''}
              alt={`${report.location} ${selectedImageIndex + 1}`}
              fill
              className="object-contain"
            />
          </div>
          {report.images && report.images.length > 1 && (
            <>
              <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-4">
                <button
                  onClick={previousImage}
                  className="bg-black/50 text-white rounded-full p-3 hover:bg-black/70 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={nextImage}
                  className="bg-black/50 text-white rounded-full p-3 hover:bg-black/70 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              <div className="text-center mt-4 text-gray-600">
                {selectedImageIndex + 1} / {report.images.length}
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  )
}

export default ReportItem
