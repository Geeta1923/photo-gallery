import { useState, useEffect } from 'react'

/**
 * useFetchPhotos
 * Custom hook that fetches 30 photos from the Picsum Photos API.
 * Returns: { photos, loading, error }
 *
 * - photos: array of photo objects from the API
 * - loading: boolean, true while the request is in-flight
 * - error: string or null, holds the error message if the fetch fails
 *
 * If the API fails (network error or non-OK HTTP response),
 * loading is set to false and error is populated with a message.
 */
const useFetchPhotos = () => {
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // AbortController lets us cancel the fetch if the component unmounts
    const controller = new AbortController()

    const fetchPhotos = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(
          'https://picsum.photos/v2/list?limit=30',
          { signal: controller.signal }
        )

        // Non-2xx responses won't throw on their own — check manually
        if (!response.ok) {
          throw new Error(`API error: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()
        setPhotos(data)
      } catch (err) {
        // Ignore AbortError — it's expected when component unmounts
        if (err.name !== 'AbortError') {
          setError(err.message || 'Failed to fetch photos. Please try again.')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchPhotos()

    // Cleanup: cancel the in-flight request on unmount
    return () => controller.abort()
  }, []) // Empty dep array = run once on mount

  return { photos, loading, error }
}

export default useFetchPhotos
