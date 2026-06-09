import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_MESSAGES = 'http://localhost:3001/api/messages';
const LOCAL_MESSAGES_KEY = 'portfolio_messages_fallback';

const FALLBACK_MESSAGES = [
  {
    id: 1,
    visitor_name: "陳經理 (大千科技)",
    message_text: "你好，我們看過你的 React / RAG 作品集，對你在資訊工程與 AI 導覽員專題的實作經驗很有興趣，希望能邀請你前來面試研發工程師職缺。",
    reply_text: "陳經理您好，非常感謝您的來信邀請！我已收到您的面試邀請，將會盡快回覆您安排面試的時間。",
    is_visible: true,
    created_at: "2026-06-09T08:50:00Z"
  },
  {
    id: 2,
    visitor_name: "阿豪 (同班同學)",
    message_text: "彥廷，你的五子棋 AI 寫得很強耶！黑棋禁手規則判斷得很精準，找時間來切磋一下！",
    reply_text: "哈哈謝啦！改天一定跟你玩幾局！",
    is_visible: true,
    created_at: "2026-06-09T09:30:00Z"
  },
  {
    id: 3,
    visitor_name: "匿名訪客",
    message_text: "你的個人網站做得很有質感，深色模式和動畫過渡非常流暢，是用什麼 CSS 框架做的嗎？",
    reply_text: "謝謝誇獎！這個網站是用純原生 CSS (Vanilla CSS) 開發的喔，沒有使用其他第三方框架，這樣比較能自由掌控效能和自訂樣式！",
    is_visible: true,
    created_at: "2026-06-09T10:10:00Z"
  },
  {
    id: 4,
    visitor_name: "劉教授 (專題指導教授)",
    message_text: "彥廷，這次將 RAG 向量資料庫的研究整理得不錯。有空記得把報告印出來送到辦公室審閱。",
    reply_text: "教授您好，我已經整理好了，今天下午會送過去辦公室，謝謝教授的指導！",
    is_visible: true,
    created_at: "2026-06-09T11:40:00Z"
  },
  {
    id: 5,
    visitor_name: "李技術長",
    message_text: "有注意到你在 Unity 彈幕遊戲中處理物件池優化的想法。想請問你目前有在尋找暑期實習的機會嗎？",
    reply_text: null,
    is_visible: true,
    created_at: "2026-06-09T13:00:00Z"
  }
];

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [visitorName, setVisitorName] = useState('');
  const [visitorEmail, setVisitorEmail] = useState('');
  const [messageText, setMessageText] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch(API_MESSAGES);
      if (!response.ok) throw new Error('Failed to load messages');
      const data = await response.json();
      setMessages(data.filter(m => m.is_visible));
      setIsConnected(true);
    } catch (error) {
      console.warn('[Home-Messages] Cannot connect to server, using local fallback.');
      setIsConnected(false);
      
      const localData = localStorage.getItem(LOCAL_MESSAGES_KEY);
      if (localData) {
        setMessages(JSON.parse(localData));
      } else {
        setMessages(FALLBACK_MESSAGES.filter(m => m.is_visible));
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePostMessage = async (e) => {
    e.preventDefault();
    if (!visitorName.trim() || !messageText.trim()) return;

    const newMsgObj = {
      id: Date.now(),
      visitor_name: visitorName.trim(),
      visitor_email: visitorEmail.trim(),
      message_text: messageText.trim(),
      reply_text: null,
      is_visible: true,
      created_at: new Date().toISOString()
    };

    if (isConnected) {
      try {
        const response = await fetch(API_MESSAGES, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            visitor_name: visitorName,
            visitor_email: visitorEmail,
            message_text: messageText
          })
        });
        if (!response.ok) throw new Error('Post failed');
        const savedMsg = await response.json();
        setMessages([savedMsg, ...messages]);
      } catch (err) {
        alert('連線失敗，留言轉入本機儲存');
        setIsConnected(false);
        saveOfflineMessage(newMsgObj);
      }
    } else {
      saveOfflineMessage(newMsgObj);
    }

    setVisitorName('');
    setVisitorEmail('');
    setMessageText('');
  };

  const saveOfflineMessage = (msgObj) => {
    const updated = [msgObj, ...messages];
    setMessages(updated);
    localStorage.setItem(LOCAL_MESSAGES_KEY, JSON.stringify(updated));
  };
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
        <style>{`
          .contact-layout {
            display: grid;
            grid-template-columns: 1fr 1.2fr;
            gap: 24px;
          }
          @media (max-width: 768px) {
            .contact-layout {
              grid-template-columns: 1fr;
            }
          }
          .message-wall-container {
            display: flex;
            flex-direction: column;
            gap: 16px;
          }
          .message-scroll-area {
            max-height: 320px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 12px;
            padding-right: 8px;
            border-bottom: 1px solid var(--border);
            padding-bottom: 12px;
          }
          .message-card {
            background: rgba(255, 255, 255, 0.02);
            border: 1px solid var(--border);
            border-radius: 12px;
            padding: 14px 16px;
            display: flex;
            flex-direction: column;
            gap: 6px;
            animation: slideDown 0.3s ease-out;
          }
          .message-card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 13px;
          }
          .visitor-name {
            font-weight: 700;
            color: var(--primary);
          }
          .message-date {
            color: var(--muted);
          }
          .message-body {
            font-size: 14px;
            line-height: 1.6;
            color: var(--text);
            white-space: pre-wrap;
          }
          .owner-reply-box {
            background: rgba(124, 92, 255, 0.08);
            border-left: 3px solid var(--primary);
            padding: 8px 12px;
            border-radius: 4px 8px 8px 4px;
            margin-top: 6px;
            font-size: 13px;
          }
          .owner-reply-title {
            font-weight: bold;
            color: #a78bfa;
            margin-bottom: 4px;
          }
          .message-form-container {
            background: rgba(255, 255, 255, 0.01);
            border: 1px dashed var(--border);
            border-radius: 12px;
            padding: 16px;
            margin-top: 8px;
          }
          .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin-bottom: 10px;
          }
          @media (max-width: 480px) {
            .form-row {
              grid-template-columns: 1fr;
            }
          }
          .msg-input, .msg-textarea {
            width: 100%;
            padding: 10px 12px;
            border-radius: 8px;
            border: 1px solid var(--border);
            background: rgba(0, 0, 0, 0.2);
            color: var(--text);
            font: inherit;
            font-size: 13px;
          }
          .msg-input:focus, .msg-textarea:focus {
            outline: none;
            border-color: var(--primary);
          }
          .msg-textarea {
            min-height: 70px;
            resize: vertical;
          }
        `}</style>
        
        <div className="container">
          <header className="section-head reveal">
            <h2 className="section-title">聯絡與互動留言板</h2>
            <p className="section-desc">歡迎透過 Email、社群或在下方留言牆寫下您的意見與反饋！</p>
          </header>

          <div className="contact-layout">
            
            {/* Left Column: Socials and Direct Contacts */}
            <div className="panel reveal" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h3 className="panel-title">快速聯絡</h3>
                <p className="muted" style={{ marginBottom: '8px' }}>
                  Email：
                  <a className="link" href="mailto:linyan071319@gmail.com">linyan071319@gmail.com</a>
                </p>
                <p className="muted" style={{ marginBottom: '12px' }}>
                  LINE ID：<span className="link" aria-label="LINE ID">brianlin1214</span>
                </p>
                <div className="contact-actions">
                  <a className="btn btn-small btn-primary" href="mailto:linyan071319@gmail.com">寄信給我</a>
                  <button className="btn btn-small btn-ghost" type="button" data-copy-email="true">
                    複製 Email
                  </button>
                </div>
              </div>
              
              <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '0' }} />
              
              <div>
                <h3 className="panel-title">社群連結</h3>
                <ul className="social" style={{ paddingLeft: '0', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <li>
                    <a className="link" href="https://github.com/codewhight" target="_blank" rel="noreferrer">GitHub (codewhight)</a>
                  </li>
                  <li>
                    <span className="muted">LINE ID：brianlin1214</span>
                  </li>
                  <li>
                    <a className="link" href="mailto:linyan071319@gmail.com">Gmail 聯絡</a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Column: Interactive Message Board (Full-stack) */}
            <div className="panel reveal message-wall-container">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 className="panel-title" style={{ margin: 0 }}>💬 訪客留言牆</h3>
                <span style={{ fontSize: '12px', color: isConnected ? '#10b981' : '#f59e0b' }}>
                  {isConnected ? '🟢 連線模式 (DB)' : '🟡 離線模式 (LocalStorage)'}
                </span>
              </div>

              {/* Message scroll list */}
              <div className="message-scroll-area">
                {messages.length === 0 ? (
                  <p style={{ textAlign: 'center', color: 'var(--muted)', padding: '20px 0', fontSize: '13px' }}>
                    目前尚無留言，歡迎寫下第一篇留言！
                  </p>
                ) : (
                  messages.map(msg => (
                    <div className="message-card" key={msg.id}>
                      <div className="message-card-header">
                        <span className="visitor-name">{msg.visitor_name}</span>
                        <span className="message-date">
                          {new Date(msg.created_at).toLocaleDateString('zh-TW')}
                        </span>
                      </div>
                      <div className="message-body">{msg.message_text}</div>
                      
                      {msg.reply_text && (
                        <div className="owner-reply-box">
                          <div className="owner-reply-title">✍️ 站長回覆：</div>
                          <div>{msg.reply_text}</div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Message Submission Form */}
              <div className="message-form-container">
                <h4 style={{ margin: '0 0 10px 0', fontSize: '14px' }}>留下一筆訊息：</h4>
                <form onSubmit={handlePostMessage}>
                  <div className="form-row">
                    <input
                      className="msg-input"
                      type="text"
                      required
                      placeholder="稱呼 / 暱稱 *"
                      value={visitorName}
                      onChange={e => setVisitorName(e.target.value)}
                    />
                    <input
                      className="msg-input"
                      type="email"
                      placeholder="Email (非必填，不公開)"
                      value={visitorEmail}
                      onChange={e => setVisitorEmail(e.target.value)}
                    />
                  </div>
                  <textarea
                    className="msg-textarea"
                    required
                    maxLength="500"
                    placeholder="請輸入留言內容… *"
                    value={messageText}
                    onChange={e => setMessageText(e.target.value)}
                  />
                  <button 
                    className="btn btn-small btn-primary" 
                    type="submit" 
                    style={{ width: '100%', marginTop: '10px', fontSize: '12px', padding: '8px' }}
                  >
                    發送留言
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
