# 速成練習

給小學生、中學生的速成輸入法學習與練習網站。純前端靜態站，進度存在瀏覽器本地。

## 功能

- 教學：24 個倉頡部首鍵位、速成首尾碼規則、拆碼示範
- 練習：看字打碼、看碼選字、默寫模式
- 關卡：依常用字順序分關，準確率 80% 以上過關
- 進度：本地儲存各模式成績與關卡解鎖狀態

## 字庫來源

- 常用字表：[nk2028/commonly-used-chinese-characters-and-words](https://github.com/nk2028/commonly-used-chinese-characters-and-words) 的 `char.txt`
- 倉頡對照：[rime/librime](https://github.com/rime/librime) 的 `cangjie5.dict.yaml`
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

## 線上網站

推送到 `main` 後會自動部署到 GitHub Pages：

https://alanchan246.github.io/sucheng-practice/

範例路徑：`/learn`、`/practice`、`/levels/1`（已處理 GitHub Pages 深連結）。

