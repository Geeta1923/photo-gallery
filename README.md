# Photo Gallery — Celebrare Frontend Intern Assignment

A React + Vite + Tailwind CSS photo gallery app built to spec.

## Quick Start

```bash
npm install
npm run dev
```

Then open http://localhost:5173 in your browser.

## Features

| Requirement | Implementation |
|---|---|
| React + Vite + Tailwind | ✅ No UI component libraries |
| Fetch from Picsum API | ✅ `useFetchPhotos` custom hook |
| Responsive grid | ✅ 1 col mobile / 2 col tablet / 4 col desktop |
| Real-time search | ✅ Filters by author name as you type |
| Favourites with `useReducer` | ✅ `FavouritesContext` with `TOGGLE_FAVOURITE` + `HYDRATE` |
| `localStorage` persistence | ✅ Survives page refresh |
| Custom hook | ✅ `useFetchPhotos` returns `{ photos, loading, error }` |
| `useCallback` | ✅ On the search handler in `Gallery.jsx` |
| `useMemo` | ✅ On the filtered photo list in `Gallery.jsx` |

## Project Structure

```
src/
  hooks/
    useFetchPhotos.js       # Custom hook — fetch logic only, no UI
  context/
    FavouritesContext.jsx   # useReducer + localStorage + Context
  components/
    Gallery.jsx             # Main view — useCallback + useMemo here
    PhotoCard.jsx           # Single card with heart toggle
    SearchBar.jsx           # Controlled input component
  App.jsx                   # Wraps Gallery with FavouritesProvider
  main.jsx                  # Entry point
  index.css                 # Tailwind + custom animations
```

## Key Decisions

### Why `useReducer` instead of `useState`?
The favourites toggle involves reading the current state to decide the next state
(if id is in set → remove, else → add). A reducer makes this logic explicit and
self-contained. It also supports a `HYDRATE` action for loading from localStorage
on mount — impossible to express cleanly with `useState`.

### Why `useCallback` on the search handler?
Every render creates a new function reference. Passing a new reference to
`SearchBar` on every parent render would cause `SearchBar` to re-render even
when nothing relevant changed. `useCallback` stabilises the reference.

### Why `useMemo` on the filtered photo list?
Without it, the filter runs on every render — including re-renders triggered by
the heart toggle. `useMemo` skips the filter unless `photos`, `query`,
`showFavsOnly`, or `favourites` actually change.

## Screen Recording Hints

1. Show app: load, search "Tim", toggle hearts, refresh page (favourites persist)
2. `useFetchPhotos`: returns `{ photos, loading, error }`. If API fails → `error` is set, `loading` false.
3. `useReducer`: handles `TOGGLE_FAVOURITE` (add/remove) and `HYDRATE` (restore from localStorage). Chose over `useState` because toggle logic + multiple actions are cleaner in a reducer.
4. `useCallback` + `useMemo`: see explanations above.
5. Hardest part: (pick yours — e.g. making localStorage hydration happen before first paint without flicker)
