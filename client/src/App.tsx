import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ErrorBoundary } from 'react-error-boundary';
import { AnimatePresence } from 'framer-motion'

import { SearchedItemsProvider } from './contexts/SearchedItemsContext.tsx'

import Home from './pages/Home.tsx'
import CookedCourse from './pages/CookedCourse.tsx'
import DisplayCookedCourse from './pages/DisplayCookedCourse.tsx'
import PageNotFound from './pages/PageNotFound.tsx'
import CookedPlaylist from './pages/CookedPlaylist.tsx'

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert">
      <p>Something went wrong.</p>
      <pre>{error.message || `Error Digest: ${error.digest}`}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}

function LogError(error, info) {
  console.error("Component Stack:", info.componentStack);
}

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onError={LogError}>
      <AnimatePresence mode='wait'>
        <SearchedItemsProvider>
          <BrowserRouter>
            <Routes>
              <Route index element={<Home />} />
              <Route path='/app' element={<CookedCourse />} />
              <Route path='/display-cooked-course/:courseId' element={<DisplayCookedCourse />} />
              <Route path='/playlist-items/:curatedPlaylistId' element={<CookedPlaylist />} />
              <Route path='*' element={<PageNotFound />} />
            </Routes>
          </BrowserRouter>
        </SearchedItemsProvider>
      </AnimatePresence>
    </ErrorBoundary>
  )
}

export default App
