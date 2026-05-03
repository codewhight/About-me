import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const STORAGE_KEY = "portfolio_todo_b_v1";

const uid = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

export default function TodoApp() {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });
  const [filter, setFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('desc');
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items]);

  const filteredItems = (() => {
    let out = items.slice();
    if (filter === 'active') out = out.filter(x => !x.done);
    if (filter === 'completed') out = out.filter(x => x.done);
    const dir = sortOrder === 'asc' ? 1 : -1;
    out.sort((a, b) => (a.createdAt - b.createdAt) * dir);
    return out;
  })();

  const handleSubmit = (e) => {
    e.preventDefault();
    const t = inputValue.trim();
    if (!t) return;
    setItems([
      ...items,
      {
        id: uid(),
        text: t.slice(0, 200),
        done: false,
        createdAt: Date.now(),
      }
    ]);
    setInputValue('');
  };

  const handleToggle = (id) => {
    setItems(items.map(item => item.id === id ? { ...item, done: !item.done } : item));
  };

  const handleDelete = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleEdit = (id, oldText) => {
    const nv = window.prompt("編輯待辦：", oldText);
    if (nv == null) return;
    const t = nv.trim();
    if (!t) return;
    setItems(items.map(item => item.id === id ? { ...item, text: t.slice(0, 200) } : item));
  };

  const handleClearDone = () => {
    const n = items.filter((x) => x.done).length;
    if (n === 0) return;
    if (!window.confirm(`確定清除 ${n} 筆已完成？`)) return;
    setItems(items.filter((x) => !x.done));
  };

  return (
    <>
      <style>{`
        .todo-wrap { max-width: 640px; margin: 0 auto; }
        .todo-form { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 14px; }
        .todo-input { flex: 1 1 200px; padding: 11px 14px; border-radius: 12px; border: 1px solid var(--border); background: var(--panel); color: var(--text); font: inherit; }
        .todo-input:focus { outline: none; box-shadow: var(--focus); }
        .todo-toolbar { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; margin-bottom: 12px; }
        .todo-filters { display: flex; gap: 6px; flex-wrap: wrap; }
        .todo-filters button { padding: 7px 12px; border-radius: 999px; border: 1px solid var(--border); background: transparent; color: var(--muted); font-weight: 700; font-size: 13px; cursor: pointer; }
        .todo-filters button.is-on { background: linear-gradient(135deg, rgba(124, 92, 255, 0.35), rgba(57, 208, 255, 0.2)); color: var(--text); border-color: rgba(124, 92, 255, 0.4); }
        .todo-sort { margin-left: auto; display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--muted); }
        .todo-sort select { padding: 8px 10px; border-radius: 10px; border: 1px solid var(--border); background: var(--panel); color: var(--text); font: inherit; }
        .todo-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
        .todo-item { display: grid; grid-template-columns: auto 1fr auto; gap: 10px; align-items: center; padding: 12px 14px; border-radius: 14px; border: 1px solid var(--border); background: var(--panel); }
        .todo-item.done .todo-text { text-decoration: line-through; opacity: 0.65; }
        .todo-text { cursor: pointer; word-break: break-word; }
        .todo-del { padding: 6px 10px; border-radius: 10px; border: 1px solid var(--border); background: transparent; color: var(--muted); font-size: 12px; cursor: pointer; }
        .todo-del:hover { color: #f87171; border-color: rgba(248, 113, 113, 0.5); }
        .todo-empty { text-align: center; padding: 28px 16px; color: var(--muted); border: 1px dashed var(--border); border-radius: 14px; }
        .todo-empty strong { color: var(--text); }
      `}</style>
      
      <section className="hero section">
        <div className="container">
          <div className="hero-copy reveal">
            <p className="badge"><span className="dot" aria-hidden="true"></span> 作品 B</p>
            <h1 className="hero-title">待辦清單 Web App</h1>
            <p className="hero-subtitle">
              新增、完成、編輯、刪除；篩選「全部／進行中／已完成」；依建立時間排序；資料儲存在
              <strong>LocalStorage</strong>，重新整理不遺失。
            </p>
            <div className="hero-cta">
              <a className="btn btn-primary" href="#app">開始使用</a>
              <Link className="btn btn-ghost" to="/#projects">回到作品</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="app">
        <div className="container todo-wrap">
          <header className="section-head reveal">
            <h2 className="section-title">我的待辦</h2>
            <p className="section-desc">
              按「新增」加入項目；點文字可編輯；勾選表示完成；可清除所有已完成項目。
            </p>
          </header>

          <div className="panel reveal">
            <form className="todo-form" onSubmit={handleSubmit} autoComplete="off">
              <input
                className="todo-input"
                type="text"
                maxLength="200"
                placeholder="輸入待辦事項…"
                aria-label="新待辦內容"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
              />
              <button className="btn btn-primary" type="submit">新增</button>
            </form>

            <div className="todo-toolbar">
              <div className="todo-filters" role="group" aria-label="篩選">
                <button type="button" onClick={() => setFilter('all')} className={filter === 'all' ? 'is-on' : ''}>全部</button>
                <button type="button" onClick={() => setFilter('active')} className={filter === 'active' ? 'is-on' : ''}>進行中</button>
                <button type="button" onClick={() => setFilter('completed')} className={filter === 'completed' ? 'is-on' : ''}>已完成</button>
              </div>
              <div className="todo-sort">
                <label htmlFor="todo-sort">排序</label>
                <select id="todo-sort" aria-label="依建立時間排序" value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
                  <option value="desc">新 → 舊</option>
                  <option value="asc">舊 → 新</option>
                </select>
              </div>
            </div>

            <button type="button" className="btn btn-ghost" onClick={handleClearDone} style={{ marginBottom: '12px' }}>
              清除已完成
            </button>

            {filteredItems.length === 0 ? (
              <div className="todo-empty">
                {items.length > 0 ? (
                  <p>目前篩選下<strong>沒有待辦</strong>，可切換「全部」或新增一筆。</p>
                ) : (
                  <p>尚無待辦，<strong>在上方輸入並按新增</strong>開始。</p>
                )}
              </div>
            ) : (
              <ul className="todo-list" aria-live="polite">
                {filteredItems.map(item => (
                  <li key={item.id} className={`todo-item ${item.done ? 'done' : ''}`}>
                    <input
                      type="checkbox"
                      checked={item.done}
                      aria-label="標記完成"
                      onChange={() => handleToggle(item.id)}
                    />
                    <span
                      className="todo-text"
                      title="雙擊編輯"
                      onDoubleClick={() => handleEdit(item.id, item.text)}
                    >
                      {item.text}
                    </span>
                    <button type="button" className="todo-del" onClick={() => handleDelete(item.id)}>
                      刪除
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
