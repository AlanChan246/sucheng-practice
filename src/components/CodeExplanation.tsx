import { RADICAL_BY_KEY } from '../lib/cangjie'
import { CODING_EXAMPLES } from '../lib/learnContent'
import type { DictEntry } from '../types'

export function CodeExplanation({ entry }: { entry: Pick<DictEntry, 'char' | 'cangjie' | 'quick'> }) {
  const example = CODING_EXAMPLES.find(e => e.char === entry.char)
  const keys = [...entry.quick.toUpperCase()]
  return <div className="code-explanation">
    <div className="root-pair">{keys.map((key, i) => <div className="root-piece" key={`${i}-${key}`}><small>{keys.length === 1 ? '一碼字根' : i === 0 ? '首碼' : '尾碼'}</small><span>{RADICAL_BY_KEY[key]?.name}<b>{key}</b></span></div>)}</div>
    <p>{example?.note ?? `「${entry.char}」的倉頡碼是 ${entry.cangjie.toUpperCase()}，${keys.length === 1 ? '只有一碼，直接用這一鍵。' : '速成留下第一碼和最後一碼。'}`}</p>
    <p className="full-code">倉頡 <code>{[...entry.cangjie.toUpperCase()].map((c, i, all) => <span key={i} className={i === 0 || i === all.length - 1 ? 'kept-code' : ''}>{c}</span>)}</code><span aria-hidden="true"> → </span>速成 <code>{entry.quick.toUpperCase()}</code></p>
  </div>
}
