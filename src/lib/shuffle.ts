export function shuffle<T>(items: T[]): T[] {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export function pickRandom<T>(items: T[]): T | undefined {
  if (!items.length) return undefined
  return items[Math.floor(Math.random() * items.length)]
}

export function pickDistractors<T>(
  pool: T[],
  correct: T,
  count: number,
  key: (item: T) => string | number,
): T[] {
  const others = pool.filter((item) => key(item) !== key(correct))
  return shuffle(others).slice(0, count)
}
