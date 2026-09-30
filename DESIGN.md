---
name: 速成練習 — 兩鍵合拍
description: 大中文字、暖紙與有按壓回應的字根鍵帽。
colors:
  accent: "#d7ef70"
  accent-hover: "#c5e15c"
  accent-ink: "#263716"
  bg: "#f8f6ed"
  surface: "#eeeee2"
  paper: "#fffef8"
  ink: "#243628"
  muted: "#576450"
  line: "#bfc8b4"
  success: "#286039"
  success-bg: "#e7efd9"
  hint-bg: "#efe5ce"
  focus: "#286039"
  key-depth: "#b7c39d"
  button-depth: "#93a849"
typography:
  headline:
    fontFamily: "Noto Sans TC Variable, PingFang TC, Microsoft JhengHei, sans-serif"
    fontSize: "clamp(32px, 4.3vw, 52px)"
    fontWeight: 760
    lineHeight: 1.35
    letterSpacing: "-0.035em"
  title:
    fontFamily: "Noto Sans TC Variable, PingFang TC, Microsoft JhengHei, sans-serif"
    fontSize: "23px"
    fontWeight: 690
    lineHeight: 1.5
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Noto Sans TC Variable, PingFang TC, Microsoft JhengHei, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.75
  helper:
    fontFamily: "Noto Sans TC Variable, PingFang TC, Microsoft JhengHei, sans-serif"
    fontSize: "14px"
    lineHeight: 1.75
  section-label:
    fontSize: "19px"
  lede:
    fontSize: "18px"
  hero:
    fontSize: "clamp(38px, 4.4vw, 58px)"
  specimen:
    fontSize: "clamp(124px, 13vw, 184px)"
  key-root:
    fontSize: "15px"
  key-letter:
    fontSize: "17px"
  teaching-key-letter:
    fontSize: "27px"
  teaching-key-root:
    fontSize: "22px"
  brand:
    fontSize: "24px"
  success-label:
    fontSize: "20px"
  feedback-title:
    fontSize: "21px"
  root-pair:
    fontSize: "25px"
  practice-character:
    fontSize: "144px"
  practice-code:
    fontSize: "96px"
  choice-character:
    fontSize: "48px"
  completion-character:
    fontSize: "43px"
  lesson-title:
    fontSize: "38px"
  reference-character:
    fontSize: "40px"
  variant-character:
    fontSize: "26px"
  tablet-title:
    fontSize: "42px"
  mobile-title:
    fontSize: "35px"
  mobile-specimen:
    fontSize: "130px"
  mobile-first-specimen:
    fontSize: "104px"
  mobile-practice-character:
    fontSize: "110px"
  mobile-practice-code:
    fontSize: "78px"
  mobile-choice:
    fontSize: "46px"
  mobile-completion-title:
    fontSize: "31px"
  mobile-reference-character:
    fontSize: "36px"
  mobile-lesson-title:
    fontSize: "32px"
  code:
    fontFamily: "SFMono-Regular, Consolas, Liberation Mono, monospace"
    fontSize: "30px"
    fontWeight: 500
    lineHeight: 1.5
rounded:
  key: "12px"
  compact-key: "9px"
  small: "8px"
  progress-track: "3px"
  brand-key: "5px"
  field-corner: "7px"
  feedback-panel: "10px"
  lesson-number: "11px"
  teaching-key: "13px"
  completion-mark: "16px"
  practice-callout: "0 28px 0 0"
  progress-callout: "0 30px 0 0"
  circular-marker: "50%"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-ink}"
    rounded: "{rounded.key}"
    padding: "13px 23px"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.key}"
    padding: "13px 23px"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.code}"
    padding: "7px 12px"
  keycap:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.compact-key}"
    padding: "6px 4px"
---

# Design System: 速成練習 — 兩鍵合拍

## Overview

**Creative North Star: "兩鍵合拍"**

