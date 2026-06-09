import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_LEADERBOARD = 'http://localhost:3001/api/leaderboard';

const FALLBACK_RECORDS = [
  {
    id: "rec-001",
    game_name: "minesweeper",
    player_name: "王小明",
    score: 0,
    completion_time_seconds: 45,
    game_metadata: "{\"difficulty\":\"easy\"}",
    created_at: "2026-06-09T08:30:00Z"
  },
  {
    id: "rec-002",
    game_name: "brick_breaker",
    player_name: "李大同",
    score: 3820,
    completion_time_seconds: 180,
    game_metadata: "{\"score_breakdown\":{\"bricks_broken\":76,\"balls_lost\":1}}",
    created_at: "2026-06-09T09:15:00Z"
  },
  {
    id: "rec-003",
    game_name: "othello",
    player_name: "張小華",
    score: 36,
    completion_time_seconds: 320,
    game_metadata: "{\"mode\":\"vs_ai\",\"ai_difficulty\":\"medium\",\"player_color\":\"black\",\"final_stones\":{\"black\":36,\"white\":28}}",
    created_at: "2026-06-09T10:45:00Z"
  },
  {
    id: "rec-004",
    game_name: "gomoku",
    player_name: "陳阿生",
    score: 1,
    completion_time_seconds: 240,
    game_metadata: "{\"mode\":\"double_player\",\"winner\":\"black\",\"moves_count\":45}",
    created_at: "2026-06-09T11:20:00Z"
  },
  {
    id: "rec-005",
    game_name: "chess",
    player_name: "林彥廷",
    score: 1,
    completion_time_seconds: 680,
    game_metadata: "{\"mode\":\"vs_ai\",\"ai_difficulty\":\"hard_depth3\",\"winner\":\"player_white\"}",
    created_at: "2026-06-09T12:05:00Z"
  }
];

