export const LESSONS = [
  { id: 'first-pair', title: '日和月，合起來是明', description: '先認識 A、B；一碼字根和兩碼字都試一次。', keys: ['A', 'B'], example: '明', chars: ['日', '月', '明'], note: '左邊的日是 A，右邊的月是 B。先按 A，再按 B，就打出「明」。' },
  { id: 'first-last', title: '三個字根，也只取首尾', description: '木、林、森：字根多了，速成碼仍然很短。', keys: ['D'], example: '森', chars: ['木', '林', '森'], note: '森的倉頡碼是 DDD；取第一個 D 和最後一個 D，就是速成 DD。林和森可以同碼。' },
  { id: 'more-roots', title: '手、水、人，慢慢認多一點', description: '把常見字根連到 Q、E、O 三個鍵。', keys: ['Q', 'E', 'O'], example: '手', chars: ['手', '水', '人'], note: '先認字根本身：手 Q、水 E、人 O。之後遇到偏旁，會更容易找到對應的鍵。' },
  { id: 'changing-shapes', title: '形狀變了，還是同一字根', description: '從扌和氵，找到「打」與「河」的首碼。', keys: ['Q', 'E', 'N', 'R'], example: '打', chars: ['打', '河', '水'], note: '扌是手的輔根，按 Q；氵是水的輔根，按 E。「打」全碼 QMN，留下首尾就是 QN。' },
  { id: 'inside-outside', title: '看清外框，再取首尾', description: '口、田、困：空心口和有內容的外框不同。', keys: ['R', 'W', 'D'], example: '困', chars: ['口', '田', '困'], note: '「困」外面的囗屬田 W，裡面的木是 D，所以速成碼是 WD。空心「口」則是 R。' },
  { id: 'try-together', title: '合起來，自己試', description: '用「好」和「晶」再確認一次首尾取碼。', keys: ['V', 'N', 'D', 'A'], example: '好', chars: ['女', '子', '好', '晶'], note: '「好」的倉頡碼是 VND：女、弓、木。速成取女 V 和木 D，留下 VD。' },
] as const
export function nextLesson(completed: Record<string, { completed: boolean }>) { return LESSONS.find(l => !completed[l.id]?.completed) }
