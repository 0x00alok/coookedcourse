import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { SearchedItemsProvider } from './contexts/SearchedItemsContext.tsx'

import Home from './pages/Home.tsx'
import CookedCourse from './pages/CookedCourse.tsx'
import DisplayCookedCourse from './pages/DisplayCookedCourse.tsx'
import PageNotFound from './pages/PageNotFound.tsx'
import CookedPlaylist from './pages/CookedPlaylist.tsx'
import TestCp from './components/CookedPlaylist/Sbar.tsx'

function App() {
  return (
    <AnimatePresence mode='wait'>
      <SearchedItemsProvider>
        <BrowserRouter>
          <Routes>
            <Route index element={<Home />} />
            <Route path='/app' element={<CookedCourse />} />
            <Route path='/display-cooked-course/:courseId' element={<DisplayCookedCourse />} />
            <Route path='/playlist-items/:curatedPlaylistId' element={<CookedPlaylist />} />
            <Route path='/test' element={<TestCp />} />
            <Route path='*' element={<PageNotFound />} />
          </Routes>
        </BrowserRouter>
      </SearchedItemsProvider>
    </AnimatePresence>
  )
}

export default App
