# 速成練習：完整 catalog audit、修正與回歸

2026-09-30，Asia/Hong_Kong。目標：<http://127.0.0.1:4173/sucheng-practice/>。

**已完成 catalog 67 項的逐項核對、確認問題修正及 polish。** 原始 finding、判定理由與不能完成的檢查都保留；不是零 finding 驗收。完整清單見 [slop-checklist.md](slop-checklist.md)。

評審 provenance：2 個使用者批准的 default 唯讀子代理，Assessment A 是獨立設計評審，Assessment B 是 source/browser detector 核驗；主代理完整閱讀基礎文件與修改位置，負責取捨、所有修改及最終驗證。Assessment A 完成後才進入 detector 綜合判定。子代理不負責最終驗收。

## Implementation integrity

系統有清楚的產品用途：繁中漢字、首尾碼、字根鍵帽、短課、獨立回憶與重溫互相連結。暖紙／青檸是已有批准的 A「兩鍵合拍」方向；沒有用紫色漸層、玻璃層、裝飾網格、通用 feature cards 或捏造的 hero metrics。

當前官方 catalog 有 67 項（49 Source、12 Browser、6 Design review），bundled registry 有 59 條。8 條差異為 glassmorphism、over-round、sketchy-svg、single-font、hero-metric-layout、identical-card-grids、organic-clip-path、buried-raster，已逐項人工查 CSS／DOM／用途，不把缺少 detector rule 當通過。

`.impeccable/config.json` 仍是 `{"buildPath":"code-led"}`，沒有新增 ignore，也沒有改 threshold 或 detector。官方 browser script 的原檔／隔離副本 bytes 一致，SHA-256 見 [engine-provenance.json](qa/slop/engine-provenance.json)。

## 已修正問題

| 優先 | 問題、影響與修改 | 位置 | 驗證 |
| --- | --- | --- | --- |
| P1 | 小節連結被 `role=listitem` 覆蓋原生 link 語意；改為 ul/li/a，補完整小節名稱與完成狀態 | `src/pages/ProgressPage.tsx:22` | 真實 IAB AX 顯示六個具名稱的 links；新增 DOM 語意測試 |
| P2 | 原有 11–13px 操作／保存／首尾說明在手機偏小；提高至 14px，下方字根鍵仍保持尺寸 | `src/index.css:64` 及各輔助文字角色 | 三尺寸兩主題 computed sizes；tiny-text finding 消失；人工畫面核對 |
| P2 | 手機首次 A/B 的下緣接近固定 nav；新手 specimen 改為 104px，收緊相關垂直間距 | `src/index.css:340` 附近 | 390×844：A/B bottom 744.58px，nav top 776px；實際點按錯答／重試／成功 |
| P2 | 詳細統計「最近／最佳」語意不明，表頭與捲動區不足；加 caption、scope、可聚焦 region，說明新版評分，保留舊成績 | `src/pages/ProgressPage.tsx:24` | IAB 展開與 AX table、228 格中的 expanded fixtures、DOM headers／caption 測試 |
| P2 | 錯答輸入未以 ARIA 連結錯誤解釋；加 aria-invalid 與 aria-describedby | `src/components/AnswerInput.tsx:18`、`src/pages/HomePage.tsx:35`、`src/pages/PracticePage.tsx:119` | IAB BB 錯答取得 aria-invalid=true；DOM assert 對應 answer-feedback |
| P2 | skip-link 目標不能明確取得焦點；main 加 tabIndex=-1 | `src/components/Layout.tsx:20` | source／原生 DOM landmark 核對，保留正常 tab 順序 |
| P2 | 深連結 bootstrap 直接讀 sessionStorage，儲存被拒絕時會丟出例外；加 try/catch，其他直接路由繼續載入 | `index.html:7` | 六格 storage-unavailable 真正注入 SecurityError，沒有 uncaught pageerror，顯示儲存限制 |
| P2 | 桌面「開始／足跡」只有 36×48px；加 min-width:44px | `src/index.css:82` | 最終 home-first、learn、progress-expanded 三尺寸兩主題18格定點確認均無 smallTargets |
| P2 | DESIGN.md 只記主字級／圓角，缺少實際元件與 breakpoint 角色；補記具用途的字級、形狀與本輪語意改善 | `DESIGN.md` | source advisory 110 → 2；剩餘兩條仍保存，不加忽略 |

