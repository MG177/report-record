'use client'
import { useState } from 'react'

interface SearchProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
}

export default function Search({ searchTerm, setSearchTerm }: SearchProps) {
  const handleSearch = () => {
    // onSearch(searchTerm);
  }
  return (
    <div className="w-full mt-6 flex flex-col sm:flex-row gap-4">
      <input
        type="text"
        placeholder="Search..."
        className="w-full bg-transparent px-4 py-2 2 rounded-lg border-2 border-primary text-text text-xl sm:text-2xl md:text-3xl placeholde:text-white/50"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button
        className="w-12 h-12 bg-white rounded-lg border-2 border-text flex items-center justify-center"
        onClick={handleSearch}
      >
        <span className="text-2xl">🔍</span>
      </button>
    </div>
  )
}
