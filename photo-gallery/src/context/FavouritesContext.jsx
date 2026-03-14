import { createContext, useContext, useReducer, useEffect } from 'react'

// ─── Reducer ─────────────────────────────────────────────────────────────────
/**
 * favouritesReducer
 *
 * Handles two actions:
 *  - TOGGLE_FAVOURITE: if photo id is already in set → remove it, else → add it
 *  - HYDRATE: replace state with data loaded from localStorage (called once on mount)
 *
 * We use useReducer instead of useState because the toggle logic involves
 * reading previous state to decide the next state — reducers make that explicit
 * and testable. It also scales better if we add more actions (e.g. CLEAR_ALL).
 */
export const favouritesReducer = (state, action) => {
  switch (action.type) {
    case 'TOGGLE_FAVOURITE': {
      const id = action.payload
      // Return a new Set so React detects the state change
      const next = new Set(state)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    }

    case 'HYDRATE': {
      // action.payload is an array of ids loaded from localStorage
      return new Set(action.payload)
    }

    default:
      return state
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────
const FavouritesContext = createContext(null)

const STORAGE_KEY = 'photo-gallery-favourites'

export const FavouritesProvider = ({ children }) => {
  const [favourites, dispatch] = useReducer(favouritesReducer, new Set())

  // On first render, load persisted favourites from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const ids = JSON.parse(stored)
        dispatch({ type: 'HYDRATE', payload: ids })
      }
    } catch {
      // Corrupt storage — silently ignore and start fresh
    }
  }, [])

  // Whenever favourites change, persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...favourites]))
    } catch {
      // Storage full or unavailable — fail silently
    }
  }, [favourites])

  return (
    <FavouritesContext.Provider value={{ favourites, dispatch }}>
      {children}
    </FavouritesContext.Provider>
  )
}

// Custom hook so components don't import the context directly
export const useFavourites = () => {
  const ctx = useContext(FavouritesContext)
  if (!ctx) throw new Error('useFavourites must be used inside FavouritesProvider')
  return ctx
}
