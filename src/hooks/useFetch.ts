import { useState, useEffect } from 'react'

function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        console.log('Fetching:', url) // Debug log

        const response = await fetch(url)

        if (!response.ok) {
          const errorText = await response.text()
          console.error('API Error:', response.status, errorText) // Debug log
          throw new Error(`HTTP ${response.status}: ${errorText}`)
        }

        const result = await response.json()
        console.log('API Response:', result) // Debug log

        setData(result)
      } catch (error) {
        console.error('Fetch error:', error) // Debug log
        if (error instanceof Error) {
          setError(error.message)
        } else {
          setError('An unknown error occurred')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [url])

  return { data, loading, error }
}

export default useFetch
