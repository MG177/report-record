'use client'

import { useEffect, useState } from 'react'
import { HeaderNewReports } from '../../components/header'
import moment from 'moment';

// Renamed `FormData` to `ReportFormData` to avoid clashing with built-in FormData
type ReportFormData = {
  title: string
  date: Date
  description: string
  location: string
  problem: string
  solve: string
}

export default function Home() {
  const [formData, setFormData] = useState<ReportFormData>({
    title: '',
    date: new Date(),
    description: '',
    location: '',
    problem: '',
    solve: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)

    const jsonData = {
      title: formData.title || '',
      date: formData.date?.toISOString() || '',
      description: formData.description || '',
      location: formData.location || '',
      problem: formData.problem || '',
      solve: formData.solve || '',
    }

    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonData),
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Report created:', data)
        window.location.href = '/' // Navigate to home page
      } else {
        console.error('Failed to create report')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    console.log(formData)
  }, [formData])

  return (
    <main className="flex min-h-screen flex-col items-center w-full mx-auto">
      <HeaderNewReports />
      <form
        onSubmit={handleSubmit}
        className="w-full h-fit mt-2 flex flex-col gap-4 mb-20"
      >
        <div className="flex flex-col gap-2">
          <div className="text-2xl font-normal leading-none">Title</div>
          <input
            type="text"
            className="w-full h-10 py-1 px-2 rounded-xl border-2 border-secondary outline-2 outline-primary"
            value={formData.title || ''}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-2xl font-normal leading-none">Date & Time</div>
          <input
            type="datetime-local"
            className="w-full h-10 py-1 px-2 rounded-xl border-2 border-secondary outline-2 outline-primary bg-background"
            value={formData.date?.toISOString().split('.')[0] || ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                date: new Date(e.target.value),
              })
            }
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-2xl font-normal leading-none">Location</div>
          <input
            type="text"
            className="w-full h-10 py-1 px-2 rounded-xl border-2 border-secondary outline-2 outline-primary"
            value={formData.location || ''}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-2xl font-normal leading-none">Problem</div>
          <textarea
            className="w-full h-40 py-1 px-2 rounded-xl border-2 border-secondary outline-2 outline-primary resize-none colors-text"
            value={formData.problem || ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                problem: e.target.value,
              })
            }
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-2xl font-normal leading-none">Solution</div>
          <textarea
            className="w-full h-40 py-1 px-2 rounded-xl border-2 border-secondary outline-2 outline-primary resize-none colors-text"
            value={formData.solve || ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                solve: e.target.value,
              })
            }
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-2xl font-normal leading-none">Description</div>
          <textarea
            className="w-full h-40 py-1 px-2 rounded-xl border-2 border-secondary outline-2 outline-primary resize-none colors-text"
            value={formData.description || ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                description: e.target.value,
              })
            }
            required
          />
        </div>
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background/60 to-transparent h-24 flex items-end">
          <button
            type="submit"
            className="bg-primary text-white py-2 px-4 rounded-xl w-full disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>
    </main>
  )
}
