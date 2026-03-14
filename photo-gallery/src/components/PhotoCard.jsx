import { useState } from 'react'
import { useFavourites } from '../context/FavouritesContext'

const HeartIcon = ({ filled }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill={filled ? 'currentColor' : 'none'}
    stroke="currentColor"
    strokeWidth={2}
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
    />
  </svg>
)

const PhotoCard = ({ photo, index }) => {
  const { favourites, dispatch } = useFavourites()
  const isFav = favourites.has(photo.id)
  const [pulseKey, setPulseKey] = useState(0)

  const handleToggle = () => {
    dispatch({ type: 'TOGGLE_FAVOURITE', payload: photo.id })
    // Re-trigger the pulse animation each click
    setPulseKey(k => k + 1)
  }

  // Stagger card appearance based on index
  const delay = `${Math.min(index * 40, 400)}ms`

  return (
    <div
      className="photo-card card-appear relative rounded-lg overflow-hidden bg-neutral-900 group"
      style={{ animationDelay: delay, opacity: 0 }}
    >
      {/* Photo */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={`https://picsum.photos/id/${photo.id}/600/450`}
          alt={`Photo by ${photo.author}`}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Gradient overlay — always visible, stronger on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        {/* Heart button */}
        <button
          onClick={handleToggle}
          aria-label={isFav ? 'Remove from favourites' : 'Add to favourites'}
          className={`
            absolute top-3 right-3 z-10
            w-9 h-9 rounded-full flex items-center justify-center
            transition-all duration-200
            ${isFav
              ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/40'
              : 'bg-black/40 text-white/70 hover:bg-black/60 hover:text-white backdrop-blur-sm'
            }
          `}
        >
          <span key={pulseKey} className={isFav ? 'heart-pulse inline-flex' : 'inline-flex'}>
            <HeartIcon filled={isFav} />
          </span>
        </button>

        {/* Favourite badge */}
        {isFav && (
          <div className="absolute top-3 left-3 z-10 bg-rose-500/90 backdrop-blur-sm text-white text-xs font-medium px-2 py-0.5 rounded-full">
            Saved
          </div>
        )}
      </div>

      {/* Author info */}
      <div className="px-3 py-2.5">
        <p className="text-sm font-medium text-neutral-200 truncate">{photo.author}</p>
        <p className="text-xs text-neutral-500 mt-0.5">
          {photo.width} × {photo.height}
        </p>
      </div>
    </div>
  )
}

export default PhotoCard
