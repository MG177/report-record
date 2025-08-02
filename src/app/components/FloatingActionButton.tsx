'use client'

import Link from 'next/link'
import { Plus } from 'lucide-react'

export default function FloatingActionButton() {
  return (
    <div className="fixed bottom-6 right-6 z-50 sm:hidden">
      <Link
        href="/create"
        className="flex items-center justify-center w-14 h-14 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95"
        aria-label="Create new report"
      >
        <Plus className="h-6 w-6" />
      </Link>
    </div>
  )
}
