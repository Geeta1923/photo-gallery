import { FavouritesProvider } from './context/FavouritesContext'
import Gallery from './components/Gallery'

const App = () => {
  return (
    <FavouritesProvider>
      <Gallery />
    </FavouritesProvider>
  )
}

export default App
