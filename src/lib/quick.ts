export function normalizeQuick(input: string): string {
  return input.toLowerCase().replace(/[^a-z]/g, '')
}

export function toQuickFromCangjie(cangjieCode: string): string {
  const code = normalizeQuick(cangjieCode)
  if (!code) return ''
  if (code.length === 1) return code
  return code[0] + code[code.length - 1]
}

export function isQuickMatch(input: string, expected: string): boolean {
  return normalizeQuick(input) === normalizeQuick(expected)
}

export function getHighlightKeys(code: string): string[] {
  const normalized = normalizeQuick(code)
  if (!normalized) return []
  if (normalized.length === 1) return [normalized.toUpperCase()]
  return [
    normalized[0].toUpperCase(),
    normalized[normalized.length - 1].toUpperCase(),
  ]
}
