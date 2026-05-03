# Interactive Web Programming 專案

此專案為單頁個人簡介網站（靜態網頁：HTML / CSS / JavaScript），後續擴充了多款網頁小遊戲與功能展示。

## 專案檔案清單

- `index.html`：個人簡介網站主頁面
- `about.html`：**關於我／自傳**獨立頁面（導覽標籤為「關於我」）
- `todo-app.html`：**作品 B** 待辦清單（LocalStorage、篩選、排序）
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

## 開發紀錄

有關專案的詳細開發紀錄與進度，請參閱 [WORKLOG.md](WORKLOG.md)。
