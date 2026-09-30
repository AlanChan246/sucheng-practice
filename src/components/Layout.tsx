import { Outlet, useLocation } from 'react-router-dom'
import { Home, BookOpen, Keyboard, Footprints, Sun, Moon, Monitor } from 'lucide-react'
import { useSettings, type ThemeMode } from '../hooks/useSettings'
import { useProgress } from '../hooks/useProgress'
import { AppLink } from './AppLink'

const ITEMS = [{ to: '/', label: '開始', icon: Home }, { to: '/learn', label: '學少少', icon: BookOpen }, { to: '/practice', label: '練幾題', icon: Keyboard }, { to: '/progress', label: '足跡', icon: Footprints }]
export function Layout() {
  const { pathname } = useLocation()
  const { theme, setTheme } = useSettings()
  const { storageIssue } = useProgress()
  const focused = pathname.startsWith('/practice/') || /^\/levels\/[^/]+$/.test(pathname)
  const active = (to: string) => to === '/' ? pathname === '/' : pathname.startsWith(to) || (to === '/learn' && pathname.startsWith('/levels'))
  const label = theme === 'system' ? '跟隨系統' : theme === 'dark' ? '深色' : '淺色'
  const ThemeIcon = theme === 'system' ? Monitor : theme === 'dark' ? Moon : Sun
  const cycleTheme = () => { const modes: ThemeMode[] = ['light','dark','system']; setTheme(modes[(modes.indexOf(theme) + 1) % modes.length]) }
  return <div className={`app-shell ${focused ? 'app-shell--focused' : ''}`}>
    <a className="skip-link" href="#main-content">跳到主要內容</a>
    {!focused && <header className="site-header"><AppLink to="/" className="brand" aria-label="速成，回到開始"><span className="brand-keys" aria-hidden="true"><span>A</span><span>B</span></span><strong>速成<span>兩鍵合拍</span></strong></AppLink><nav className="desktop-nav" aria-label="主要導覽">{ITEMS.map(item => <AppLink key={item.to} to={item.to} aria-current={active(item.to) ? 'page' : undefined}>{item.label}</AppLink>)}</nav><button className="theme-button" type="button" onClick={cycleTheme} aria-label={`目前${label}，切換主題`}><ThemeIcon size={19} /><span>{label}</span></button></header>}
    {storageIssue && <p className="storage-notice" role="status">{storageIssue}</p>}
    <main id="main-content" className="site-main" tabIndex={-1}><Outlet /></main>
    {!focused && <><footer className="site-footer"><span>慢慢練，兩鍵就上手。</span><span>進度只留在這個瀏覽器。</span></footer><nav className="mobile-nav" aria-label="手機主要導覽">{ITEMS.map(({ icon: Icon, ...item }) => <AppLink key={item.to} to={item.to} aria-current={active(item.to) ? 'page' : undefined}><Icon size={21} aria-hidden="true" /><span>{item.label}</span></AppLink>)}</nav></>}
  </div>
}
