'use client'

import { useState, useEffect } from 'react'
import { ReportCreate } from '@lib/validations/report'
import {
  compressImage,
  formatFileSize,
  CompressionResult,
} from '@utils/imageCompression'
import { createLocalDateTime } from '@utils/dateLocalization'
import {
  formatDateForInput,
  formatTimeForInput,
  getCurrentDate,
} from '@utils/dateUtils'
import Image from 'next/image'
import { toast } from 'react-hot-toast'

interface ImagePreview extends CompressionResult {
  id: string
}

interface ReportFormProps {
  onSubmit: (data: ReportCreate) => Promise<void>
  initialData?: ReportCreate
}

export default function ReportForm({ onSubmit, initialData }: ReportFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [imagePreviews, setImagePreviews] = useState<ImagePreview[]>([])
  const [formData, setFormData] = useState<ReportCreate>({
    location: '',
    problem: '',
    solve: '',
    images: [],
    date: getCurrentDate(),
    description: '',
    status: 'pending',
    priority: 'medium',
  })

  // Initialize form with initial data if provided
  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
      // Create image previews from existing images
      const previews: ImagePreview[] =
        initialData.images?.map((base64) => ({
          id: crypto.randomUUID(),
          base64,
          originalSize: base64.length,
          compressedSize: base64.length,
          width: 0, // We don't have this info for existing images
          height: 0,
          quality: 1,
        })) ?? []
      setImagePreviews(previews)
    }
  }, [initialData])

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      setIsProcessing(true)
      try {
        const newPreviews: ImagePreview[] = []
        const newImages: string[] = []

        for (let i = 0; i < files.length; i++) {
          const file = files[i]
          try {
            const result = await compressImage(file)
            newPreviews.push({
              ...result,
              id: crypto.randomUUID(),
            })
            newImages.push(result.base64)

            // Show compression stats
            const reduction = (
              ((result.originalSize - result.compressedSize) /
                result.originalSize) *
              100
            ).toFixed(1)
            toast.success(`Compressed image ${i + 1}: ${reduction}% reduction`)
          } catch (error) {
            toast.error(
              `Failed to process image ${file.name}: ${
                (error as Error).message
              }`
            )
          }
        }

        // Use functional form to ensure you're getting the latest state values
        setImagePreviews((prev) => [...prev, ...newPreviews])
        setFormData((prev) => ({
          ...prev,
          images: [...(prev.images || []), ...newImages],
        }))
      } catch (error) {
        toast.error('Error processing images')
      } finally {
        setIsProcessing(false)
        // Reset input
        e.target.value = ''
      }
    }
  }

  const removeImage = (id: string, index: number) => {
    const newPreviews = imagePreviews.filter((preview) => preview.id !== id)
    const newImages = formData.images?.filter((_, i) => i !== index)
    setImagePreviews(newPreviews)
    setFormData({ ...formData, images: newImages })
    toast.success('Image removed')
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isProcessing) {
      toast.error('Please wait for images to finish processing')
      return
    }
    setIsSubmitting(true)
    try {
      await onSubmit(formData)
      toast.success('Report submitted successfully')
    } catch (error) {
      toast.error('Failed to submit report')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6 pb-32">
      <div className="flex flex-col gap-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
          Images
        </h2>
        <div className="bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl border border-gray-200 shadow-lg">
          {imagePreviews.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
                {imagePreviews.map((preview, index) => (
                  <div
                    key={preview.id}
                    className="group relative bg-gray-50 rounded-xl p-2 border border-gray-100"
                  >
                    <div className="relative aspect-square rounded-lg overflow-hidden">
                      <Image
                        src={preview.base64}
                        alt={`Preview ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="mt-2 text-xs text-gray-500 space-y-0.5">
                      <div>Size: {formatFileSize(preview.compressedSize)}</div>
                      <div>
                        Original: {formatFileSize(preview.originalSize)}
                      </div>
                      <div>
                        Reduction:{' '}
                        {(
                          ((preview.originalSize - preview.compressedSize) /
                            preview.originalSize) *
                          100
                        ).toFixed(1)}
                        %
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(preview.id, index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
              <label
                className={`flex justify-center w-full px-4 py-4 transition bg-gray-50 border-2 border-gray-200 border-dashed rounded-xl appearance-none cursor-pointer hover:border-blue-400 focus:outline-none ${
                  isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <div className="flex items-center space-x-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <span className="font-medium text-gray-600">
                    {isProcessing ? 'Processing...' : 'Add more images'}
                  </span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  multiple
                  className="hidden"
                  disabled={isProcessing}
                />
              </label>
            </>
          ) : (
            <label
              className={`flex flex-col justify-center items-center w-full h-48 sm:h-64 px-4 transition bg-gray-50 border-2 border-gray-200 border-dashed rounded-xl appearance-none cursor-pointer hover:border-blue-400 focus:outline-none ${
                isProcessing ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <div className="flex flex-col items-center space-y-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-12 h-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <div className="flex flex-col items-center">
                  <span className="font-medium text-gray-600">
                    {isProcessing ? 'Processing...' : 'Drop files to upload'}
                  </span>
                  <span className="text-sm text-gray-500">
                    or click to select
                  </span>
                </div>
                <span className="text-xs text-gray-500 mt-1">
                  Maximum file size: 5MB
                </span>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                multiple
                className="hidden"
                disabled={isProcessing}
              />
            </label>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
          Location
        </h2>
        <input
          type="text"
          className="w-full h-12 py-3 px-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/80 backdrop-blur-sm"
          value={formData.location}
          onChange={(e) =>
            setFormData({ ...formData, location: e.target.value })
          }
          placeholder="Enter location"
          required
        />
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
          Date & Time
        </h2>
        <div className="flex gap-3">
          <input
            type="date"
            className="flex-1 h-12 py-3 px-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/80 backdrop-blur-sm"
            value={
              formData.date instanceof Date && !isNaN(formData.date.getTime())
                ? formatDateForInput(formData.date)
                : ''
            }
            onChange={(e) => {
              const dateValue =
                formData.date instanceof Date
                  ? formData.date.toISOString().split('T')[0]
                  : new Date().toISOString().split('T')[0]
              const newDate = createLocalDateTime(dateValue, e.target.value)
              setFormData({
                ...formData,
                date: newDate,
              })
            }}
            required
          />
          <input
            type="time"
            className="flex-1 h-12 py-3 px-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/80 backdrop-blur-sm"
            value={
              formData.date instanceof Date && !isNaN(formData.date.getTime())
                ? formatTimeForInput(formData.date)
                : ''
            }
            onChange={(e) => {
              const timeValue =
                formData.date instanceof Date
                  ? formData.date.toTimeString().slice(0, 5)
                  : new Date().toTimeString().slice(0, 5)
              const newDate = createLocalDateTime(e.target.value, timeValue)
              setFormData({
                ...formData,
                date: newDate,
              })
            }}
            required
          />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
          Problem
        </h2>
        <textarea
          className="w-full h-32 sm:h-40 py-3 px-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none bg-white/80 backdrop-blur-sm"
          value={formData.problem}
          onChange={(e) =>
            setFormData({
              ...formData,
              problem: e.target.value,
            })
          }
          placeholder="Describe the problem..."
          required
        />
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
          Solution
        </h2>
        <textarea
          className="w-full h-32 sm:h-40 py-3 px-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none bg-white/80 backdrop-blur-sm"
          value={formData.solve}
          onChange={(e) =>
            setFormData({
              ...formData,
              solve: e.target.value,
            })
          }
          placeholder="Describe the solution..."
          required
        />
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
          Description
        </h2>
        <textarea
          className="w-full h-32 sm:h-40 py-3 px-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none bg-white/80 backdrop-blur-sm"
          value={formData.description}
          onChange={(e) =>
            setFormData({
              ...formData,
              description: e.target.value,
            })
          }
          placeholder="Additional details..."
          required
        />
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white/80 to-transparent h-24 flex items-end z-50">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white py-3 px-6 rounded-xl w-full disabled:opacity-50 font-medium transition-colors shadow-lg"
          disabled={isSubmitting || isProcessing}
        >
          {isSubmitting
            ? 'Submitting...'
            : isProcessing
            ? 'Processing Images...'
            : 'Submit'}
        </button>
      </div>
    </form>
  )
}
