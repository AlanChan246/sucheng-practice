export const LEVELS_PER_CHAPTER = 10

export function getChapterCount(totalLevels: number): number {
  return Math.ceil(totalLevels / LEVELS_PER_CHAPTER)
}

export function getChapterIndex(levelId: number): number {
  return Math.ceil(levelId / LEVELS_PER_CHAPTER)
}

export function getChapterTitle(chapterIndex: number): string {
  return `第 ${chapterIndex} 章`
}

export function getChapterLevelIds(chapterIndex: number, totalLevels: number): number[] {
  const start = (chapterIndex - 1) * LEVELS_PER_CHAPTER + 1
  const end = Math.min(chapterIndex * LEVELS_PER_CHAPTER, totalLevels)
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
}

export function getChapterRangeLabel(chapterIndex: number, totalLevels: number): string {
  const ids = getChapterLevelIds(chapterIndex, totalLevels)
  if (!ids.length) return ''
  return `關卡 ${ids[0]}-${ids[ids.length - 1]}`
}
