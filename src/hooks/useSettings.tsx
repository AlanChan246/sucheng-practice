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
  setTheme: (theme: ThemeMode) => void
}

const STORAGE_KEY = 'sucheng-practice-settings'

const SettingsContext = createContext<SettingsContextValue | null>(null)

function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { theme: 'light' as ThemeMode }
    const parsed = JSON.parse(raw) as { theme?: ThemeMode }
    return { theme: ['light', 'dark', 'system'].includes(parsed.theme ?? '') ? parsed.theme! : ('light' as ThemeMode) }
  } catch {
    return { theme: 'light' as ThemeMode }
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
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(settings)) } catch { /* Theme remains usable when browser storage is unavailable. */ }
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
    document.documentElement.classList.remove('large-text')
  }, [resolvedTheme])

  const setTheme = useCallback((theme: ThemeMode) => {
    setSettings((prev) => ({ ...prev, theme }))
  }, [])

  const value = useMemo(
    () => ({
      theme: settings.theme,
      resolvedTheme,
      setTheme,
    }),
    [settings, resolvedTheme, setTheme],
  )

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

export function useSettings() {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider')
  return ctx
}
