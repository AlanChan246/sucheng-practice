import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export type ThemeMode = 'system' | 'light' | 'dark'

interface SettingsContextValue {
  theme: ThemeMode
  resolvedTheme: 'light' | 'dark'
  largeText: boolean
  setTheme: (theme: ThemeMode) => void
  toggleLargeText: () => void
}

const STORAGE_KEY = 'sucheng-practice-settings'

const SettingsContext = createContext<SettingsContextValue | null>(null)

function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { theme: 'light' as ThemeMode, largeText: false }
    return JSON.parse(raw) as { theme: ThemeMode; largeText: boolean }
  } catch {
    return { theme: 'light' as ThemeMode, largeText: false }
  }
}

function resolveTheme(theme: ThemeMode): 'light' | 'dark' {
  if (theme === 'light') return 'light'
  if (theme === 'dark') return 'dark'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState(loadSettings)
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>(() =>
    resolveTheme(loadSettings().theme),
  )

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    setResolvedTheme(resolveTheme(settings.theme))
  }, [settings])

  useEffect(() => {
    if (settings.theme !== 'system') return
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => setResolvedTheme(resolveTheme('system'))
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [settings.theme])

  useEffect(() => {
    document.documentElement.dataset.theme = resolvedTheme
    document.documentElement.classList.toggle('large-text', settings.largeText)
  }, [resolvedTheme, settings.largeText])

  const setTheme = useCallback((theme: ThemeMode) => {
    setSettings((prev) => ({ ...prev, theme }))
  }, [])

  const toggleLargeText = useCallback(() => {
    setSettings((prev) => ({ ...prev, largeText: !prev.largeText }))
  }, [])

  const value = useMemo(
    () => ({
      theme: settings.theme,
      resolvedTheme,
      largeText: settings.largeText,
      setTheme,
      toggleLargeText,
    }),
    [settings, resolvedTheme, setTheme, toggleLargeText],
  )

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

export function useSettings() {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider')
  return ctx
}