漢字是主角，字根鍵帽把觀察變成動作。暖紙底色、深墨文字和青檸按鍵形成親切但不幼稚的學習環境；玩味來自按下、字形落定及進度前進。

畫面以開放留白和文字層次分區，觸感集中在可以操作的地方。一般頁面保留探索入口，作答時收起全站導覽，讓一題、一個答案和下一步成為視覺中心。

**Key Characteristics:**
- 大中文字與清晰等寬碼字。
- 青檸主行動與柔和鍵帽深度。
- 開放頁面、短課路徑與直接作答。
- 快速回應，動畫不鎖住操作。

此文件由主代理依 `src/index.css` 和實作元件整理，遵守使用者要求由主代理負責基礎文件。三尺寸實際渲染 QA 與 catalog 的逐項證據見 `docs/slop-checklist.md`；此文件記錄元件角色和變體，不代替驗收紀錄。

## Colors

### Primary

青檸 `accent` 用於主要按鈕、按下的鍵帽和目前進度節點；`accent-ink` 提供深色文字。hover 使用較深的青檸。

### Neutral

暖紙 `bg` 是頁面底，灰綠 `surface` 是鍵帽和下一步區域，近白 `paper` 用於原生選單。深墨 `ink` 和較淡 `muted` 區分主次文字；`line` 僅分隔內容，不負責傳達唯一互動邊界。

### States

苔綠 `success` 與淺綠 `success-bg` 表達已答對。暖沙 `hint-bg` 放提示和需要再想一想的答案，配合實際首尾解釋，避免懲罰式紅畫面。

深色模式以 `:root[data-theme='dark']` 切換同名語意變數，值直接以 `src/index.css` 為準。所有元件引用語意角色，不能把淺色 hex 寫死到深色元件中。

**The State Has Words Rule.** 回饋同時具有文字或圖示／描邊；顏色不是唯一訊號。

## Typography

中文使用自帶的 Noto Sans TC Variable，備援為 PingFang TC、Microsoft JhengHei。字根沿用同一字體，避免字形風格忽然改變。碼字使用本機等寬字體；它們負責辨識 A–Z，不作主標題。

標題、內文與 code 的通用規格見 frontmatter。輔助文字與操作說明最少 14px；不能用小型說明取代主要指令。重要教學說明為 16–18px。展示漢字使用 124–184px，作答漢字為 144px；手機一般展示為 130px、作答為 110px；新手首頁展示為 104px，讓 A／B 按鍵完整露出。手機通用標題為 35px。

**The Character Leads Rule.** 練習中的漢字或速成碼先被看見，說明和統計讓位。

## Layout

一般內容上限 1080px，練習上限 900px，頁首／頁尾上限 1200px。桌面首頁和課堂以兩欄安排文字與漢字；手機改成單欄，操作接在題目下方。列表用分隔線和留白，避免每個內容都變成卡片。

900px 以下縮減間隔；650px 以下改用底部四項導覽和六欄字根鍵盤，左右通常留 20px；360px 以下縮至 12px。關卡桌面兩欄、手機一欄。只有詳細統計表有獨立水平捲動容器。

一般區塊節奏約 24–56px；元件內部優先沿用 frontmatter 的間距值。這是實作中反覆出現的尺度，不代表每個局部都要機械地對齊單一倍數。

手機導覽預留 safe area。作答頁不呈現底部導覽，避免誤觸離開。主按鈕至少 54px 高；一般小動作至少 44px；手機全鍵盤鍵帽至少 52px 高。

## Elevation & Depth

深度集中在鍵帽和按鈕，使用少量柔化的底部陰影；正文和列表保持平面。這種深度表示可以按下，不能擴散成每張內容卡都有陰影。

- 鍵帽：`0 4px 2px var(--key-depth)`。
- 主按鈕：`0 4px 2px var(--button-depth)`。
- 次按鈕：`0 3px 2px var(--key-depth)`。
- 按下時移動 2–3px，底影縮為 `0 1px 1px`，80ms 內回應。

