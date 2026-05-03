import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Chart from 'chart.js/auto';

const API = "https://jsonplaceholder.typicode.com/posts";

const palette = [
  "rgba(124, 92, 255, 0.85)",
  "rgba(57, 208, 255, 0.85)",
  "rgba(45, 212, 191, 0.85)",
  "rgba(251, 191, 36, 0.85)",
  "rgba(248, 113, 113, 0.85)",
  "rgba(167, 139, 250, 0.85)",
  "rgba(56, 189, 248, 0.85)",
  "rgba(52, 211, 153, 0.85)",
  "rgba(251, 146, 60, 0.85)",
  "rgba(244, 114, 182, 0.85)",
];

export default function DataViz() {
  const [status, setStatus] = useState('loading'); // 'loading', 'error', 'empty', 'chart'
  const [errMsg, setErrMsg] = useState('');
  const [metaText, setMetaText] = useState('');
  
  const canvasRef = useRef(null);
  const chartInstance = useRef(null);

  const fetchPosts = async () => {
    const res = await fetch(`${API}?_limit=100`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  };

  const aggregate = (posts) => {
    const counts = {};
    posts.forEach((p) => {
      const u = p.userId;
      counts[u] = (counts[u] || 0) + 1;
    });
    const ids = Object.keys(counts).map(Number).sort((a, b) => a - b);
    return {
      labels: ids.map((id) => `使用者 ${id}`),
      data: ids.map((id) => counts[id]),
    };
  };

  const renderChart = (labels, data) => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    
    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "文章數",
            data,
            backgroundColor: labels.map((_, i) => palette[i % palette.length]),
            borderWidth: 0,
            borderRadius: 8,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
        },
        scales: {
          x: {
            ticks: { color: "#94a3b8", maxRotation: 45 },
            grid: { color: "rgba(148, 163, 184, 0.15)" },
          },
          y: {
            beginAtZero: true,
            ticks: { stepSize: 1, color: "#94a3b8" },
            grid: { color: "rgba(148, 163, 184, 0.15)" },
          },
        },
      },
    });
  };

  const loadData = async () => {
    setStatus('loading');
    try {
      const posts = await fetchPosts();
      if (!posts.length) {
        setStatus('empty');
        return;
      }
      const { labels, data } = aggregate(posts);
      setMetaText(`已載入 ${posts.length} 筆文章，統計 ${labels.length} 位使用者。`);
      setStatus('chart');
      
      // Allow render to complete so canvas is in DOM
      setTimeout(() => renderChart(labels, data), 0);
      
    } catch (e) {
      setErrMsg(e.message || String(e));
      setStatus('error');
    }
  };

  useEffect(() => {
    loadData();
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  const handleEmptyDemo = () => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
      chartInstance.current = null;
    }
    setStatus('empty');
  };

  return (
    <>
      <style>{`
        .dv-wrap { max-width: 900px; margin: 0 auto; }
        .dv-chart-card { position: relative; min-height: 320px; padding: 18px; border-radius: var(--radius); border: 1px solid var(--border); background: var(--panel); }
        .dv-loading, .dv-error, .dv-empty { display: grid; place-items: center; min-height: 280px; text-align: center; padding: 20px; color: var(--muted); }
        .dv-error strong { color: #f87171; }
        .dv-meta { margin-top: 14px; font-size: 13px; color: var(--muted); }
        .dv-controls { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 14px; align-items: center; }
      `}</style>
      
      <section className="hero section">
        <div className="container">
          <div className="hero-copy reveal">
            <p className="badge"><span className="dot" aria-hidden="true"></span> 作品 C</p>
            <h1 className="hero-title">資料視覺化儀表板</h1>
            <p className="hero-subtitle">
              使用 <strong>Fetch</strong> 取得公開測試 API（JSONPlaceholder）的文章資料，統計各使用者的文章數量，以
              <strong>Chart.js</strong> 長條圖呈現；含載入中、錯誤重試與空資料示範。
            </p>
            <div className="hero-cta">
              <a className="btn btn-primary" href="#viz">查看圖表</a>
              <Link className="btn btn-ghost" to="/#projects">回到作品</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="viz">
        <div className="container dv-wrap">
          <header className="section-head reveal">
            <h2 className="section-title">各使用者文章數（範例）</h2>
            <p className="section-desc">
              API：<code>jsonplaceholder.typicode.com/posts</code>。僅作教學／展示用途。
            </p>
          </header>

          <div className="dv-controls reveal">
            <button type="button" className="btn btn-primary" onClick={loadData}>重新載入資料</button>
            <button type="button" className="btn btn-ghost" onClick={handleEmptyDemo}>示範：空資料狀態</button>
          </div>

          <div className="dv-chart-card reveal">
            {status === 'loading' && (
              <div className="dv-loading">
                <p>載入中…</p>
              </div>
            )}
            
            {status === 'error' && (
              <div className="dv-error">
                <p>
                  <strong>載入失敗</strong><br />
                  <span>{errMsg}</span>
                </p>
                <button type="button" className="btn btn-primary" onClick={loadData} style={{ marginTop: '12px' }}>
                  重試
                </button>
              </div>
            )}
            
            {status === 'empty' && (
              <div className="dv-empty">
                <p>目前為<strong>空資料</strong>狀態（示範用）。按「重新載入資料」可恢復圖表。</p>
              </div>
            )}
            
            <div hidden={status !== 'chart'} style={{ position: 'relative', height: '280px' }}>
              <canvas ref={canvasRef} aria-label="長條圖"></canvas>
            </div>
            
            {status === 'chart' && (
              <p className="dv-meta">{metaText}</p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
