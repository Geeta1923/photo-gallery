const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-4 h-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
  </svg>
)

const ClearIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
  </svg>
)

const SearchBar = ({ value, onChange }) => {
  return (
    <div className="relative max-w-md w-full mx-auto">
      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-neutral-500">
        <SearchIcon />
      </div>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Search by author..."
        className="
          search-input w-full
          bg-neutral-900 border border-neutral-800
          text-neutral-100 placeholder-neutral-600
          rounded-lg pl-10 pr-10 py-2.5
          text-sm outline-none
          transition-all duration-200
          focus:border-yellow-600/60
        "
      />
      {value && (
        <button
          onClick={() => onChange('')}
          aria-label="Clear search"
          className="absolute inset-y-0 right-3 flex items-center text-neutral-500 hover:text-neutral-300 transition-colors"
        >
          <ClearIcon />
        </button>
      )}
    </div>
  )
}

export default SearchBar
