import Link from 'next/link'
import Button from './button'
import ExportButton from './ExportButton'
import { Plus, ArrowLeft } from 'lucide-react'

interface HeadingProps {
  title: string
  description?: string
}

export default function HeaderDefault({ title, description }: HeadingProps) {
  return (
    <div className="w-full mb-6">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg">
              {title.charAt(0)}
            </div>
            <div className="flex flex-col">
              <h1 className="text-gray-900 text-xl sm:text-2xl lg:text-3xl font-bold">
                {title}
              </h1>
              {description && (
                <p className="text-gray-600 text-sm sm:text-base mt-1">
                  {description}
                </p>
              )}
            </div>
          </div>
          <div className="flex gap-2 sm:gap-3">
            <Button
              text="New Report"
              link="/create"
              variant="primary"
              icon="pi-plus"
              className="flex-1 sm:flex-none"
            />
            <ExportButton />
          </div>
        </div>
      </div>
    </div>
  )
}

export function HeaderNewReports() {
  return (
    <div className="w-full mb-6">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors p-2 rounded-lg hover:bg-blue-50"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium hidden sm:inline">Back</span>
            </Link>
          </div>
          <h1 className="text-gray-900 text-xl sm:text-2xl font-bold">
            New Report
          </h1>
          <div className="w-10 sm:w-12" /> {/* Spacer for centering */}
        </div>
      </div>
    </div>
  )
}

export function HeaderEditReports() {
  return (
    <div className="w-full mb-6">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors p-2 rounded-lg hover:bg-blue-50"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium hidden sm:inline">Back</span>
            </Link>
          </div>
          <h1 className="text-gray-900 text-xl sm:text-2xl font-bold">
            Edit Report
          </h1>
          <div className="w-10 sm:w-12" /> {/* Spacer for centering */}
        </div>
      </div>
    </div>
  )
}
