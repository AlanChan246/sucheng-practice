export type RadicalVariant = {
  /** Unicode glyph when available; omit for stroke-only shapes described in note */
  form?: string
  note: string
  examples: string[]
}

/** Common auxiliary forms for each main radical (Unicode-stable subset). */
export const RADICAL_VARIANTS: Record<string, RadicalVariant[]> = {
  A: [
    { form: '曰', note: '日形微變，中間橫不穿出', examples: ['書', '曹'] },
  ],
  B: [
    { form: '⺝', note: '月作偏旁時的矮形', examples: ['有', '青'] },
    { form: '肀', note: '月的變形（常見於字中）', examples: ['聿'] },
  ],
  C: [
    { form: '钅', note: '金字旁', examples: ['銀', '針'] },
    { form: '丷', note: '金下方兩點的變形', examples: ['曾', '弟'] },
  ],
  D: [
    { form: '朩', note: '木的變形', examples: ['茶'] },
  ],
  E: [
    { form: '氵', note: '三點水', examples: ['河', '清'] },
    { form: '氺', note: '水字底', examples: ['泰', '暴'] },
    { form: '又', note: '水左右筆畫相疊的變形', examples: ['双', '取'] },
  ],
  F: [
    { form: '灬', note: '四點火', examples: ['熱', '點'] },
    { form: '小', note: '火減一點的形', examples: ['少', '尖'] },
  ],
  G: [
    { form: '士', note: '土的變形（單獨成字時另拆）', examples: ['吉', '聲'] },
  ],
  H: [
    { form: '⺮', note: '竹字頭', examples: ['笑', '筆'] },
    { form: '丿', note: '斜撇，屬竹', examples: ['千', '禾'] },
  ],
  I: [
    { form: '丶', note: '點，屬戈', examples: ['主', '太'] },
    { form: '广', note: '戈向下衍生', examples: ['床', '店'] },
  ],
  J: [
    { form: '廾', note: '十兩端下垂的形', examples: ['弄', '奔'] },
  ],
  K: [
    { form: '乂', note: '撇捺交叉', examples: ['父', '文'] },
    { form: '疒', note: '病字頭，屬大', examples: ['病', '疼'] },
  ],
  L: [
    { form: '丨', note: '豎筆，屬中', examples: ['川', '引'] },
    { form: '衤', note: '衣字旁', examples: ['補', '衫'] },
  ],
  M: [
    { form: '厂', note: '橫左端下延', examples: ['原', '歷'] },
    { form: '丆', note: '一的整形', examples: ['不'] },
  ],
  N: [
    { form: '亅', note: '豎鉤', examples: ['了', '予'] },
    { form: '乛', note: '橫鉤', examples: ['买', '写'] },
  ],
  O: [
    { form: '亻', note: '單人旁', examples: ['你', '他'] },
    { form: '入', note: '人的變形', examples: ['全', '內'] },
    { form: '𠂉', note: '人的首筆變形', examples: ['每', '氣'] },
  ],
  P: [
    { form: '忄', note: '豎心旁', examples: ['情', '忙'] },
    { form: '⺗', note: '心字底', examples: ['恭', '慕'] },
    { form: '勹', note: '心中央倒轉的形', examples: ['包', '勿'] },
  ],
  Q: [
    { form: '扌', note: '提手旁', examples: ['打', '把', '指'] },
    { form: '丰', note: '手的主幹變形', examples: ['拜'] },
  ],
  R: [
    { note: '口內不能有其他筆畫；有內容則多屬田的外框', examples: ['品', '呂'] },
  ],
  S: [
    { form: '匚', note: '側形／框形', examples: ['區', '匠'] },
    { form: '己', note: '尸的相關變形', examples: ['改', '記'] },
  ],
  T: [
    { form: '艹', note: '草字頭', examples: ['花', '草'] },
    { form: '卄', note: '廿的變形', examples: ['开'] },
  ],
  U: [
    { form: '乚', note: '豎彎鉤，屬山', examples: ['亂', '札'] },
    { form: '屮', note: '山的豎筆伸長', examples: ['出'] },
  ],
  V: [
    { form: '巛', note: '女的連筆變形', examples: ['巡', '巢'] },
  ],
  W: [
    { form: '囗', note: '外框（框內有筆畫）', examples: ['困', '國', '回'] },
  ],
  X: [
    { note: '難字鍵，特殊取碼時使用，不是一般輔根', examples: [] },
  ],
  Y: [
    { form: '亠', note: '點橫，屬卜', examples: ['京', '高'] },
    { form: '辶', note: '走之旁', examples: ['這', '道'] },
  ],
  Z: [
    { note: '重碼／特殊用途，初學可先略過', examples: [] },
  ],
}

export const CODING_RULES = [
  {
    title: '定方向',
    body: '由上而下、由左而右、由外而內，依書寫順序把字切開。',
  },
  {
    title: '認字根',
    body: '切成主根或輔根。形狀像同一個主根，就按同一鍵（例如「扌」也是手 Q）。',
  },
  {
    title: '寫出倉頡全碼',
    body: '依切開順序記下每個字根對應的字母；最多取到五碼。',
  },
  {
    title: '留下速成兩鍵',
    body: '速成只要全碼的第一個和最後一個鍵。只有一碼時，速成就是那一鍵。',
  },
] as const

export type CodingExample = {
  char: string
  parts: string[]
  cangjie: string
  quick: string
  note: string
}

export const CODING_EXAMPLES: CodingExample[] = [
  {
    char: '日',
    parts: ['日'],
    cangjie: 'a',
    quick: 'a',
    note: '單一字根，速成碼就是那一個鍵',
  },
  {
    char: '明',
    parts: ['日', '月'],
    cangjie: 'ab',
    quick: 'ab',
    note: '左右結構：先日後月，全碼剛好兩鍵',
  },
  {
    char: '打',
    parts: ['扌', '丁'],
    cangjie: 'qmn',
    quick: 'qn',
    note: '提手旁「扌」屬手（Q）；丁再拆 → 全碼 QMN，速成取首尾 QN',
  },
  {
    char: '河',
    parts: ['氵', '可'],
    cangjie: 'emnr',
    quick: 'er',
    note: '三點水「氵」屬水（E）；右邊「可」繼續拆，速成取首尾 ER',
  },
  {
    char: '晶',
    parts: ['日', '日', '日'],
    cangjie: 'aaa',
    quick: 'aa',
    note: '三個字根時，速成只取第一個與最後一個',
  },
  {
    char: '好',
    parts: ['女', '木', '一'],
    cangjie: 'vnd',
    quick: 'vd',
    note: '女 + 子（子再拆木、一）→ 全碼 VND，速成 VD',
  },
  {
    char: '困',
    parts: ['囗', '木'],
    cangjie: 'wd',
    quick: 'wd',
    note: '外框「囗」屬田（W），框內有字；與空心「口」不同',
  },
]

/** Subset used by animated demos / home keyboard. */
export const DEMO_CHARS = CODING_EXAMPLES.filter((ex) =>
  ['日', '明', '晶', '好'].includes(ex.char),
).map((ex) => ({
  char: ex.char,
  cangjie: ex.cangjie,
  quick: ex.quick,
  note: ex.note,
}))
