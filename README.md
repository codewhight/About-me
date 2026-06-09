# Interactive Web Programming 專案

此專案為單頁個人簡介網站（靜態網頁：HTML / CSS / JavaScript），後續擴充了多款網頁小遊戲與功能展示。

## 專案檔案清單

- `index.html`：個人簡介網站主頁面
- `about.html`：**關於我／自傳**獨立頁面（導覽標籤為「關於我」）
- `todo-app.html`：**作品 B** 待辦部落格 (Todo-Blog)（全端 Express/JSON 資料庫，支援長文、標籤、搜尋，並具備 LocalStorage 離線降級防錯機制）
- `data-viz.html`：**作品 C** 資料視覺化（Fetch、Chart.js、載入／錯誤／空狀態）
- `games.html`：Python遊戲展示頁面（包含嵌入式遊戲代碼）
- `styles.css`：全站樣式檔案
- `script.js`：網站互動功能
- `minesweeper.py`、`tic_tac_toe.py`、`brick_breaker.py`：原始Python遊戲檔案（用於開發維護，實際運行時使用嵌入式代碼）
- `unity-game/index.html`：**Unity 2D 獨立作品頁**（與 Python 小遊戲集分開）；`unity-2d.html` 會導向此頁
- `board-games.html`：**棋類遊戲**選單頁面
- `othello.html`：**黑白棋**遊戲頁面（純 JavaScript 實現，支援 AI 與雙人對戰）
- `gomoku.html`：**五子棋**遊戲頁面（純 JavaScript 實現，支援 AI 與黑棋禁手規則）
- `chess.html`：**西洋棋**遊戲頁面（整合 `chess.js` 提供合法性校驗與自研 AI）
- `server/`：Node.js Express 全端 API 伺服器
- `db/`：資料庫架構說明文件、全端擴充計畫書與初始 Mock 資料

## 🚀 全端專案啟動說明

本專案已升級為全端架構（以「待辦部落格」為首波實作），請依序啟動後端與前端進行測試：

1. **啟動後端 API 伺服器**：
   在專案根目錄下，執行以下指令：
   ```bash
   node server/index.js
   ```
   *伺服器將執行於 `http://localhost:3001`，資料自動儲存至 `server/data/db.json`*

2. **啟動前端 React 網頁**：
   在專案根目錄下，使用 `npm.cmd`（或暫時調整 PowerShell 原則）啟動 Vite：
   ```bash
   npm.cmd run dev
   ```

有關資料庫設計詳情，請參閱 [db/README.md](db/README.md)；有關全端資料庫擴充計畫，請參閱 [db/proposal.md](db/proposal.md)。

## 開發紀錄

有關專案的詳細開發紀錄與進度，請參閱 [WORKLOG.md](WORKLOG.md)。