**The Pressable Depth Rule.** 深度用於可按元素的觸感；內容靠字級、留白和色面分層。

## Shapes

鍵帽和主按鈕使用柔和方形；完整鍵盤較緊湊，特殊的日／月教學鍵較大。內容本身不必有外框。下一步提示區以單一右上角弧度作識別，不把整站包在巨大圓角容器內。

進度條為細長軌道；小節足跡用有編號或勾號的圓點。這些形狀分別服務輸入、進度與路徑，不可互換作純裝飾。

## Components

### Buttons

主按鈕像一個較寬的鍵，青檸底配深色字；次按鈕使用灰綠。文字操作保持底線且有 44px 觸控高度。focus-visible 為 3px 描邊、5px 外距。disabled 顯示不可用狀態，不移除必要的文字。

### Inputs / Fields

答案框是置中的等寬碼字輸入，底線提供位置感；旁邊有送出鍵。按滿一碼／兩碼即作答。實體鍵盤可用 Enter，觸控可用字根鍵或切換裝置鍵盤。答案回饋期間原輸入保留為唯讀。

### Navigation

開始、學少少、練幾題、足跡是四個主入口。桌面以文字導覽和底線表達目前頁面；手機改成圖示加文字的固定底部導覽。作答頁只留下「稍後繼續」和題組進度。

### Root Keyboard

一般桌面保持 QWERTY 排列，手機改成六欄；課程可以只呈現正在學的幾個鍵。每鍵同時顯示字母與字根。已輸入鍵以壓下狀態回應；提示／答錯時正確鍵有描邊和小點。螢幕閱讀器名稱包含字母及字根。

### Feedback

答對使用短句和字形落定，答錯呈現原輸入、正確碼、首尾字根與稍後再試的說明。下一題按鈕立即可用且取得焦點。選字答案有文字標記「你的選擇」和正確圖示。

按壓回應 80ms，字形落定 180ms，進度 220ms；落定／進度使用 `cubic-bezier(.16,1,.3,1)`。reduced motion 停止這些轉場與位移，保留文字、色彩和描邊。

## Do's and Don'ts

### Do:
- **Do** 讓漢字、字根與實際可用的鍵盤共同構成產品識別。
- **Do** 用具體取碼解釋及清晰下一步完成每次回饋。
- **Do** 保留暖紙、深墨、青檸的角色分工，深色模式沿用同名語意 token。
- **Do** 把短促觸感集中在按鍵、答案與進度，隨時可繼續操作。

### Don't:
- **Don't** 把每項教學和數字放進同一款圓角卡片。
- **Don't** 用企業儀表板、工作紙密度或兒童遊戲裝飾取代學習過程。
- **Don't** 把當場照提示答對稱為掌握，或以色彩單獨表示對錯。
- **Don't** 以縮小桌面 QWERTY 犧牲手機的可按範圍。

## 2026-09-30 Catalog refinement

Source detector 發現原文件缺少實際元件與 breakpoint 的字級／形狀角色。本次只補記現有、有具體用途的角色，並將原有 11–13px 輔助文字提高至 14px；未新增 ignore、放寬 detector threshold 或把任意值列入白名單。碼字、字根與展示漢字的不同字級分別服務辨識、操作及觀察；手機首頁的展示縮小是為了讓首次 A／B 操作在導覽列上方可见。

28px／30px 僅用於已有設計決策的單一右上角下一步區塊，圓形只服務小節與鍵提示；它們不是通用卡片半徑。暖紙配色保留 PRODUCT.md 已批准的青檸、深墨與紙張語境。browser detector 的 cream-palette finding 仍完整保存，未加忽略。

足跡的小節使用原生清單及有名稱的連結；詳細成績帶 caption、欄／列標頭，水平捲動區能取得鍵盤焦點。答錯輸入框以 aria-invalid 與 aria-describedby 連結文字解釋。跳到主要內容的目標可以取得焦點。
