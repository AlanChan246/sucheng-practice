import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useSettings, type ThemeMode } from '../hooks/useSettings'
import { appPath, hardNavigate } from '../lib/navigation'

const NAV_ITEMS = [
  { to: '/learn', label: '教學' },
  { to: '/practice', label: '練習' },
  { to: '/levels', label: '關卡' },
  { to: '/progress', label: '進度' },
] as const

function isNavActive(pathname: string, to: string) {
  if (to === '/') return pathname === '/'
  return pathname === to || pathname.startsWith(`${to}/`)
}

export function Layout() {
  const location = useLocation()
  const { theme, setTheme } = useSettings()

  const cycleTheme = () => {
    const order: ThemeMode[] = ['system', 'light', 'dark']
    const next = order[(order.indexOf(theme) + 1) % order.length]
    setTheme(next)
  }

  const themeLabel =
    theme === 'system' ? '系統' : theme === 'light' ? '淺色' : '深色'

  return (
    <div className="app-shell">
      <header className="site-header">
        <a href={appPath('/')} className="brand">
          <img
            className="brand-logo"
            src={`${import.meta.env.BASE_URL}logo.png`}
            alt=""
            width={38}
            height={38}
          />
          <strong>速成練習</strong>
        </a>
        <nav className="site-nav site-nav--desktop" aria-label="主要導覽">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.to}
              href={appPath(item.to)}
              className={isNavActive(location.pathname, item.to) ? 'active' : undefined}
              aria-current={isNavActive(location.pathname, item.to) ? 'page' : undefined}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="header-tools">
          <button
            type="button"
            className="tool-btn"
            onClick={cycleTheme}
            aria-label={`主題：${themeLabel}`}
          >
            {themeLabel}
          </button>
        </div>
      </header>

      <main className="site-main">
        <Outlet />
      </main>

      <nav className="bottom-nav" aria-label="主要導覽">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              ['bottom-nav-link', isActive ? 'active' : null].filter(Boolean).join(' ')
            }
            onClick={(event) => {
              event.preventDefault()
              hardNavigate(item.to)
            }}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <footer className="site-footer">
        <p>進度儲存在這台裝置。</p>
      </footer>
    </div>
  )
}
