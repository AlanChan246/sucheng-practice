import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { Layout } from './components/Layout'
import { CharToCodePage } from './pages/CharToCodePage'
import { CodeToCharPage } from './pages/CodeToCharPage'
import { DictationPage } from './pages/DictationPage'
import { HomePage } from './pages/HomePage'
import { LearnPage } from './pages/LearnPage'
import { LevelPlayPage, LevelsPage } from './pages/LevelsPage'
import { PracticeHubPage } from './pages/PracticeHubPage'
import { ProgressPage } from './pages/ProgressPage'

const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/'

function ScrollToTop() {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return null
}

export default function App() {
  return (
    <BrowserRouter basename={basename}>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="learn" element={<LearnPage />} />
          <Route path="practice" element={<PracticeHubPage />} />
          <Route path="practice/char-to-code" element={<CharToCodePage />} />
          <Route path="practice/code-to-char" element={<CodeToCharPage />} />
          <Route path="practice/dictation" element={<DictationPage />} />
          <Route path="levels" element={<LevelsPage />} />
          <Route path="levels/:levelId" element={<LevelPlayPage />} />
          <Route path="progress" element={<ProgressPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
