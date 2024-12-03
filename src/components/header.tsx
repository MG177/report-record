import Link from 'next/link'
import Button from './button'
import ExportButton from './ExportButton'

interface HeadingProps {
  title: string
  description?: string
}

export default function HeaderDefault({ title, description }: HeadingProps) {
  return (
    <div className="w-full mb-8">
      <div className="flex flex-row justify-between items-center gap-4 bg-white p-6 rounded-2xl shadow-lg border border-blue-100">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-md">
            {title[0]}
          </div>
          <div className="flex flex-col">
            <span className="text-gray-900 text-xl sm:text-2xl md:text-3xl font-bold">
              {title}
            </span>
            {description && (
              <span className="text-gray-600 text-sm sm:text-base">
                {description}
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-3">
          <Button 
            text="" 
            link="/create" 
            variant="primary" 
            icon="pi-plus"
          />
          <ExportButton />
        </div>
      </div>
    </div>
  )
}

export function HeaderNewReports() {
  return (
    <div className="w-full mb-8">
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-blue-100">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <Link 
              href="/"
              className="flex items-center gap-2 text-blue-700 hover:text-blue-800 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Back</span>
            </Link>
          </div>
          <h1 className="text-gray-900 text-3xl font-bold">
            New Report
          </h1>
        </div>
      </div>
    </div>
  )
}

export function HeaderEditReports() {
  return (
    <div className="w-full mb-8">
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-blue-100">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <Link 
              href="/"
              className="flex items-center gap-2 text-blue-700 hover:text-blue-800 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Back</span>
            </Link>
          </div>
          <h1 className="text-gray-900 text-3xl font-bold">
            Edit Report
          </h1>
        </div>
      </div>
    </div>
  )
}