import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const CHARS_PER_LEVEL = 25

function toQuick(cangjieCode) {
  const code = cangjieCode.toLowerCase().replace(/[^a-z]/g, '')
  if (!code) return ''
  if (code.length === 1) return code
  return code[0] + code[code.length - 1]
}

function parseCangjieDict(content) {
  const map = new Map()
  let inData = false

  for (const line of content.split('\n')) {
    if (line.trim() === '...') {
      inData = true
      continue
    }
    if (!inData || !line.trim() || line.startsWith('#')) continue

    const parts = line.split('\t')
    const char = parts[0]?.trim()
    const code = parts[1]?.trim()
    if (!char || !code || char.length !== 1 || /[\s#]/.test(char)) continue
    if (!map.has(char)) map.set(char, code)
  }

  return map
}

function buildLevels(entries) {
  const levels = []
  for (let i = 0; i < entries.length; i += CHARS_PER_LEVEL) {
    const chunk = entries.slice(i, i + CHARS_PER_LEVEL)
    levels.push({
      id: levels.length + 1,
      title: `第 ${levels.length + 1} 關`,
      charIds: chunk.map((e) => e.id),
    })
  }
  return levels
}

const charLines = readFileSync(join(root, 'data/char.txt'), 'utf8')
  .split('\n')
  .map((l) => l.trim())
  .filter(Boolean)

const cangjieMap = parseCangjieDict(
  readFileSync(join(root, 'data/cangjie5.dict.yaml'), 'utf8'),
)

const entries = []
const missing = []

charLines.forEach((char, index) => {
  const cangjie = cangjieMap.get(char)
  if (!cangjie) {
    missing.push(char)
    return
  }
  const quick = toQuick(cangjie)
  entries.push({
    id: index + 1,
    char,
    cangjie,
    quick,
    rank: index + 1,
  })
})

const levels = buildLevels(entries)
const output = {
  version: 1,
  generatedAt: new Date().toISOString(),
  totalChars: entries.length,
  missingCount: missing.length,
  charsPerLevel: CHARS_PER_LEVEL,
  entries,
  levels,
}

const outDir = join(root, 'public')
mkdirSync(outDir, { recursive: true })
writeFileSync(join(outDir, 'sucheng-dict.json'), JSON.stringify(output, null, 2))

console.log(`Built dictionary: ${entries.length} chars, ${levels.length} levels`)
if (missing.length) {
  console.log(`Skipped ${missing.length} chars without cangjie mapping`)
  console.log(`Examples: ${missing.slice(0, 20).join(' ')}`)
}
