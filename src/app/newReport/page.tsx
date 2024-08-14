'use client'

import { useEffect, useState } from 'react'
import { HeaderNewReports } from '../components/header'
import { log } from 'console'

interface FormData {
  title: string
  date: Date
  description: string
  file: File
}

export default function Home() {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    date: new Date(),
    description: '',
    file: new File([], ''),
  })

  const [images, setImages] = useState<string[]>([])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    console.log('update')
    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Report created:', data)
        // Handle successful submission (e.g., show success message, reset form, redirect)
      } else {
        console.error('Failed to create report')
        // Handle error (e.g., show error message)
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      // Handle network errors
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const newImages = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      )
      setImages((prevImages) => [...prevImages, ...newImages])
    }
  }

  // useEffect(() => {
  //   console.log(formData)
  // }, [formData])

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
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-2xl font-normal leading-none">Date</div>
          <input
            type="date"
            className="w-full h-10 py-1 px-2 rounded-xl border-2 border-secondary outline-2 outline-primary bg-background"
            value={formData.date.toISOString().split('T')[0]}
            onChange={(e) =>
              setFormData({
                ...formData,
                date: new Date(e.target.value),
              })
            }
          />
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-2xl font-normal leading-none">Description</div>
          <textarea
            className="w-full h-40 py-1 px-2 rounded-xl border-2 border-secondary outline-2 outline-primary resize-none colors-text"
            value={formData.description}
            onChange={(e) =>
              setFormData({
                ...formData,
                description: e.target.value,
              })
            }
          />
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-2xl font-normal leading-none">Photos</div>
          <div className="h-fit w-fit flex flex-row items-center gap-2 flex-wrap">
            {images.map((image, index) => (
              <img
                key={index}
                className="w-44 h-44 rounded-xl border-2 border-secondary flex flex-col justify-center items-center object-cover"
                src={image}
                alt={`Uploaded image ${index + 1}`}
              />
            ))}
            <label className="w-44 h-44 rounded-xl border-2 border-secondary flex flex-col justify-center items-center cursor-pointer">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <span>+ Add Photo</span>
            </label>
          </div>
        </div>
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background/60 to-transparent h-24 flex items-end">
          <button
            type="submit"
            className="bg-primary text-white py-2 px-4 rounded-xl w-full"
          >
            Submit
          </button>
        </div>
      </form>
    </main>
  )
}
