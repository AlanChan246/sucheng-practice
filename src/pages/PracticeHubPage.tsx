import { Link } from 'react-router-dom'

const MODES = [
  {
    to: '/practice/char-to-code',
    title: '看字打碼',
    desc: '看到漢字，輸入速成碼',
  },
  {
    to: '/practice/code-to-char',
    title: '看碼選字',
    desc: '看到速成碼，選出正確的字',
  },
  {
    to: '/practice/dictation',
    title: '默寫模式',
    desc: '短暫顯示後，憑記憶打碼',
  },
]

export function PracticeHubPage() {
  return (
    <div className="page-stack">
      <header className="page-header page-header--center">
        <h1>選一種方式開始</h1>
        <p className="lede lede--center">每次 10 題，會記錄準確率與用時。</p>
      </header>

      <ul className="link-list">
        {MODES.map((mode) => (
          <li key={mode.to}>
            <Link to={mode.to} className="link-list-item">
              <span>
                <strong>{mode.title}</strong>
                <small>{mode.desc}</small>
              </span>
              <span className="link-list-arrow" aria-hidden="true">
                ›
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