共 1 個 P1、8 個 P2；沒有 P0。這是問題根因數，不把 110 條 advisory 當成 110 個獨立缺陷。修正後沒有未處理的已確認 P0／P1，但不能完成的檢查仍有明確邊界。

## 保留的原始訊號與取捨

- **2 個 source radius advisory**：28px／30px 為已有設計決策的單一右上角 callout；文件保留真正 `0 28px 0 0`／`0 30px 0 0` 形狀，parser 不能辨識此 shorthand。沒有為清零把它們改成通用 token／ignore。
- **117 個 cream-palette browser findings**：每個淺色 context 都會命中，另有儲存拒絕情境從深色設定退回預設淺色。這是已批准的產品配色，不是新創理由。原始訊號全部保留。
- **20 個 flat-type-hierarchy**：短空／錯誤頁的全頁 max/min ratio <2 觸發粗閾值。27–30px bold h1 與 14–16px 內文仍有清楚層級；沒有改 detector 閾值或任意放大標題。
- **20 個 first-viewport-column-overflow**：命中 `div.app-shell` 的垂直 header/main/footer。CSS 明確 flex-direction:column；detector 未排除 column flex，被誤當雙欄。真正首頁／課堂兩欄另經畫面查驗。
- **6 個 em-dash-overuse**：空詳細統計中的「—」是沒有資料的欄位值，非正文以破折號串句。

Assessment A 提出「滿碼即送出」及 focused 練習的少量導覽。主代理以 PRODUCT.md／DESIGN.md 核對後保留：這兩項是已批准的輸入效率與專注原則，介面已明示自動送出與稍後繼續，真實連續作答也通過。不能單靠評論者偏好把它們改成已確認缺陷。

## 獨立設計評審

Design specificity：強。首頁的明／日／月、A/B 實際操作、錯答首尾解釋、重溫及足跡形成一致的學習語言。

以下為 Assessment A 修改前的獨立評分，保留原值，沒有用 detector 或主代理修正後自行灌分。

| Nielsen heuristic | 分數／4 | 觀察 |
| --- | --- | --- |
| Visibility of system status | 3 | 題組進度、保存文字、答題回饋清楚 |
| Match with real world | 4 | 首碼尾碼與香港繁中口吻符合學習 |
| User control and freedom | 3 | 能稍後繼續、收提示、重溫；自動送出是效率取捨 |
| Consistency and standards | 3 | CTA、鍵帽及回饋一致；focused 導覽不同 |
| Error prevention | 3 | 正規化、碼長限制、disabled、錯誤描邊 |
| Recognition rather than recall | 4 | 字母與字根並列，首尾直接說明 |
| Flexibility and efficiency | 3 | 實體鍵盘、頁面字根鍵、Enter、數字選字 |
| Aesthetic and minimalist design | 4 | 開放列表、留白與字形層次一致 |
| Error recovery | 3 | 正解、原因、稍後重溫及下一步 |
| Help and documentation | 2 | 詳細統計缺少背景說明，本輪已修正 |
| **總計** | **32／40** | 良好；仍有輸入控制及導覽取捨 |

Strengths：第一次任務只有兩鍵；錯題回饋給具體方法；足跡先給重溫／下一步，再展開報表。Cognitive load：完整26鍵是作答集合，不應為了四選項規則刪鍵；首次首頁用 A/B 降低負擔，進入練習後仍需讀懂一次「滿碼即作答」。情緒路徑有首次成功、溫和錯答語氣、完成後下一課／重溫承接。初學者可能在三種模式間停頓，熟手偏重鍵盤節奏；這些是觀察與取捨，未冒充真人學生研究。

Questions skipped: 使用者已要求完整 audit、修正與 polish；本輪不再詢問應修哪一項。

## 技術 audit

| 維度 | 分數／4 | 已驗證及界限 |
| --- | --- | --- |
| Accessibility | 3 | 欄／列語意、labels、回饋、named links、下一題焦點、兩主題 contrast detector；沒有實際 screen-reader 或 zoom驗證 |
| Performance | 3 | production build、實際 resource bytes、字體載入、transform motion；本機結果不等於 field Web Vitals／慢手機性能 |
| Responsive design | 3 | 三尺寸228格無頁面 overflow；shared nav 小目標已修正，資料表獨立捲動；缺實機IME／放大驗證 |
| Theming | 3 | light/dark/system原生切換；兩主題各路由與語意token；儲存拒絕情境按預設light恢復，未測首幀flash |
| Implementation integrity | 4 | 67條全部有情境證據、明確產品決策、不添加ignore、保留false positives與方法缺口 |
| **總計** | **16／20** | Good；不宣稱完整WCAG或跨瀏覽器認證 |

