import { IReport, ReportDocument } from '@/models/Report'
import { formatDateTimeForDisplay } from '@utils/dateUtils'
import React, { useState } from 'react'
import Button from './button'
import Modal from './modal'
import Image from 'next/image'
import {
  Edit,
  Trash2,
  Calendar,
  MapPin,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react'

interface ReportItemProps {
  report: ReportDocument
}

const ReportItem: React.FC<ReportItemProps> = ({ report }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const reportDateTime = formatDateTimeForDisplay(report.date)

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
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-xl">
      {/* Header */}
      <div className="p-4 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {report.images?.length > 0 ? (
              <div
                className="w-12 h-12 rounded-xl overflow-hidden cursor-pointer shadow-md hover:shadow-lg transition-shadow flex-shrink-0"
                onClick={() => handleImageClick(0)}
              >
                <Image
                  src={report.images[0]}
                  alt={report.location}
                  width={48}
                  height={48}
                  className="object-cover w-full h-full"
                />
              </div>
            ) : (
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                {report.location[0]}
              </div>
            )}
            <div className="flex flex-col min-w-0 flex-1">
              <h3 className="text-gray-900 text-lg sm:text-xl font-semibold truncate">
                {report.location}
              </h3>
              <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{reportDateTime.date}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{reportDateTime.time}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={handleEdit}
              className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
              aria-label="Edit report"
            >
              <Edit className="h-5 w-5" />
            </button>
            <button
              onClick={openDeleteModal}
              className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              aria-label="Delete report"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Image Gallery */}
        {report.images?.length > 0 && (
          <div className="mt-4 sm:mt-6">
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3">
              {report.images.slice(0, 6).map((image, index) => (
                <div
                  key={index}
                  className="relative aspect-square cursor-pointer rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow group"
                  onClick={() => handleImageClick(index)}
                >
                  <Image
                    src={image}
                    alt={`${report.location} ${index + 1}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  {index === 5 && report.images.length > 6 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        +{report.images.length - 6}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="mt-4 sm:mt-6 space-y-4">
          <div>
            <h4 className="text-gray-900 font-semibold mb-2 text-sm sm:text-base">
              Problem
            </h4>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed line-clamp-3">
              {report.problem}
            </p>
          </div>
          <div>
            <h4 className="text-gray-900 font-semibold mb-2 text-sm sm:text-base">
              Solution
            </h4>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed line-clamp-3">
              {report.solve}
            </p>
          </div>
          <div>
            <h4 className="text-gray-900 font-semibold mb-2 text-sm sm:text-base">
              Description
            </h4>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed line-clamp-3">
              {report.description}
            </p>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        header="Confirm Delete"
      >
        <div className="p-6">
          <p className="text-gray-600 mb-6 text-center">
            Are you sure you want to delete this report? This action cannot be
            undone.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <Button
              text="Cancel"
              onClick={() => setIsModalOpen(false)}
              variant="secondary"
              className="flex-1 sm:flex-none"
            />
            <Button
              text="Delete"
              onClick={handleDelete}
              variant="danger"
              className="flex-1 sm:flex-none"
            />
          </div>
        </div>
      </Modal>

      {/* Image Modal */}
      <Modal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        header=""
      >
        <div className="relative w-full">
          <button
            onClick={() => setIsImageModalOpen(false)}
            className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="relative w-full h-[60vh] sm:h-[70vh]">
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
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="bg-black/50 text-white rounded-full p-3 hover:bg-black/70 transition-colors"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </div>
              <div className="text-center mt-4 text-gray-600 font-medium">
                {selectedImageIndex + 1} of {report.images.length}
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  )
}

export default ReportItem
