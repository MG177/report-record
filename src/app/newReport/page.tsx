'use client'

import { useEffect, useState } from 'react'
import { HeaderNewReports } from '../../components/header'

interface FormData {
  title: string
  date: Date
  description: string
  images: { url: string; file: File }[]
}

export default function Home() {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    date: new Date(),
    description: '',
    images: [],
  })

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formDataToSend = new FormData()
    formDataToSend.append('title', formData.title)
    formDataToSend.append('date', formData.date.toISOString())
    formDataToSend.append('description', formData.description)
    formData.images.forEach((image) => {
      formDataToSend.append('images', image.file)
    })

    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        body: formDataToSend,
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Report created:', data)
      } else {
        console.error('Failed to create report')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const newImages = Array.from(files).map((file) => ({
        url: URL.createObjectURL(file),
        file: file,
      }))
      setFormData((prevData) => ({
        ...prevData,
        images: [...prevData.images, ...newImages],
      }))
    }
  }

  const removeImage = (index: number) => {
    setFormData((prevData) => {
      const newImages = [...prevData.images]
      URL.revokeObjectURL(newImages[index].url)
      newImages.splice(index, 1)
      return { ...prevData, images: newImages }
    })
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
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
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
            required
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
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-2xl font-normal leading-none">Photos</div>
          <div className="h-fit w-fit flex flex-row items-center gap-2 flex-wrap">
            {formData.images.map((image, index) => (
              <div key={index} className="relative">
                <img
                  className="w-44 h-44 rounded-xl border-2 border-secondary flex flex-col justify-center items-center object-cover"
                  src={image.url}
                  alt={`Uploaded image ${index + 1}`}
                />
                <button
                  type="button"
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                  onClick={() => removeImage(index)}
                >
                  X
                </button>
              </div>
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
