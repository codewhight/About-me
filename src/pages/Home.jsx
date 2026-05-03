import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <>
      <section className="hero section">
        <div className="container hero-grid">
          <div className="hero-copy reveal">
            <p className="badge">
              <span className="dot" aria-hidden="true"></span>
              可接案／實習／全職
            </p>
            <h1 className="hero-title">
              嗨，我是 <span className="grad">林彥廷</span><br />
              一位
              <span
                className="type-rotate grad2"
                data-roles="前端／全端,互動設計,效能優化,UI 工程師"
                aria-label="角色輪播"
              ></span>
              開發者
            </h1>
            <p className="hero-subtitle">
              我擅長把想法做成「好看、好用、跑得快」的網站：注重 UX、效能與可維護性。
            </p>

            <div className="hero-cta">
              <a className="btn btn-primary" href="#projects">看作品</a>
              <Link className="btn btn-ghost" to="/about.html">認識我</Link>
            </div>

            <ul className="quick-facts" aria-label="重點資訊">
              <li><strong>地點</strong>：台灣／遠端</li>
              <li><strong>學歷</strong>：國立金門大學 資訊工程學系</li>
              <li><strong>專長</strong>：HTML、CSS、JavaScript</li>
              <li><strong>興趣</strong>：介面設計、互動、效能優化</li>
            </ul>
          </div>

          <aside className="hero-card reveal" aria-label="個人卡片">
            <div className="avatar" aria-hidden="true">
              <span>YN</span>
            </div>
            <div className="card-body">
              <h2 className="card-title">林彥廷</h2>
              <p className="card-meta">國立金門大學 資工系 · RAG / Frontend / Unity</p>

              <div className="card-actions">
                <button className="btn btn-small btn-ghost" type="button" data-copy-email="true">
                  複製 Email
                </button>
                <a className="btn btn-small btn-ghost" href="#contact">社群連結</a>
              </div>

              <dl className="card-stats">
                <div>
                  <dt>專案</dt>
                  <dd>10+</dd>
                </div>
                <div>
                  <dt>主技術</dt>
                  <dd>JS</dd>
                </div>
                <div>
                  <dt>狀態</dt>
                  <dd>Available</dd>
                </div>
              </dl>
            </div>
          </aside>
        </div>
        <div className="hero-bg" aria-hidden="true"></div>
      </section>

      <section className="section" id="about">
        <div className="container">
          <header className="section-head reveal">
            <h2 className="section-title">關於我</h2>
            <p className="section-desc">
              我專注於 RAG、前端互動與 Unity 實作，重視資料準確度、效能與可維護性。想更完整認識我，請閱讀
              <Link className="link" to="/about.html">自傳／關於我專頁</Link>。
            </p>
          </header>

          <div className="about-grid">
            <div className="panel reveal">
              <h3 className="panel-title">我在乎的事</h3>
              <ul className="list">
                <li>以 RAG 架構提升回應準確度與可靠性</li>
                <li>透過 SOP 與資料分析持續優化效能</li>
                <li>將複雜技術轉化為清楚易懂的溝通</li>
              </ul>
            </div>

            <div className="panel reveal">
              <h3 className="panel-title">我正在做什麼</h3>
              <ul className="list">
                <li>深化生成式 AI、Embedding 與檢索優化</li>
                <li>精進 Unity（C#）與前端整合開發能力</li>
                <li>持續累積實務專案與團隊協作經驗</li>
              </ul>
            </div>

            <div className="panel reveal">
              <h3 className="panel-title">一句話自我介紹</h3>
              <p className="muted">
                我是具備 RAG 開發實力與優化思維的資工人才，擅長把技術做成可落地、可持續改進的解決方案。
              </p>
              <div className="chips" aria-label="關鍵字">
                <span className="chip">UI</span>
                <span className="chip">UX</span>
                <span className="chip">RWD</span>
                <span className="chip">Performance</span>
                <span className="chip">Accessibility</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="skills">
        <div className="container">
          <header className="section-head reveal">
            <h2 className="section-title">技能</h2>
            <p className="section-desc">涵蓋網頁前端、資料處理與 AI 應用實作能力，並持續迭代優化。</p>
          </header>

          <div className="skills-grid">
            <article className="skill-card reveal">
              <h3>HTML</h3>
              <p className="muted">語意化標籤、SEO 基礎、可及性友善。</p>
              <div className="meter" role="img" aria-label="熟練度 85%">
                <span style={{ width: '85%' }}></span>
              </div>
            </article>

            <article className="skill-card reveal">
              <h3>CSS</h3>
              <p className="muted">Flex/Grid、RWD、動畫、設計系統。</p>
              <div className="meter" role="img" aria-label="熟練度 80%">
                <span style={{ width: '80%' }}></span>
              </div>
            </article>

            <article className="skill-card reveal">
              <h3>JavaScript</h3>
              <p className="muted">DOM、事件、資料處理、模組化思維。</p>
              <div className="meter" role="img" aria-label="熟練度 75%">
                <span style={{ width: '75%' }}></span>
              </div>
            </article>

            <article className="skill-card reveal">
              <h3>工具</h3>
              <p className="muted">Git（可選）、VS Code、瀏覽器 DevTools。</p>
              <div className="chips" aria-label="工具">
                <span className="chip">DevTools</span>
                <span className="chip">Figma</span>
                <span className="chip">Git</span>
                <span className="chip">Node</span>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="section" id="projects">
        <div className="container">
          <header className="section-head reveal">
            <h2 className="section-title">作品</h2>
            <p className="section-desc">
              這些作品呈現我在互動設計、資料視覺化、AI 應用與遊戲開發上的實作成果。
            </p>
          </header>

          <div className="projects-grid">
            <article className="project-card reveal" data-project-id="a">
              <div className="project-top">
                <h3 className="project-title">作品 A：個人網站</h3>
                <p className="project-desc muted">
                  單頁式簡介網站，包含深色模式、RWD、滑動動畫。
                </p>
              </div>
              <ul className="project-tags" aria-label="標籤">
                <li>HTML</li>
                <li>CSS</li>
                <li>JS</li>
              </ul>
              <div className="project-actions">
                <a className="btn btn-small btn-primary" href="#" aria-disabled="true">Demo</a>
                <a className="btn btn-small btn-ghost" href="#" aria-disabled="true">GitHub</a>
                <button className="btn btn-small btn-ghost" type="button" data-project-open="true">
                  詳情
                </button>
              </div>
            </article>

            <article className="project-card reveal" data-project-id="b">
              <div className="project-top">
                <h3 className="project-title">作品 B：待辦清單 Web App</h3>
                <p className="project-desc muted">
                  完整 CRUD、LocalStorage 持久化、全部／進行中／已完成篩選、依建立時間排序、雙擊編輯與空狀態提示。
                </p>
              </div>
              <ul className="project-tags" aria-label="標籤">
                <li>JavaScript</li>
                <li>LocalStorage</li>
                <li>DOM</li>
                <li>UX</li>
              </ul>
              <div className="project-actions">
                <Link className="btn btn-small btn-primary" to="/todo-app.html">Demo</Link>
                <a className="btn btn-small btn-ghost" href="#" aria-disabled="true">GitHub</a>
                <button className="btn btn-small btn-ghost" type="button" data-project-open="true">
                  詳情
                </button>
              </div>
            </article>

            <article className="project-card reveal" data-project-id="c">
              <div className="project-top">
                <h3 className="project-title">作品 C：資料視覺化儀表板</h3>
                <p className="project-desc muted">
                  Fetch 取得 JSONPlaceholder 文章、Chart.js 長條圖統計各使用者發文數，含載入中、錯誤重試與空資料示範。
                </p>
              </div>
              <ul className="project-tags" aria-label="標籤">
                <li>Fetch</li>
                <li>Chart.js</li>
                <li>REST API</li>
                <li>UX</li>
              </ul>
              <div className="project-actions">
                <Link className="btn btn-small btn-primary" to="/data-viz.html">Demo</Link>
                <a className="btn btn-small btn-ghost" href="#" aria-disabled="true">GitHub</a>
                <button className="btn btn-small btn-ghost" type="button" data-project-open="true">
                  詳情
                </button>
              </div>
            </article>

            <article className="project-card reveal" data-project-id="games">
              <div className="project-top">
                <h3 className="project-title">Python小遊戲集</h3>
                <p className="project-desc muted">
                  使用Python實現的經典小遊戲：踩地雷、井字遊戲、打磚塊，展示程式邏輯與互動設計。
                </p>
              </div>
              <ul className="project-tags" aria-label="標籤">
                <li>Python</li>
                <li>Pyodide</li>
                <li>遊戲邏輯</li>
              </ul>
              <div className="project-actions">
                <a className="btn btn-small btn-primary" href={`${import.meta.env.BASE_URL}games.html`}>玩遊戲</a>
                <a className="btn btn-small btn-ghost" href="#" aria-disabled="true">GitHub</a>
                <button className="btn btn-small btn-ghost" type="button" data-project-open="true">
                  詳情
                </button>
              </div>
            </article>

            <article className="project-card reveal" data-project-id="boardgames">
              <div className="project-top">
                <h3 className="project-title">棋類遊戲</h3>
                <p className="project-desc muted">
                  新增黑白棋與五子棋，支援雙人與 AI 模式；含合法步提示、悔棋與禁手規則等進階功能。
                </p>
              </div>
              <ul className="project-tags" aria-label="標籤">
                <li>JavaScript</li>
                <li>棋類遊戲</li>
                <li>邏輯判定</li>
              </ul>
              <div className="project-actions">
                <Link className="btn btn-small btn-primary" to="/board-games.html">玩遊戲</Link>
                <a className="btn btn-small btn-ghost" href="#" aria-disabled="true">GitHub</a>
                <button className="btn btn-small btn-ghost" type="button" data-project-open="true">
                  詳情
                </button>
              </div>
            </article>

            <article className="project-card reveal" data-project-id="unity">
              <div className="project-top">
                <h3 className="project-title">Unity 橫向 2D 彈幕遊戲</h3>
                <p className="project-desc muted">
                  使用 Unity 開發的橫向 2D 彈幕作品，聚焦走位閃避、彈道設計與關卡節奏控制。
                </p>
              </div>
              <ul className="project-tags" aria-label="標籤">
                <li>Unity</li>
                <li>2D</li>
                <li>C#</li>
                <li>彈幕</li>
              </ul>
              <div className="project-actions">
                <a className="btn btn-small btn-primary" href={`${import.meta.env.BASE_URL}unity-game/index.html`}>作品頁</a>
                <a className="btn btn-small btn-ghost" href="#" aria-disabled="true">GitHub</a>
                <button className="btn btn-small btn-ghost" type="button" data-project-open="true">
                  詳情
                </button>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="section" id="timeline">
        <div className="container">
          <header className="section-head reveal">
            <h2 className="section-title">經歷</h2>
            <p className="section-desc">整理競賽、教學與專案歷程，呈現我在高壓環境下的執行力與協作能力。</p>
          </header>

          <ol className="timeline">
            <li className="timeline-item reveal">
              <div className="timeline-dot" aria-hidden="true"></div>
              <div className="timeline-body">
                <div className="timeline-head">
                  <h3>國立金門大學 資訊工程學系（異地求學）</h3>
                  <span className="muted">2022 — 至今</span>
                </div>
                <p className="muted">
                  從新竹前往金門就學，累積高度自主管理與適應能力；持續深化程式基礎與實作能力，並以 GitHub 進行版本管理。
                </p>
              </div>
            </li>
            <li className="timeline-item reveal">
              <div className="timeline-dot" aria-hidden="true"></div>
              <div className="timeline-body">
                <div className="timeline-head">
                  <h3>AI 智慧導覽員專題（RAG / Vector DB）</h3>
                  <span className="muted">2025 — 2026</span>
                </div>
                <p className="muted">
                  獨立建立資料庫並轉為向量資料庫，透過 RAG 架構提升回答準確度；實作中強化了 Embedding 與語義搜尋優化能力。
                </p>
              </div>
            </li>
            <li className="timeline-item reveal">
              <div className="timeline-dot" aria-hidden="true"></div>
              <div className="timeline-body">
                <div className="timeline-head">
                  <h3>AI CUP / ITSA 生成式 AI 競賽</h3>
                  <span className="muted">2025</span>
                </div>
                <p className="muted">
                  在競賽時限下持續迭代模型與流程，訓練高壓情境中的程式穩定性、問題拆解與效率優化能力。
                </p>
              </div>
            </li>
            <li className="timeline-item reveal">
              <div className="timeline-dot" aria-hidden="true"></div>
              <div className="timeline-body">
                <div className="timeline-head">
                  <h3>助教／講師經歷與專業認證</h3>
                  <span className="muted">持續累積</span>
                </div>
                <p className="muted">
                  長期擔任大學助教與補習班助教並獲續聘，具備穩定協作與教學溝通能力；另取得 ITS 認證，建立業界標準知識基礎。
                </p>
              </div>
            </li>
          </ol>
        </div>
      </section>

      <section className="section" id="contact">
        <div className="container">
          <header className="section-head reveal">
            <h2 className="section-title">聯絡我</h2>
            <p className="section-desc">歡迎透過 Email、GitHub 或 LINE 聯繫我。</p>
          </header>

          <div className="contact-grid">
            <div className="panel reveal">
              <h3 className="panel-title">快速聯絡</h3>
              <p className="muted">
                Email：
                <a className="link" href="mailto:linyan071319@gmail.com">linyan071319@gmail.com</a>
              </p>
              <p className="muted">
                LINE ID：<span className="link" aria-label="LINE ID">brianlin1214</span>
              </p>
              <p className="muted">如果你提供需求與時程，我可以回覆估時與建議方案。</p>
              <div className="contact-actions">
                <a className="btn btn-primary" href="mailto:linyan071319@gmail.com">寄信給我</a>
                <button className="btn btn-ghost" type="button" data-copy-email="true">
                  複製 Email
                </button>
              </div>
              <p className="toast" role="status" aria-live="polite" hidden>已複製到剪貼簿</p>
            </div>

            <div className="panel reveal">
              <h3 className="panel-title">社群</h3>
              <ul className="social">
                <li>
                  <a className="link" href="https://github.com/codewhight" target="_blank" rel="noreferrer">GitHub</a>
                </li>
                <li>
                  <span className="muted">LINE ID：brianlin1214</span>
                </li>
                <li>
                  <a className="link" href="mailto:linyan071319@gmail.com">Gmail</a>
                </li>
              </ul>
              <p className="muted">提示：如果你沒有社群，也可以放作品 Demo 或雲端履歷。</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
