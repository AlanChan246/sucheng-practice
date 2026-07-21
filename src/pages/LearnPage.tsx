import { DemoSteps } from '../components/DemoSteps'
import { KeyboardHighlight } from '../components/KeyboardHighlight'
import { KEYBOARD_ROWS, RADICAL_BY_KEY, RADICALS } from '../lib/cangjie'
import {
  CODING_EXAMPLES,
  CODING_RULES,
  RADICAL_VARIANTS,
} from '../lib/learnContent'

export function LearnPage() {
  return (
    <div className="page-stack">
      <header className="page-header page-header--center">
        <h1>速成 = 倉頡的首碼 + 尾碼</h1>
        <p className="lede lede--center">
          先認得字根與輔根，再學會把字切開。速成只要倉頡全碼的第一個和最後一個鍵。
        </p>
      </header>

      <section className="section-block">
        <h2>24 個部首鍵位</h2>
        <div className="keyboard-layout-learn">
          {KEYBOARD_ROWS.map((row) => (
            <div key={row.join('-')} className="keyboard-row keyboard-row--learn">
              {row.map((key) => {
                const radical = RADICAL_BY_KEY[key]
                return (
                  <article key={key} className="radical-card">
                    <span className="radical-key">{key}</span>
                    <span className="radical-glyph">{radical.glyph}</span>
                    <span className="radical-name">{radical.name}</span>
                  </article>
                )
              })}
            </div>
          ))}
        </div>
      </section>

      <section className="section-block">
        <h2>字根變體辨識</h2>
        <p className="section-copy section-copy--center">
          主根會變形。形狀像同一個主根，就按同一鍵——例如「手」包含「扌」。
        </p>
        <div className="variant-grid">
          {RADICALS.map((radical) => {
            const variants = RADICAL_VARIANTS[radical.key] ?? []
            return (
              <article key={radical.key} className="variant-card">
                <header className="variant-card-head">
                  <span className="variant-card-key">{radical.key}</span>
                  <span className="variant-card-glyph">{radical.glyph}</span>
                  <span className="variant-card-name">{radical.name}</span>
                </header>
                <ul className="variant-forms">
                  {variants.map((variant, index) => (
                    <li key={`${radical.key}-${variant.form ?? 'note'}-${index}`}>
                      {variant.form ? (
                        <span className="variant-form-glyph" aria-hidden="true">
                          {variant.form}
                        </span>
                      ) : null}
                      <div className="variant-form-body">
                        <p className="variant-form-note">{variant.note}</p>
                        {variant.examples.length > 0 && (
                          <p className="variant-form-examples">
                            例：{variant.examples.join('、')}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </article>
            )
          })}
        </div>
      </section>

      <section className="section-block">
        <h2>取碼規則與邏輯</h2>
        <p className="section-copy section-copy--center">
          把漢字切開成字根，寫出倉頡全碼，再留下首尾兩鍵就是速成。
        </p>
        <ol className="rule-steps">
          {CODING_RULES.map((rule, index) => (
            <li key={rule.title}>
              <span className="rule-steps-index">{index + 1}</span>
              <div>
                <strong>{rule.title}</strong>
                <p>{rule.body}</p>
              </div>
            </li>
          ))}
        </ol>
        <h3 className="subsection-title">例字拆解</h3>
        <div className="code-breakdown">
          {CODING_EXAMPLES.map((example) => (
            <article key={example.char} className="code-breakdown-item">
              <div className="code-breakdown-char">{example.char}</div>
              <div className="code-breakdown-flow">
                <span className="code-breakdown-parts">{example.parts.join(' + ')}</span>
                <span className="code-breakdown-arrow" aria-hidden="true">
                  →
                </span>
                <span className="code-breakdown-full">
                  倉頡 {example.cangjie.toUpperCase()}
                </span>
                <span className="code-breakdown-arrow" aria-hidden="true">
                  →
                </span>
                <span className="code-breakdown-quick">
                  速成 {example.quick.toUpperCase()}
                </span>
              </div>
              <p className="code-breakdown-note">{example.note}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block section-split">
        <div>
          <h2>鍵盤怎麼對</h2>
          <p className="section-copy">練習時會高亮你要按的鍵。</p>
          <KeyboardHighlight highlightKeys={['A', 'B']} compact />
        </div>
        <div>
          <h2>拆碼示範</h2>
          <DemoSteps />
        </div>
      </section>

      <section className="section-block section-block--muted">
        <h2>小提示</h2>
        <ul className="tip-list">
          <li>輔根也按主根那一鍵，例如「扌」是 Q、「氵」是 E、「亻」是 O。</li>
          <li>單一字根的字，速成碼就是那個鍵，例如「日」是 A。</li>
          <li>兩個字根通常剛好兩鍵，例如「明」是 AB。</li>
          <li>字根很多時，只記第一個和最後一個。</li>
          <li>空心「口」與有內容的外框「囗」不同：後者屬田（W）。</li>
        </ul>
      </section>
    </div>
  )
}
