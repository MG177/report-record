import { useState } from 'react'

interface SearchProps {
  searchTerm: string
  onSearch: (term: string) => void
  sortField: string
  sortOrder: string
  onSort: (field: string) => void
  onSortOrderChange: () => void
}

export default function Search({
  searchTerm,
  onSearch,
  sortField,
  sortOrder,
  onSort,
  onSortOrderChange,
}: SearchProps) {
  return (
    <div className="w-full my-3 flex flex-row gap-2">
      <input
        type="text"
        placeholder="Search..."
        className="w-full bg-transparent px-4 py-2 rounded-lg border-2 border-primary text-text text-xl sm:text-2xl md:text-3xl placeholde:text-white/50"
        value={searchTerm}
        onChange={(e) => onSearch(e.target.value)}
      />
      <select
        value={sortField}
        onChange={(e) => onSort(e.target.value)}
        className="p-2 min-w-[15%] rounded-lg border-2 border-primary"
      >
        <option value="createdAt">Date</option>
        <option value="title">Title</option>
      </select>
      <button
        onClick={onSortOrderChange}
        className="p-2 rounded-lg border-2 border-primary"
      >
        {sortOrder === 'asc' ? '↑' : '↓'}
      </button>
    </div>
  )
}
