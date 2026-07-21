import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { CharToCodePage } from './pages/CharToCodePage'
import { CodeToCharPage } from './pages/CodeToCharPage'
import { DictationPage } from './pages/DictationPage'
import { HomePage } from './pages/HomePage'
import { LearnPage } from './pages/LearnPage'
import { LevelPlayPage, LevelsPage } from './pages/LevelsPage'
import { PracticeHubPage } from './pages/PracticeHubPage'
import { ProgressPage } from './pages/ProgressPage'

export default function App() {
  return (
    <BrowserRouter>
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
