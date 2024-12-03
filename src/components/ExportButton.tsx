'use client'

import { useState, useEffect } from 'react'
import Button from './button'
import Modal from './modal'
import { exportObjectToXLS } from '@/utils/exportXLS'
import convertDate from '@/utils/convertDate'
import { toast } from 'react-hot-toast'

interface DateInputProps {
  label: string
  id: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

function DateInput({ label, id, value, onChange }: DateInputProps) {
  return (
    <div className="flex flex-col">
      <label htmlFor={id} className="mb-2 text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        type="date"
        id={id}
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
      />
    </div>
  )
}

export default function ExportButton() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = () => setIsModalOpen(true)

  const fetchData = async (startDate: string, endDate: string) => {
    try {
      // Adjust the dates to include the full day
      const start = new Date(startDate)
      const end = new Date(endDate)
      end.setHours(23, 59, 59, 999) // Set to end of day

      const response = await fetch(
        `/api/reports?startDate=${start.toISOString()}&endDate=${end.toISOString()}&sort=date&order=desc`
      )
      
      if (!response.ok) {
        throw new Error('Failed to fetch data')
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Fetch error:', error)
      throw error
    }
  }

  const exportDataForRange = async () => {
    try {
      setIsExporting(true)
      const data = await fetchData(startDate, endDate)
      
      if (!data || data.length === 0) {
        toast.error('No data found for the selected date range')
        return
      }

      const baseUrl = window.location.origin
      const formattedData = data.map(({ _id, date, location, problem, solve, description }) => ({
        Date: convertDate(date).date,
        // Time: convertDate(date).time,
        Location: location,
        Problem: problem || '',
        Solution: solve || '',
        Description: description || '',
        'View Details': `${baseUrl}/reports/${_id}`,
      }))

      exportObjectToXLS(formattedData)
      setIsModalOpen(false)
      toast.success(`Successfully exported ${formattedData.length} reports`)
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Failed to export data. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  const setDateRange = (rangeType: 'today' | 'week' | 'month' | 'year') => {
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Set to start of day
    let start: Date, end: Date

    switch (rangeType) {
      case 'today':
        start = end = today
        break
      case 'week':
        end = new Date(today)
        start = new Date(today)
        start.setDate(today.getDate() - 7)
        break
      case 'month':
        end = new Date(today)
        start = new Date(today)
        start.setMonth(today.getMonth() - 1)
        break
      case 'year':
        end = new Date(today)
        start = new Date(today)
        start.setFullYear(today.getFullYear() - 1)
        break
    }

    setStartDate(start.toISOString().split('T')[0])
    setEndDate(end.toISOString().split('T')[0])
  }

  return (
    <>
      <Button text="Export" onClick={handleExport} variant="secondary" />
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        header="Export Reports"
      >
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DateInput
              label="Start Date"
              id="start-date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <DateInput
              label="End Date"
              id="end-date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Button
              text="Today"
              onClick={() => setDateRange('today')}
              variant="secondary"
            />
            <Button
              text="This Week"
              onClick={() => setDateRange('week')}
              variant="secondary"
            />
            <Button
              text="This Month"
              onClick={() => setDateRange('month')}
              variant="secondary"
            />
            <Button
              text="This Year"
              onClick={() => setDateRange('year')}
              variant="secondary"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              text="Cancel"
              onClick={() => setIsModalOpen(false)}
              variant="secondary"
            />
            <Button
              text={isExporting ? 'Exporting...' : 'Export'}
              onClick={exportDataForRange}
              disabled={!startDate || !endDate || isExporting}
              variant="primary"
            />
          </div>
        </div>
      </Modal>
    </>
  )
}
