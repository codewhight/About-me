# 資料庫架構與實作說明 (Database Architecture & Implementation Guide)

此資料夾用於存放並記錄本專案的**資料庫架構設計**、**數據表結構 (Schemas)**，以及系統中各模組如何與後端進行資料存取與實作。

---

## 🗄 1. 資料庫架構概述

本專案採用三層式架構（3-Tier Architecture），資料流向如下：

```
[前端 React 網頁] (UI/事件) 
      │ 
      ▼ (HTTP Fetch API)
[後端 Express 伺服器] (商業邏輯/CORS) 
      │ 
      ▼ (fs 檔案讀寫)
[檔案型 JSON 資料庫] (或未來的 SQLite)
```

*   **當前實作**：使用後端本地硬碟的檔案型資料庫 `server/data/db.json` 進行資料讀寫。此設計的優點在於**免安裝資料庫服務、免編譯、具備極佳的移植性**，適合展示與學術期末報告。
*   **未來擴充**：可直接使用 `sqlite3` 套件升級為 SQLite 關聯式資料庫，Schema 欄位設計皆相容於 SQL 規範。

---

## 📊 2. 數據表結構設計 (Database Schemas)

### A. 待辦部落格表 (`todos`) ── [已實作]
*   **用途**：儲存個人工作或學習日誌、標籤分類與完成狀態。
*   **初始資料位置**：[db/todos.json](file:///c:/Users/user/Desktop/111210510/Interactive_Web_Programming/db/todos.json)
*   **欄位結構**：
    ```json
    {
      "id": "String (UUID/時間戳記)",
      "title": "String (任務標題/主旨)",
      "content": "String (部落格詳細內文)",
      "tags": ["Array of Strings (分類標籤)"],
      "done": "Boolean (是否完成)",
      "createdAt": "Number (建立時間戳記)",
      "updatedAt": "Number (更新時間戳記)"
    }
    ```

### B. 遊戲排行榜與戰績表 (`game_records`) ── [規劃中]
*   **用途**：紀錄玩家在各小遊戲（打磚塊、踩地雷）的得分或過關時間，以及棋對戰紀錄。
*   **初始資料位置**：[db/game_records.json](file:///c:/Users/user/Desktop/111210510/Interactive_Web_Programming/db/game_records.json)
*   **SQL Schema**：
    ```sql
    CREATE TABLE game_records (
        id VARCHAR(36) PRIMARY KEY,
        game_name VARCHAR(50) NOT NULL, -- e.g., 'minesweeper', 'brick_breaker'
        player_name VARCHAR(50) NOT NULL,
        score INT DEFAULT 0,
        completion_time INT DEFAULT NULL, -- 單位：秒
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    ```

### C. 聯絡我訪客留言表 (`messages`) ── [規劃中]
*   **用途**：儲存面試官或訪客留在網站的訊息，並支援後台審核與站長回覆。
*   **初始資料位置**：[db/messages.json](file:///c:/Users/user/Desktop/111210510/Interactive_Web_Programming/db/messages.json)
*   **SQL Schema**：
    ```sql
    CREATE TABLE messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        visitor_name VARCHAR(50) NOT NULL,
        visitor_email VARCHAR(100) NOT NULL,
        message_text TEXT NOT NULL,
        reply_text TEXT DEFAULT NULL,
        is_visible BOOLEAN DEFAULT FALSE, -- 審核機制
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    ```

### D. 網站流量日誌表 (`visit_logs`) ── [規劃中]
*   **用途**：紀錄使用者造訪的頁面，作為作品 C 資料視覺化（Chart.js）的數據來源。
*   **初始資料位置**：[db/visit_logs.json](file:///c:/Users/user/Desktop/111210510/Interactive_Web_Programming/db/visit_logs.json)
*   **SQL Schema**：
    ```sql
    CREATE TABLE visit_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        page_path VARCHAR(100) NOT NULL, -- e.g., '/', '/about', 'play_chess'
        browser_type VARCHAR(50) NOT NULL,
        ip_hash VARCHAR(64) NOT NULL, -- 保護訪客隱私
        visit_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    ```

---

## 🛠 3. 系統如何實踐前後端資料庫串接

### A. 後端 Express 實作檔案讀寫
後端使用 Node.js 原生的 `fs` 模組，將 JSON 檔案作為資料庫。每次收到 API 請求時，先讀取檔案，修改記憶體中的陣列，再同步寫回檔案。例如：

```javascript
// 讀取 DB
function readDB() {
  const data = fs.readFileSync(path.join(__dirname, 'data', 'db.json'), 'utf-8');
  return JSON.parse(data);
}

// 寫入 DB
function writeDB(data) {
  fs.writeFileSync(path.join(__dirname, 'data', 'db.json'), JSON.stringify(data, null, 2));
}
```

### B. 前端 React 串接與降級防錯
前端在 React 中使用 `fetch` 串接後端 API。同時，為了防止後端未開啟時導致網頁崩潰，前端設計了 **離線降級 (Offline Fallback)** 機制：

```javascript
const fetchTodos = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/todos');
    const data = await response.json();
    setItems(data);
    setIsConnected(true); // 連線模式
  } catch (error) {
    setIsConnected(false); // 離線模式
    const localData = localStorage.getItem('portfolio_todo_blog_fallback');
    setItems(localData ? JSON.parse(localData) : []);
  }
};
```

---

## 📌 4. 專案中哪些部分使用到了資料庫？

1.  **待辦部落格 (Todo-Blog) 頁面 ── [已實作]**
    *   **對應檔案**：[TodoApp.jsx](file:///c:/Users/user/Desktop/111210510/Interactive_Web_Programming/src/pages/TodoApp.jsx) 與 [server/index.js](file:///c:/Users/user/Desktop/111210510/Interactive_Web_Programming/server/index.js)。
    *   **運作方式**：完全串接後端 API 與資料庫，新增日誌、詳細內文、切換狀態與標籤，資料皆即時存入 `db.json`。
2.  **資料視覺化儀表板 (DataViz) ── [擴充規劃中]**
    *   **對應檔案**：`src/pages/DataViz.jsx`。
    *   **運作方式**：將流量日誌表 (`visit_logs`) 的日點擊量與各頁面比例數據回傳給前端，讓 Chart.js 畫出本專案真實的造訪數據分析圖。
3.  **個人主頁「聯絡我」區塊 ── [擴充規劃中]**
    *   **對應檔案**：`src/pages/Home.jsx` 底部聯絡區塊。
    *   **運作方式**：將原有的靜態聯絡管道擴充一個留言表單，送出後即時寫入留言表 (`messages`)。
4.  **小遊戲與棋類選單頁面 ── [擴充規劃中]**
    *   **對應檔案**：`board-games.html`、`othello.html` 等遊戲頁面。
    *   **運作方式**：遊戲結束後，回傳秒數與得分寫入 `game_records` 表，並展示動態排行榜。
