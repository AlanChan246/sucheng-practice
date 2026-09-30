# 完整 Slop catalog 核對表

來源：[當前 Impeccable Slop catalog](https://impeccable.style/slop/)，2026-09-30（Asia/Hong_Kong）擷取，**67 項／9 組**。初始核對表於 UI 修改前建立；本版填入完整逐項證據。原始 HTML／JSON／SHA-256：[catalog.json](qa/slop/catalog.json)。

目標：[使用者指定本機預覽](http://127.0.0.1:4173/sucheng-practice/)；source `src/` 與 `index.html`。使用者澄清本網站就是速成練習；不存在公開搜尋／後台，對應範圍為公開學習與練習、本機足跡與設定管理。

**覆蓋不以 findings 數量代替。** S＝source detector；B＝三尺寸 browser detector；D＝獨立設計評審與主代理情境判定；T＝技術量測。當前 catalog 49 Source／12 Browser／6 Design review；bundled registry 59 條，8 條缺口全部以直接檢查補足。沒有新增 ignore；config 仍只有 buildPath。

修正前 source 110 advisory；修正後仍保留 2 radius advisory。最後完整 batch 為 37 狀態×3尺寸×2主題設定＝222 格；另補 loading 六格，共 **38 狀態／228 格**，以及 shared nav／統計說明的18格定點確認。fixture browser為隔離 Chrome contexts，不讀寫使用者 browser profile。原生 IAB 另實走真實操作；二者證據分開。

| # | 組別 | Catalog 項目／ID | 檢查方法 | 證據與判定 | 狀態 |
| --- | --- | --- | --- | --- | --- |
| 1 | Your design system | [Font outside DESIGN.md](https://impeccable.style/slop/#rule-design-system-font) `design-system-font` | S＋CSS／DESIGN 對照＋B 字體載入 | src/index.css:2–4、DESIGN.md typography；228 格 fontsLoaded／字體 requests，Noto Sans TC + 碼字 monospace。 | 檢查無問題 |
| 2 | Your design system | [Color outside DESIGN.md](https://impeccable.style/slop/#rule-design-system-color) `design-system-color` | S＋light/dark token／B computed theme | src/index.css:5–44；兩主題實際畫面／detector 無 low-contrast；深色儲存拒絕情境明列 fallback light。 | 檢查無問題 |
| 3 | Your design system | [Radius outside DESIGN.md](https://impeccable.style/slop/#rule-design-system-radius) `design-system-radius` | S＋形狀角色核對 | source-after.json 保留 2 advisory（CSS:155 的單一右上角 28px、CSS:280 的 30px）；DESIGN.md 記錄 0 28px 0 0／0 30px 0 0，parser 未辨識 asymmetric shorthand。鍵帽／進度標記用途已人工確認。 | 有理由保留 |
| 4 | Your design system | [Font size outside DESIGN.md](https://impeccable.style/slop/#rule-design-system-font-size) `design-system-font-size` | S＋元件角色／breakpoint 核對 | 修正前 97 個 font-size advisory；14px 可讀性下限實際修正，DESIGN.md 補記現有教學字、碼字與 breakpoint 角色；source-after 已無此 advisory，未添加忽略。 | 已修正並回歸 |
| 5 | Visual Details | [Decorative grid-line background](https://impeccable.style/slop/#rule-codex-grid-background) `codex-grid-background` | S＋精確 CSS 搜尋＋B／D 畫面 | src/index.css 全文／source-before、source-after.json；沒有裝飾 grid／雙軸 background gradients。 | 檢查無問題 |
| 6 | Visual Details | [Border accent on rounded element](https://impeccable.style/slop/#rule-border-accent-on-rounded) `border-accent-on-rounded` | S＋B 控件上下文 | 無厚 accent card border；AnswerInput 底線及 keycap 正確鍵 outline 是操作／狀態訊號，非裝飾卡片。CSS:148、135，input-wrong 三尺寸畫面。 | 檢查無問題 |
| 7 | Visual Details | [Glassmorphism everywhere](https://impeccable.style/slop/#rule-glassmorphism) `glassmorphism` | D＋CSS 手查＋B 截圖 | Bundled registry 不含此條；CSS 無 backdrop-filter／玻璃疊層，主頁、課堂、作答、足跡兩主題是實色。 | 檢查無問題 |
| 8 | Visual Details | [Side-tab accent border](https://impeccable.style/slop/#rule-side-tab) `side-tab` | S＋精確 CSS 搜尋＋B／D 畫面 | src/index.css 全文／source-before、source-after.json；沒有 border-left／border-right accent。 | 檢查無問題 |
| 9 | Visual Details | [Hairline border with wide shadow](https://impeccable.style/slop/#rule-gpt-thin-border-wide-shadow) `gpt-thin-border-wide-shadow` | S＋精確 CSS 搜尋＋B／D 畫面 | src/index.css 全文／source-before、source-after.json；內容列表只用 1px divider；offset soft shadow 集中在可按鍵帽。 | 檢查無問題 |
| 10 | Visual Details | [Repeating-gradient stripes](https://impeccable.style/slop/#rule-repeating-stripes-gradient) `repeating-stripes-gradient` | S＋精確 CSS 搜尋＋B／D 畫面 | src/index.css 全文／source-before、source-after.json；沒有 repeating-gradient。 | 檢查無問題 |
| 11 | Visual Details | [Extreme border-radius on cards](https://impeccable.style/slop/#rule-over-round) `over-round` | D＋radius 角色核對＋B 截圖 | Bundled registry 不含此條；按鈕／鍵帽 7–13px，內容用開放列表；28／30px 是原已批准的單一右上角提示形狀，不是通用 capsule cards。 | 有理由保留 |
| 12 | Visual Details | [Rough SVG illustrations](https://impeccable.style/slop/#rule-sketchy-svg) `sketchy-svg` | D＋live 圖像用途檢查 | Bundled registry 不含此條；live UI 用 lucide-react 線條圖示與字根，不使用 sketch scene；未載入 src/assets 的舊樣本圖片。 | 檢查無問題 |
| 13 | Typography | [Label above a heading](https://impeccable.style/slop/#rule-kicker-above-heading) `kicker-above-heading` | S＋D 標題上下文 | Home／Learn／PracticeHub／Progress 沒有 kicker；練習問題指令在漢字前是作答指示，不是 section heading 上的裝飾標籤。 | 檢查無問題 |
| 14 | Typography | [Tiny interface text](https://impeccable.style/slop/#rule-undersized-ui-text) `undersized-ui-text` | S＋B computed font size | CSS 原有 11–13px controls／instructions 提高至 14px；final mobile／tablet／desktop home-first、learn、progress-expanded 的 smallText 均為空，228 格皆有原始 measurement。 | 已修正並回歸 |
| 15 | Typography | [Flat type hierarchy](https://impeccable.style/slop/#rule-flat-type-hierarchy) `flat-type-hierarchy` | S＋B 字級／weight＋D 情境判定 | 保留 browser 20 次原始訊號；短空／錯誤頁的 27–30px bold h1 對 14–16px 內文，標題仍清楚。Detector 使用全頁 max/min <2 的粗閾值；不是缺失標題層次。 | 有理由保留 |
| 16 | Typography | [Icon tile stacked above heading](https://impeccable.style/slop/#rule-icon-tile-stack) `icon-tile-stack` | S＋D 成功狀態上下文 | 沒有 feature icon-tile cards。SessionComplete 的完成勾號是狀態標記；native 三題完成已操作核驗，非 feature-grid 模板。 | 檢查無問題 |
| 17 | Typography | [Italic serif display headline](https://impeccable.style/slop/#rule-italic-serif-display) `italic-serif-display` | S＋B font style | CSS 無 italic serif display；中文 Noto Sans TC、碼字 monospace。 | 檢查無問題 |
| 18 | Typography | [Badge above the main headline](https://impeccable.style/slop/#rule-hero-eyebrow-chip) `hero-eyebrow-chip` | S＋D 首頁／主要標題 | 無 headline badge／pill，HomePage 主題直接是明與 A/B。 | 檢查無問題 |
| 19 | Typography | [Oversized hero headline](https://impeccable.style/slop/#rule-oversized-h1) `oversized-h1` | S＋B 首屏三尺寸 | h1 max 58px；184px 漢字是可觀察的 specimen，非長句 hero headline。手機首頁改 104px specimen；A/B bottom=744.58px < navTop=776px。 | 已修正並回歸 |
| 20 | Typography | [Crushed letter spacing](https://impeccable.style/slop/#rule-extreme-negative-tracking) `extreme-negative-tracking` | S＋D 中文辨識 | h1 -.035em、品牌 -.04em，未超過 craft floor；三尺寸實際中文標題可辨識。 | 檢查無問題 |
| 21 | Typography | [Overused font](https://impeccable.style/slop/#rule-overused-font) `overused-font` | S＋B 使用字體 | Noto Sans TC 負責繁中，SFMono/Consolas 等僅作 A–Z code；無 Inter／Geist display。 | 檢查無問題 |
| 22 | Typography | [Single font for everything](https://impeccable.style/slop/#rule-single-font) `single-font` | D＋字體用途／層級 | Bundled registry 無此條；中文同一家族保留字根一致性，以大小／weight 分層，碼字獨立 monospace；既有產品字形需求支持這個選擇。 | 有理由保留 |
| 23 | Typography | [All-caps body text](https://impeccable.style/slop/#rule-all-caps-body) `all-caps-body` | S＋D copy 檢查 | 只有速成碼及鍵字 A–Z 大寫；繁中內文無長篇全大寫英文。 | 檢查無問題 |
| 24 | Color & Contrast | [Radial-gradient background halo](https://impeccable.style/slop/#rule-radial-halo) `radial-halo` | S＋精確 CSS 搜尋＋B／D 畫面 | src/index.css 全文／source-before、source-after.json；沒有 radial-gradient。 | 檢查無問題 |
| 25 | Color & Contrast | [Soft spotlight behind content](https://impeccable.style/slop/#rule-radial-spotlight-glow) `radial-spotlight-glow` | S＋精確 CSS 搜尋＋B／D 畫面 | src/index.css 全文／source-before、source-after.json；沒有 spotlight／glow。 | 檢查無問題 |
| 26 | Color & Contrast | [AI color palette](https://impeccable.style/slop/#rule-ai-color-palette) `ai-color-palette` | S＋D palette／B themes | 暖紙、深墨、青檸來自已批准 A 方向；無紫色漸層／cyan-on-dark defaults。 | 檢查無問題 |
| 27 | Color & Contrast | [Dark mode with glowing accents](https://impeccable.style/slop/#rule-dark-glow) `dark-glow` | S＋B dark screenshots | 深色以同名 semantic tokens 切換；沒有 neon border／zero-offset glow。 | 檢查無問題 |
| 28 | Color & Contrast | [Gradient text](https://impeccable.style/slop/#rule-gradient-text) `gradient-text` | S＋精確 CSS 搜尋＋B／D 畫面 | src/index.css 全文／source-before、source-after.json；沒有 background-clip text／漸層標題。 | 檢查無問題 |
| 29 | Color & Contrast | [Gray text on colored background](https://impeccable.style/slop/#rule-gray-on-color) `gray-on-color` | S＋B actual contrast detector | muted=#576450／dark #bdcbb2 為灰綠 tint；hint/success/surface 上的文字和 focus 實際檢查，未出 low-contrast。 | 檢查無問題 |
| 30 | Color & Contrast | [Cream / beige palette](https://impeccable.style/slop/#rule-cream-palette) `cream-palette` | S＋D 既有產品決策／B raw findings | 所有 cream-palette 原始 findings 完整保留。PRODUCT.md Approved Direction／DESIGN.md 已批准暖紙、青檸鍵帽與深墨，教學上下文有明確用途；未變色清零／未 ignore。 | 有理由保留 |
| 31 | Layout & Space | [Tiny numbered section labels](https://impeccable.style/slop/#rule-numbered-section-labels) `numbered-section-labels` | S＋D sequence 用途 | 課程 01–06、關卡編號、小節足跡都是有順序的學習進程；沒有裝飾 section 01/02/03 kicker。 | 檢查無問題 |
| 32 | Layout & Space | [Cards flush against the scroller edge](https://impeccable.style/slop/#rule-edge-flush-cards) `edge-flush-cards` | B 三尺寸 scroller／D 邊界 | 無卡片橫向 scroller；唯一 table-scroll 明確限於詳細紀錄，頁面兩側留 20px+。228 格 raw browser detector。 | 檢查無問題 |
| 33 | Layout & Space | [Text covered by another element](https://impeccable.style/slop/#rule-text-occlusion) `text-occlusion` | B detector＋人工 fixed nav／native 操作 | 無 detector text-occlusion finding；固定 nav 在 full-page PNG 中固定於首個 viewport，不能誤讀為整頁永久遮蓋。手機 A/B 完整可見，長頁可捲動，底部有 nav/safe-area padding；一般正文受覆蓋的瞬間可捲至上方。 | 檢查無問題 |
| 34 | Layout & Space | [Unbalanced opening columns](https://impeccable.style/slop/#rule-first-viewport-column-overflow) `first-viewport-column-overflow` | B raw findings＋flex-direction／D geometry | 保留 20 次原始訊號，命中 div.app-shell；CSS:73 是 flex-direction:column，header/main/footer 是垂直排序，非雙欄 hero。實際 .home-pair／.lesson-composition 三尺寸另經截圖核對。 | 有理由保留 |
| 35 | Layout & Space | [Heading closer to the previous section](https://impeccable.style/slop/#rule-heading-rhythm) `heading-rhythm` | B detector＋computed headings／D 組群 | 各 section 38–54px 外部間隔、h2 後 12px；learn、progress、hub 有 distinct group spacing，未出 heading-rhythm finding。 | 檢查無問題 |
| 36 | Layout & Space | [Hero metric layout](https://impeccable.style/slop/#rule-hero-metric-layout) `hero-metric-layout` | D＋source hierarchy | Bundled registry 無此條；首頁先教一個字，練習大字是題目，足跡數字是內文，沒有 big-number hero/stats 模板。 | 檢查無問題 |
| 37 | Layout & Space | [Identical card grids](https://impeccable.style/slop/#rule-identical-card-grids) `identical-card-grids` | D＋component 功能 | Bundled registry 無此條；課程／模式為平面列表。字根鍵盤與四個選字選項需同規格以利作答，非同權重 marketing feature cards。 | 有理由保留 |
| 38 | Layout & Space | [Monotonous spacing](https://impeccable.style/slop/#rule-monotonous-spacing) `monotonous-spacing` | S＋D spacing scale／B 群組 | 內部 8–18px、controls 20–26px、段落 38–56px，課程與統計群組具節奏。 | 檢查無問題 |
| 39 | Layout & Space | [Nested cards](https://impeccable.style/slop/#rule-nested-cards) `nested-cards` | S＋D DOM／B 回饋 | 無 cards-inside-cards；CodeExplanation 在單一答案回饋／提示色面中使用文字與 root-pair，不再各自包 card。 | 檢查無問題 |
| 40 | Layout & Space | [Line length too long](https://impeccable.style/slop/#rule-line-length) `line-length` | B detector＋CSS measure＋D 繁中閱讀 | lede 44／52ch、說明 max 70ch；CJK glyph 約佔雙 ch，不把英文 75 字元閾值直接當中文需求。228 格無 line-length finding。 | 檢查無問題 |
| 41 | Layout & Space | [Content overflowing its container](https://impeccable.style/slop/#rule-text-overflow) `text-overflow` | B detector＋實測 scrollWidth | 228 格 scrollWidth≤innerWidth，native 最後一章手機亦無溢出；詳細成績有獨立水平捲動區。 | 檢查無問題 |
| 42 | Layout & Space | [Clipped menus and popovers](https://impeccable.style/slop/#rule-clipped-overflow-container) `clipped-overflow-container` | B expanded native select／details＋S overflow | learn-expanded／progress-expanded 六格各自實測；chapter native select，無自製 menu／popover。table-scroll 為獨立成績容器，不包住浮層。 | 檢查無問題 |
| 43 | Motion | [Pulsing status dot](https://impeccable.style/slop/#rule-pulsing-dot) `pulsing-dot` | S＋精確 CSS 搜尋＋B／D 畫面 | src/index.css 全文／source-before、source-after.json；靜態正確鍵小點無 animation。 | 檢查無問題 |
| 44 | Motion | [Decorative blinking cursor](https://impeccable.style/slop/#rule-blinking-cursor) `blinking-cursor` | B＋D 功能上下文 | 只有真正 AnswerInput 的 caret；靜態文案沒有 terminal cursor。 | 檢查無問題 |
| 45 | Motion | [Auto-scrolling marquee](https://impeccable.style/slop/#rule-marquee) `marquee` | S＋精確 CSS 搜尋＋B／D 畫面 | src/index.css 全文／source-before、source-after.json；沒有 marquee／自動捲動文字。 | 檢查無問題 |
| 46 | Motion | [Bounce or elastic easing](https://impeccable.style/slop/#rule-bounce-easing) `bounce-easing` | S＋精確 CSS 搜尋＋B／D 畫面 | src/index.css 全文／source-before、source-after.json；cubic-bezier(.16,1,.3,1)，無 overshoot easing。 | 檢查無問題 |
| 47 | Motion | [Animation that changes layout](https://impeccable.style/slop/#rule-layout-transition) `layout-transition` | S＋B motion | 進度以 scaleX，按下用 translateY，character-settle 只用 transform；沒有 width/height/margin/padding transition。reduce 保留靜態訊號。 | 檢查無問題 |
| 48 | Motion | [Images that move on hover](https://impeccable.style/slop/#rule-image-hover-transform) `image-hover-transform` | S＋精確 CSS 搜尋＋B／D 畫面 | src/index.css 全文／source-before、source-after.json；無 live image hover transform。 | 檢查無問題 |
| 49 | Copy | [Same text repeated inside one container](https://impeccable.style/slop/#rule-repeated-container-text) `repeated-container-text` | S＋D state copy／B 作答 | 指令、字形、首尾標籤分別服務不同任務；回饋保留原輸入與正確碼是必要核對，不是 card label 重複。 | 檢查無問題 |
| 50 | Copy | [Em-dash overuse](https://impeccable.style/slop/#rule-em-dash-overuse) `em-dash-overuse` | S＋B raw text／D table semantics | 保留 6 次 browser advisory；進度空統計表中的 8 個「—」代表沒有成績，是 data placeholder，未用 em-dash 串正文句子。 | 有理由保留 |
| 51 | Copy | [Generic marketing claims](https://impeccable.style/slop/#rule-marketing-buzzword) `marketing-buzzword` | S＋D 繁中 copy 全路由 | 功能文案是學少少、首碼尾碼、重溫／續題，無 supercharge/world-class 等空泛承諾；source scan + native/fixture text snapshots。 | 檢查無問題 |
| 52 | Copy | [Forced contrast](https://impeccable.style/slop/#rule-aphoristic-cadence) `aphoristic-cadence` | S＋D 繁中 copy 全路由 | 沒有 Not X. Y. 式強迫對比 slogan；說明直接指向操作；source scan + native/fixture text snapshots。 | 檢查無問題 |
| 53 | Copy | [Calling things “theater”](https://impeccable.style/slop/#rule-theater-slop-phrase) `theater-slop-phrase` | S＋D 繁中 copy 全路由 | 沒有 theater／performative 式貶抑文案；source scan + native/fixture text snapshots。 | 檢查無問題 |
| 54 | Imagery | [Placeholder-style illustrations](https://impeccable.style/slop/#rule-shape-assembled-illustration) `shape-assembled-illustration` | S／D 用途＋B DOM／assets | live UI 不用幾何拼裝場景插畫；A/B 鍵帽是產品實際操作模型 | 不適用（未使用此類圖像） |
| 55 | Imagery | [Jagged image masks](https://impeccable.style/slop/#rule-organic-clip-path) `organic-clip-path` | S／D 用途＋B DOM／assets | live UI 無 image masks／clip-path；此條 bundled registry 不含，已直接搜尋 CSS/TSX | 不適用（未使用此類圖像） |
| 56 | Imagery | [Images hidden under overlays](https://impeccable.style/slop/#rule-buried-raster) `buried-raster` | S／D 用途＋B DOM／assets | live UI 無 raster images／覆蓋層；此條 bundled registry 不含，已手查 DOM | 不適用（未使用此類圖像） |
| 57 | Imagery | [Broken or placeholder image](https://impeccable.style/slop/#rule-broken-image) `broken-image` | S／D 用途＋B DOM／assets | 228 格 brokenImages=[]；live pages 沒有 img，favicon及字體 request正常，故不存在 placeholder image path | 不適用（未使用此類圖像） |
| 58 | General quality | [JavaScript errors on load](https://impeccable.style/slop/#rule-script-error) `script-error` | B pageerror＋native console＋storage fault | index.html:7 為 sessionStorage deep-link bootstrap 加入 try/catch；storage-unavailable 六格真正拒絕讀取時頁面仍可用；228 格 errors=[]，native console亦沒有 warn/error。 | 已修正並回歸 |
| 59 | General quality | [Content stuck waiting to appear](https://impeccable.style/slop/#rule-content-hidden-at-rest) `content-hidden-at-rest` | B reveal sweep＋loading／error states＋S CSS | 228 格未出 hidden-at-rest；dictionary-loading 六格顯示「字庫準備中…」，503 六格提供 retry，內容未依賴 opacity:0 entrance。 | 檢查無問題 |
| 60 | General quality | [Cramped padding](https://impeccable.style/slop/#rule-cramped-padding) `cramped-padding` | B detector＋T 控件尺寸＋D | 主按鈕 54px、鍵帽 52px+；最終 desktop nav 補 min-width44，home/learn/progress-expanded 18 格定點確認 smallTargets=[]。 | 已修正並回歸 |
| 61 | General quality | [Body text touching the page edge](https://impeccable.style/slop/#rule-body-text-viewport-edge) `body-text-viewport-edge` | B＋CSS＋D three widths | 一般手機 main 350px／390px viewport，兩側20px；@360px 仍留12px，三尺寸文字未贴邊。 | 檢查無問題 |
| 62 | General quality | [Justified text](https://impeccable.style/slop/#rule-justified-text) `justified-text` | S＋精確 CSS 搜尋＋B／D 畫面 | src/index.css 全文／source-before、source-after.json；正文未使用 text-align:justify。 | 檢查無問題 |
| 63 | General quality | [Low-contrast text](https://impeccable.style/slop/#rule-low-contrast) `low-contrast` | S tokens＋B computed/visual fallback＋D | 兩主題原始 browser detector 無 low-contrast finding；light/dark snapshots 中正文、placeholder、hint、success及focus均可讀。不能據此声称完整 WCAG认证。 | 檢查無問題 |
| 64 | General quality | [Skipped heading level](https://impeccable.style/slop/#rule-skipped-heading) `skipped-heading` | S＋B actual heading arrays | 各主要頁面 h1→h2；錯誤空頁只需 h1，無跳過 h2 的 h3。228 格 headings 記錄保留。 | 檢查無問題 |
| 65 | General quality | [Tight line height](https://impeccable.style/slop/#rule-tight-leading) `tight-leading` | S＋B computed styles＋D | 正文1.75、lede1.85、標題1.35–1.5；根字/code短標籤1.4，非段落過密。 | 檢查無問題 |
| 66 | General quality | [Tiny body text](https://impeccable.style/slop/#rule-tiny-text) `tiny-text` | S＋B＋D readability | 原首頁11px input-hint confirmed；輔助文字提升至14px，三尺寸／兩主題 tiny-text findings 消失，實際畫面及原始 measurement 同時保存。 | 已修正並回歸 |
| 67 | General quality | [Wide letter spacing on body text](https://impeccable.style/slop/#rule-wide-tracking) `wide-tracking` | S＋D text role | 正文 default tracking；.19em 只用速成碼答案框，.11em 品牌短標籤，非長篇 body。 | 檢查無問題 |

## 證據入口

- [技術 audit／設計評審／修正與限制](slop-audit.md)
- [逐格 browser 原始 JSON](qa/slop/after/matrix.json)：包含 route/state、theme、findings、errors、resource bytes、字體、heading、overflow、control size。
- [修正前 source](qa/slop/source-before.json)／[修正後 source](qa/slop/source-after.json)；[彙總](qa/slop/summary.json)；[engine provenance](qa/slop/engine-provenance.json)。
- `docs/qa/slop/after/{desktop,tablet,mobile}-{light,dark}-{scenario}.png`：已實際開啟代表完整流程圖像核對；不是以空 scanner 結果推算。

## 不能執行／未能完整驗證的檢查

| 檢查 | 實際界限 | 替代證據／仍未證實的部分 |
| --- | --- | --- |
| 原生 IAB live overlay injection | IAB evaluate 僅唯讀，不能注入 detector script | 改用未修改的官方 URL engine + Puppeteer隔離執行；未聲稱有使用者可見 overlay |
| 真實 iOS／Android／IME／軟鍵盤遮擋 | 只有桌面 Chrome／IAB 的 viewport，沒有實機 | 已操作頁面字根鍵及裝置鍵盤切換；不當成真實觸控／IME證明 |
| VoiceOver／NVDA／TalkBack | 本次沒有可控輔助技術 session | ARIA、原生 list/link、heading及鍵盤 focus 已查；不等於 screen-reader實測 |
| 200%／400% browser zoom、text-only enlargement | IAB能力只有viewport，未以DPR假冒zoom | 三尺寸重排已量測，放大仍未實證 |
| Safari／Firefox runtime | 本輪 detector在Chrome，IAB也屬其自身runtime | 沒有宣稱跨瀏覽器完整通過 |
| Field LCP／INP／CLS、受控慢網路／CPU benchmark | 此次沒有field data／性能基準工具 | 已保存實際local resource bytes及font載入，但不能推算真實手機速度 |
| native清除確認／取消 | 評審時click誤觸確認，清除了IAB預覽進度；原狀無法重建 | 主代理不重做破壞性操作；Happy DOM disposable測試實驗取消保留、確認清除及保留主題。完整限制已記錄 |
| completion／首頁 local-feedback 狀態的official URL detector | fresh URL重啟finished session；首頁feedback是局部React state，沒有持久化detector state hook | IAB真正完成首頁答错/重試/成功及三題完成；source與DOMtests補足，不冒稱此類狀態已有URL fixture detector |

所有67條都有檢查紀錄；以上限制是方法／裝置／狀態的覆蓋邊界，不能以「0 findings」移除。
