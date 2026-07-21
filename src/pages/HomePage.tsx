import { Link } from 'react-router-dom'

export function HomePage() {
  return (
    <section className="hero hero--product hero--lily">
      <div className="hero-visual">
        <div className="hero-circle">
          <img
            src={`${import.meta.env.BASE_URL}hero-practice.png`}
            alt="在安靜書桌上練習打字"
            width={840}
            height={840}
          />
        </div>
      </div>
      <div className="hero-copy hero-copy--lily">
        <p className="hero-brand">速成練習</p>
        <h1>拆兩個鍵，打出一個字</h1>
        <p className="lede">
          24 個部首鍵位，看字打碼、默寫過關。全部在本機完成。
        </p>
        <div className="hero-actions hero-actions--lily">
          <Link className="btn btn-primary" to="/learn">
            開始學習
          </Link>
          <Link className="btn btn-secondary" to="/practice">
            練習
          </Link>
        </div>
      </div>
    </section>
  )
}