首頁 cold context 約0.80MB resource transfer，其中約0.65MB是10個字體segments；字根／取碼參考頁約1.43MB，其中約1.28MB是21個字體segments。這是實測 local transfer evidence，不是 LCP 或下載時間基準。最終 JS gzip約98kB、CSS gzip約53kB；字庫及所有字體請求另計。分段中文字體有實際成本，但不能僅憑本機 bytes 判定慢手機性能。

Reduced motion 的228格使用 reduce；原生IAB另走一般動作，source核對所有主要動畫及轉場在reduce中停止位移／保留文字、色彩、描邊，沒有0.01ms全域kill或隱藏內容等待reveal。

## 回歸證據

- Source：[before](qa/slop/source-before.json)／[after](qa/slop/source-after.json)。
- Browser：[228格矩陣](qa/slop/after/matrix.json)／[summary](qa/slop/summary.json)。37狀態完整batch為222格；補loading六格後是38狀態228格。最後小目標／caption修改只影響共用nav及詳細成績，另做18格定點確認，沒有因通過就反覆全站重掃。
- Native IAB：首頁BB錯答→重試AB→成功→第一課→實體A/B/AB作答→3/3完成→足跡；看碼選字數字4作答、reload保留選項／回饋；默寫1.8秒收起、再看一次、assisted回饋；Q手輔根、規則展開；最後一章第161–167關（末關9字）、鎖定和手機溢出；light/dark/system切換。console warn/error空，但不以此代替catalog。
- Tests：[21 passed](qa/slop/tests-after.txt)，含新增的ARIA、語意、表頭、清除取消／確認保留設定；Happy DOM不代替真實browser。
- Build：[TypeScript＋production build通過](qa/slop/build-after.txt)。Lint：[0 errors，1既有Fast Refresh warning](qa/slop/lint-after.txt)。
- 可重跑的detector harness：[scripts/audit-slop.mts](../scripts/audit-slop.mts)。依賴安裝於`/tmp/sucheng-slop-audit`，沒有更動產品package dependencies；每次scan使用獨立browser context，synthetic資料只存在fixture。

## 限制及測試事故

完整不能執行／未完成的檢查見 [checklist限制表](slop-checklist.md#不能執行未能完整驗證的檢查)：真實手機IME、screen readers、zoom、Safari/Firefox、field/受控性能測量、native清除取消、部分localReact狀態的URLdetector，以及IAB可見overlay。這些不以空findings補成通過。

Assessment A 測清除取消時誤觸browser confirmation，清除了IAB內本機預覽進度。這不符合主代理「勿清除既有localStorage」的派發指令；原有該context進度無法重建。主代理已告知使用者，不再作破壞性操作，只在Happy DOM disposable資料核驗取消與確認。主代理之後的原生練習產生測試進度，不能冒充恢復原紀錄。Chrome detector從未讀寫IAB或其他使用者profile。

原有4173 preview server保持可用；本次沒有另起或留下critique server，官方detector的headless browser已關閉。上述本機驗收結束時，工作區沒有Git metadata，當時未建立commit／PR；後續依使用者提交及推送要求，已接回`AlanChan246/sucheng-practice`的`main`歷史，保留全部現有檔案。

## 重跑方式

官方detector檔案使用已安裝Impeccable skill。Puppeteer從npm官方registry安裝於隔離目錄，使用本機Chrome，沒有關閉sandbox或證書驗證：

```sh
mkdir -p /tmp/sucheng-slop-audit
cp -R /Users/alanchan/.agents/skills/impeccable/scripts/detector /tmp/sucheng-slop-audit/
PUPPETEER_SKIP_DOWNLOAD=true npm install --prefix /tmp/sucheng-slop-audit --no-audit --no-fund puppeteer
node --import tsx scripts/audit-slop.mts after
```

可用 `SLOP_QA_RUNTIME` 指定工具目錄、`SLOP_QA_URL`指定同一網站preview、`PUPPETEER_EXECUTABLE_PATH`指定Chrome。`SLOP_QA_SCENARIOS`可限定需要回歸的狀態；不可用來省略原始完整覆蓋。原始catalog、detector和每格finding保留在 `docs/qa/slop/`，不能用ignore或新增token白名單抹掉證據。