export default function BoardGames() {
  const [records, setRecords] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch(API_LEADERBOARD);
      if (!response.ok) throw new Error('API error');
      const data = await response.json();
      setRecords(data);
      setIsConnected(true);
    } catch (error) {
      console.warn('[Leaderboard] Backend not connected. Loading mock fallback data.');
      setIsConnected(false);
      setRecords(FALLBACK_RECORDS);
    } finally {
      setLoading(false);
    }
  };

  const getGameLabel = (name) => {
    switch (name) {
      case 'minesweeper': return '踩地雷';
      case 'brick_breaker': return '打磚塊';
      case 'othello': return '黑白棋';
      case 'gomoku': return '五子棋';
      case 'chess': return '西洋棋';
      default: return name;
    }
  };

  const getRecordValue = (rec) => {
    if (rec.game_name === 'minesweeper') {
      return `${rec.completion_time_seconds} 秒 (通關)`;
    }
    if (rec.game_name === 'brick_breaker') {
      return `${rec.score} 分`;
    }
    if (rec.score > 1) {
      return `${rec.score} 子 (勝)`;
    }
    return rec.score === 1 ? '獲勝' : '平手/敗';
  };

  const getMetadataLabel = (rec) => {
    try {
      const meta = typeof rec.game_metadata === 'string' ? JSON.parse(rec.game_metadata) : rec.game_metadata;
      if (!meta) return '-';
      if (meta.difficulty) return `難度：${meta.difficulty === 'easy' ? '簡單' : meta.difficulty === 'hard' ? '困難' : '普通'}`;
      if (meta.mode === 'vs_ai') return `對戰 AI (${meta.ai_difficulty === 'hard_depth3' ? '高級' : '中級'})`;
      if (meta.mode === 'double_player') return '雙人對決';
      return '-';
    } catch {
      return '-';
    }
  };

  const filteredRecords = activeTab === 'all' 
    ? records 
    : records.filter(r => r.game_name === activeTab);

  const sortedRecords = [...filteredRecords].sort((a, b) => {
    if (a.game_name !== b.game_name) {
      return a.game_name.localeCompare(b.game_name);
    }
    if (a.game_name === 'minesweeper') {
      return a.completion_time_seconds - b.completion_time_seconds;
    }
    if (a.game_name === 'brick_breaker') {
      return b.score - a.score;
    }
    return new Date(b.created_at) - new Date(a.created_at);
  });

  return (
    <>
      <style>{`
        .leaderboard-section {
          margin-top: 40px;
          padding-top: 30px;
          border-top: 1px solid var(--border);
        }
        .leaderboard-tabs {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 20px;
        }
        .tab-btn {
          padding: 8px 14px;
          border-radius: 8px;
          border: 1px solid var(--border);
          background: transparent;
          color: var(--muted);
          cursor: pointer;
          font-size: 13px;
          font-weight: 600;
          transition: all 0.2s;
        }
        .tab-btn:hover {
          background: rgba(124, 92, 255, 0.08);
          color: var(--text);
        }
        .tab-btn.active {
          background: var(--primary);
          color: white;
          border-color: var(--primary);
        }
        .leaderboard-table-container {
          overflow-x: auto;
          border-radius: 12px;
          border: 1px solid var(--border);
          background: rgba(0, 0, 0, 0.2);
        }
        .leaderboard-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 14px;
        }
        .leaderboard-table th, .leaderboard-table td {
          padding: 12px 16px;
          border-bottom: 1px solid var(--border);
        }
        .leaderboard-table th {
          background: rgba(124, 92, 255, 0.05);
          color: var(--muted);
          font-weight: 700;
        }
        .leaderboard-table tr:last-child td {
          border-bottom: none;
        }
        .rank-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          font-size: 12px;
          font-weight: 800;
        }
        .rank-1 { background: #fbbf24; color: #78350f; }
        .rank-2 { background: #94a3b8; color: #1e293b; }
        .rank-3 { background: #b45309; color: #fef3c7; }
        .rank-other { background: rgba(255, 255, 255, 0.1); color: var(--muted); }
      `}</style>

      <section className="hero section">
        <div className="container">
          <div className="hero-copy reveal">
            <h1 className="hero-title">棋類遊戲與排行榜</h1>
            <p className="hero-subtitle">在此遊玩多款經典棋類與益智作品，挑戰 AI 或上傳您的成績至全站排行榜！</p>
          </div>
        </div>
      </section>
      
      <section className="section">
        <div className="container">
          <div className="games-grid">
            <div className="game-card reveal">
              <div className="game-icon">⚫⚪</div>
              <h3>黑白棋（Othello）</h3>
              <p className="muted">8x8 棋盤、提示合法步開關、雙人/AI 模式、翻子機制與終局計分。</p>
              <a className="btn btn-primary" href={`${import.meta.env.BASE_URL}othello.html`}>開始遊戲</a>
            </div>
            
            <div className="game-card reveal">
              <div className="game-icon">⚫⚫⚫⚫⚫</div>
              <h3>五子棋（Gomoku）</h3>
              <p className="muted">15x15 棋盤、雙人/AI 模式、悔棋、黑棋禁手（長連/雙三/雙四）與連五判定。</p>
              <a className="btn btn-primary" href={`${import.meta.env.BASE_URL}gomoku.html`}>開始遊戲</a>
            </div>
            
            <div className="game-card reveal">
              <div className="game-icon">♚♔</div>
              <h3>西洋棋（Chess）</h3>
              <p className="muted">8x8 棋盤、雙人/AI 模式、完整支援入堡、升變與強大的 Minimax。</p>
              <a className="btn btn-primary" href={`${import.meta.env.BASE_URL}chess.html`}>開始遊戲</a>
            </div>
            
            <div className="game-card reveal">
              <div className="game-icon">🚢💣</div>
              <h3>海戰棋（Battleship）</h3>
              <p className="muted">10x10 網格，部署五種船隻（不可相鄰），推理並擊沉對手艦隊。支援雙人/AI 模式。</p>
              <a className="btn btn-primary" href={`${import.meta.env.BASE_URL}battleship.html`}>開始遊戲</a>
            </div>
          </div>

          <div className="leaderboard-section reveal">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '24px' }}>🏆 全站小遊戲排行榜</h2>
                <p className="muted" style={{ margin: '4px 0 0 0', fontSize: '14px' }}>展示當前本站玩家的最高得分與最短通關秒數。</p>
              </div>
              <span style={{ fontSize: '13px', color: isConnected ? '#10b981' : '#f59e0b' }}>
                {isConnected ? '🟢 連線模式 (DB)' : '🟡 離線模式 (LocalStorage)'}
              </span>
            </div>

            <div className="leaderboard-tabs">
              <button className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>全部遊戲</button>
              <button className={`tab-btn ${activeTab === 'minesweeper' ? 'active' : ''}`} onClick={() => setActiveTab('minesweeper')}>踩地雷</button>
              <button className={`tab-btn ${activeTab === 'brick_breaker' ? 'active' : ''}`} onClick={() => setActiveTab('brick_breaker')}>打磚塊</button>
              <button className={`tab-btn ${activeTab === 'othello' ? 'active' : ''}`} onClick={() => setActiveTab('othello')}>黑白棋</button>
              <button className={`tab-btn ${activeTab === 'gomoku' ? 'active' : ''}`} onClick={() => setActiveTab('gomoku')}>五子棋</button>
              <button className={`tab-btn ${activeTab === 'chess' ? 'active' : ''}`} onClick={() => setActiveTab('chess')}>西洋棋</button>
            </div>

            <div className="leaderboard-table-container">
              {loading ? (
                <div style={{ textAlign: 'center', padding: '30px', color: 'var(--muted)' }}>載入中…</div>
              ) : sortedRecords.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px', color: 'var(--muted)' }}>查無此遊戲的對戰紀錄。</div>
              ) : (
                <table className="leaderboard-table">
                  <thead>
                    <tr>
                      <th style={{ width: '80px' }}>排名</th>
                      <th>遊戲項目</th>
                      <th>玩家名稱</th>
                      <th>成績 / 分數</th>
                      <th>對戰模式 / 難度</th>
                      <th style={{ width: '150px' }}>時間</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedRecords.map((rec, index) => {
                      const rank = index + 1;
                      let rankClass = 'rank-other';
                      if (rank === 1) rankClass = 'rank-1';
                      else if (rank === 2) rankClass = 'rank-2';
                      else if (rank === 3) rankClass = 'rank-3';

                      return (
                        <tr key={rec.id}>
                          <td>
                            <span className={`rank-badge ${rankClass}`}>{rank}</span>
                          </td>
                          <td><strong>{getGameLabel(rec.game_name)}</strong></td>
                          <td>{rec.player_name}</td>
                          <td>{getRecordValue(rec)}</td>
                          <td>{getMetadataLabel(rec)}</td>
                          <td className="muted">{new Date(rec.created_at).toLocaleDateString('zh-TW')}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
