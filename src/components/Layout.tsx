import { Link, NavLink, Outlet } from 'react-router-dom'
import { useSettings, type ThemeMode } from '../hooks/useSettings'

const NAV_ITEMS = [
  { to: '/learn', label: '教學' },
  { to: '/practice', label: '練習' },
  { to: '/levels', label: '關卡' },
  { to: '/progress', label: '進度' },
]

export function Layout() {
  const { theme, setTheme, largeText, toggleLargeText } = useSettings()

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
        <Link to="/" className="brand">
          <img
            className="brand-logo"
            src={`${import.meta.env.BASE_URL}logo.png`}
            alt=""
            width={38}
            height={38}
          />
          <strong>速成練習</strong>
        </Link>
        <nav className="site-nav site-nav--desktop" aria-label="主要導覽">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.to} to={item.to}>
              {item.label}
            </NavLink>
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
          <button
            type="button"
            className={`tool-btn${largeText ? ' tool-btn--active' : ''}`}
            onClick={toggleLargeText}
            aria-pressed={largeText}
          >
            大字
          </button>
        </div>
      </header>

      <main className="site-main">
        <Outlet />
      </main>

      <nav className="bottom-nav" aria-label="主要導覽">
        {NAV_ITEMS.map((item) => (
          <NavLink key={item.to} to={item.to} className="bottom-nav-link">
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
