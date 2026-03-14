import { useState, useCallback, useMemo } from 'react'
import useFetchPhotos from '../hooks/useFetchPhotos'
import PhotoCard from './PhotoCard'
import SearchBar from './SearchBar'
import { useFavourites } from '../context/FavouritesContext'

// ─── Loading Spinner ──────────────────────────────────────────────────────────
const Spinner = () => (
  <div className="flex flex-col items-center gap-4 py-24">
    <div className="spinner w-10 h-10" />
    <p className="text-neutral-500 text-sm">Loading photos...</p>
  </div>
)

// ─── Error State ─────────────────────────────────────────────────────────────
const ErrorState = ({ message }) => (
  <div className="flex flex-col items-center gap-3 py-24">
    <div className="w-12 h-12 rounded-full bg-red-950 flex items-center justify-center text-red-400 text-xl">
      ✕
    </div>
    <p className="text-red-400 font-medium">Failed to load photos</p>
    <p className="text-neutral-500 text-sm max-w-sm text-center">{message}</p>
  </div>
)

// ─── Empty State ─────────────────────────────────────────────────────────────
const EmptyState = ({ query }) => (
  <div className="flex flex-col items-center gap-3 py-24 text-center">
    <p className="text-neutral-400 font-medium">No results for "{query}"</p>
    <p className="text-neutral-600 text-sm">Try a different author name.</p>
  </div>
)

// ─── Gallery ─────────────────────────────────────────────────────────────────
const Gallery = () => {
  const { photos, loading, error } = useFetchPhotos()
  const { favourites } = useFavourites()
  const [query, setQuery] = useState('')
  const [showFavsOnly, setShowFavsOnly] = useState(false)

  /**
   * useCallback — memoises the search handler function.
   *
   * Without useCallback, every render creates a new function reference.
   * SearchBar receives this as a prop — if the reference changes every render,
   * it would force SearchBar to re-render even when nothing relevant changed.
   * useCallback ensures the reference stays stable between renders (since
   * setQuery from useState never changes, the dep array is empty).
   */
  const handleSearch = useCallback((value) => {
    setQuery(value)
  }, [])

  /**
   * useMemo — memoises the filtered photo list computation.
   *
   * Without useMemo, the filter would run on every render — including re-renders
   * triggered by unrelated state (e.g. a heart toggle). Since filtering 30 items
   * is cheap, the real benefit here is demonstrating the pattern: useMemo is
   * critical when the derived list is large or the filter logic is expensive.
   * It only re-computes when photos, query, showFavsOnly, or favourites change.
   */
  const filteredPhotos = useMemo(() => {
    let result = photos

    // Filter by search query (author name, case-insensitive)
    if (query.trim()) {
      const lowerQuery = query.toLowerCase()
      result = result.filter(p =>
        p.author.toLowerCase().includes(lowerQuery)
      )
    }

    // Optionally filter to favourites only
    if (showFavsOnly) {
      result = result.filter(p => favourites.has(p.id))
    }

    return result
  }, [photos, query, showFavsOnly, favourites])

  const favCount = favourites.size

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      {/* ── Header ── */}
      <header className="border-b border-neutral-800/60 sticky top-0 z-20 bg-[#0f0f0f]/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center gap-4">
          {/* Title */}
          <div className="flex-shrink-0">
            <h1 className="font-display text-2xl text-neutral-100 leading-none">
              Picsum<span className="text-yellow-500">.</span>Gallery
            </h1>
          </div>

          {/* Search */}
          <div className="flex-1 w-full sm:max-w-md">
            <SearchBar value={query} onChange={handleSearch} />
          </div>

          {/* Favourites toggle */}
          <button
            onClick={() => setShowFavsOnly(v => !v)}
            className={`
              flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium
              transition-all duration-200 flex-shrink-0
              ${showFavsOnly
                ? 'bg-rose-500 text-white'
                : 'bg-neutral-900 text-neutral-400 hover:text-neutral-200 border border-neutral-800'
              }
            `}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill={showFavsOnly ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>
            Saved {favCount > 0 && <span className="bg-white/20 rounded-full px-1.5 text-xs">{favCount}</span>}
          </button>
        </div>
      </header>

      {/* ── Main content ── */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Status bar */}
        {!loading && !error && (
          <div className="mb-6 flex items-center justify-between">
            <p className="text-neutral-600 text-sm">
              {query
                ? `${filteredPhotos.length} result${filteredPhotos.length !== 1 ? 's' : ''} for "${query}"`
                : showFavsOnly
                  ? `${filteredPhotos.length} saved photo${filteredPhotos.length !== 1 ? 's' : ''}`
                  : `${photos.length} photos`
              }
            </p>
          </div>
        )}

        {/* Loading */}
        {loading && <Spinner />}

        {/* Error */}
        {error && <ErrorState message={error} />}

        {/* Empty search result */}
        {!loading && !error && filteredPhotos.length === 0 && query && (
          <EmptyState query={query} />
        )}

        {/* No favourites saved */}
        {!loading && !error && filteredPhotos.length === 0 && showFavsOnly && !query && (
          <div className="flex flex-col items-center gap-3 py-24 text-center">
            <p className="text-neutral-400 font-medium">No saved photos yet</p>
            <p className="text-neutral-600 text-sm">Click the ♥ on any photo to save it.</p>
          </div>
        )}

        {/* Grid */}
        {!loading && !error && filteredPhotos.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredPhotos.map((photo, index) => (
              <PhotoCard key={photo.id} photo={photo} index={index} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default Gallery
