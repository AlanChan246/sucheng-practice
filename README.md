# 速成練習

給香港小學高年級、中學生及成年初學者的速成學習工具。採用 A「兩鍵合拍」方向：先按出一個字，學少少，再自己試。React / TypeScript / Vite 靜態網站，進度存在瀏覽器本地。

## 功能

- 首次使用：用日 A、月 B 試出「明」，然後進入短課。
- 學少少：6 個短課、即時小練習、26 鍵參考、字根變體及取碼例子。
- 練幾題：5 題快速練習、三種 10 題模式（看字打碼、看碼選字、默寫）、錯題重溫及弱鍵練習。
- 每題即存：離開後接續題目與回饋；選字選項不因重載而改變。
- 錯題循環：解釋首尾、標示正確鍵，有足夠題目時隔兩題重試；末段錯題留待下一組重溫。
- 記得穩：三次相隔至少 24 小時的獨立輸入答對才計入。提示、選字及當場重試不算獨立回憶。
- 關卡：沿用 4,159 字、167 關及原有次序；首次獨立作答達 80% 通關。關卡次序不代表由淺入深。
- 足跡：先呈現值得重溫的字與下一步，詳細成績可展開查看。
- 電腦 QWERTY 與手機六欄字根鍵盤；淺色、深色、跟隨系統及 reduced motion。

## 進度與相容性

沿用 `sucheng-practice-progress` 儲存鍵，資料格式升至 v2；v1 的模式成績、關卡最佳紀錄和解鎖狀態會保留，不會推算不存在的逐字掌握紀錄。每次作答儲存逐字及題組狀態，完成題組時才累加模式成績；重試不增加通關分數。

損壞或未知版本資料會先嘗試保留備份。儲存失敗時顯示提示並容許在目前頁面繼續。進度不跨瀏覽器或裝置同步。清除進度會保留 `sucheng-practice-settings` 主題設定。

## 字庫來源

- 常用字表：[nk2028/commonly-used-chinese-characters-and-words](https://github.com/nk2028/commonly-used-chinese-characters-and-words) 的 `char.txt`
- 倉頡對照：專案既有的 `data/cangjie5.dict.yaml`
- 速成碼由倉頡碼首碼 + 尾碼推導

## 開發

```bash
npm install
npm run dev
```

## 建置

```bash
npm run build
npm run preview
```

建置前會自動執行 `scripts/build-dict.mjs` 產生 `public/sucheng-dict.json`。

```bash
npm run test
npm run lint
```

測試涵蓋資料遷移、全部字庫的選項唯一性、錯題重試、跨日回憶、通關邊界及元件互動。互動測試使用 Happy DOM，不能代替真實瀏覽器、手機鍵盤及視覺 QA。當前驗收狀態見 [完整67項 Slop 核對表](docs/slop-checklist.md)、[技術 audit／設計評審與限制](docs/slop-audit.md) 和 [驗證紀錄](docs/redesign-verification.md)。

## 設計與維護

- [PRODUCT.md](PRODUCT.md)：使用者、產品原則及資料約束。
- [DESIGN.md](DESIGN.md)：從實作整理的 A 方案設計系統。
- `.impeccable/design.json`：可獨立呈現的元件樣本及 motion / breakpoint 補充。
- 中文字體由 `@fontsource-variable/noto-sans-tc` 隨站提供，授權見該套件的 `LICENSE`；圖示使用 `lucide-react`。

## 線上網站

推送到 `main` 後，既有 GitHub Actions workflow 會自動建置並部署至 GitHub Pages：

[速成練習網站](https://alanchan246.github.io/sucheng-practice/)

範例路徑：`/learn`、`/practice`、`/levels/1`（已處理 GitHub Pages 深連結）。
