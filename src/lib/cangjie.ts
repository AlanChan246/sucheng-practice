export const RADICALS = [
  { key: 'A', name: '日', glyph: '日' },
  { key: 'B', name: '月', glyph: '月' },
  { key: 'C', name: '金', glyph: '金' },
  { key: 'D', name: '木', glyph: '木' },
  { key: 'E', name: '水', glyph: '水' },
  { key: 'F', name: '火', glyph: '火' },
  { key: 'G', name: '土', glyph: '土' },
  { key: 'H', name: '竹', glyph: '竹' },
  { key: 'I', name: '戈', glyph: '戈' },
  { key: 'J', name: '十', glyph: '十' },
  { key: 'K', name: '大', glyph: '大' },
  { key: 'L', name: '中', glyph: '中' },
  { key: 'M', name: '一', glyph: '一' },
  { key: 'N', name: '弓', glyph: '弓' },
  { key: 'O', name: '人', glyph: '人' },
  { key: 'P', name: '心', glyph: '心' },
  { key: 'Q', name: '手', glyph: '手' },
  { key: 'R', name: '口', glyph: '口' },
  { key: 'S', name: '尸', glyph: '尸' },
  { key: 'T', name: '廿', glyph: '廿' },
  { key: 'U', name: '山', glyph: '山' },
  { key: 'V', name: '女', glyph: '女' },
  { key: 'W', name: '田', glyph: '田' },
  { key: 'X', name: '難', glyph: '難' },
  { key: 'Y', name: '卜', glyph: '卜' },
  { key: 'Z', name: '重', glyph: '重' },
] as const

export const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
] as const

export const RADICAL_BY_KEY = Object.fromEntries(
  RADICALS.map((r) => [r.key, r]),
) as Record<string, (typeof RADICALS)[number]>

export { DEMO_CHARS } from './learnContent'
