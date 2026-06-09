import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_BASE = 'http://localhost:3001/api/todos';
const LOCAL_STORAGE_KEY = 'portfolio_todo_blog_fallback';

export default function TodoApp() {
  const [items, setItems] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form states
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');

  // Filtering & Sorting states
  const [filter, setFilter] = useState('all'); // all, active, completed
  const [selectedTag, setSelectedTag] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('desc'); // desc: new -> old, asc: old -> new

  // View & Edit Modal states
  const [viewingItem, setViewingItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editTags, setEditTags] = useState('');

  // 1. Initial Load & Auto Connect
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_BASE);
      if (!response.ok) throw new Error('API server returned error');
      const data = await response.json();
      setItems(data);
      setIsConnected(true);
    } catch (error) {
      console.warn('[Todo-Blog] Cannot connect to server. Falling back to LocalStorage.', error);
      setIsConnected(false);
      // Fallback to local storage
      const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
      setItems(localData ? JSON.parse(localData) : []);
    } finally {
      setLoading(false);
    }
  };

  // Sync to local storage only if offline
  useEffect(() => {
    if (!isConnected && !loading) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, isConnected, loading]);

  // Helper: Format tags array to string
  const formatTagsInput = (tagsArr) => {
    return Array.isArray(tagsArr) ? tagsArr.join(', ') : '';
  };

  // Helper: Parse tags input string to array
  const parseTagsInput = (tagsStr) => {
    return tagsStr
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);
  };

  // 2. API / Local Handlers

  // Create
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const parsedTags = parseTagsInput(tags);

    if (isConnected) {
      try {
        const response = await fetch(API_BASE, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, content, tags: parsedTags }),
        });
        if (!response.ok) throw new Error('Failed to save to backend');
        const newTodo = await response.json();
        setItems([newTodo, ...items]);
      } catch (error) {
        alert('儲存至後端失敗，轉為離線模式');
        setIsConnected(false);
        saveOfflineTodo(title, content, parsedTags);
      }
    } else {
      saveOfflineTodo(title, content, parsedTags);
    }

    // Reset Form
    setTitle('');
    setContent('');
    setTags('');
    setIsAdding(false);
  };

  const saveOfflineTodo = (tTitle, tContent, tTags) => {
    const localTodo = {
      id: `local-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      title: tTitle.trim(),
      content: tContent.trim(),
      tags: tTags,
      done: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setItems([localTodo, ...items]);
  };

  // Toggle Done
  const handleToggleDone = async (id) => {
    const targetItem = items.find(item => item.id === id);
    if (!targetItem) return;

    const updatedDone = !targetItem.done;

    // Optimistic UI update
    setItems(items.map(item => item.id === id ? { ...item, done: updatedDone, updatedAt: Date.now() } : item));

    if (isConnected) {
      try {
        const response = await fetch(`${API_BASE}/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ done: updatedDone }),
        });
        if (!response.ok) throw new Error('Failed to update status');
      } catch (error) {
        console.error('Failed to sync toggle status, fallback to offline mode', error);
        setIsConnected(false);
      }
    }
  };

  // Open Edit Modal
  const openEditModal = (item) => {
    setEditingItem(item);
    setEditTitle(item.title);
    setEditContent(item.content || '');
    setEditTags(formatTagsInput(item.tags));
    setViewingItem(null); // Close view modal if open
  };

  // Save Edit
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingItem || !editTitle.trim()) return;

    const parsedTags = parseTagsInput(editTags);

    setItems(items.map(item => 
      item.id === editingItem.id 
        ? { ...item, title: editTitle, content: editContent, tags: parsedTags, updatedAt: Date.now() } 
        : item
    ));

    if (isConnected) {
      try {
        const response = await fetch(`${API_BASE}/${editingItem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: editTitle, content: editContent, tags: parsedTags }),
        });
        if (!response.ok) throw new Error('Failed to update todo-blog');
      } catch (error) {
        console.error('Failed to sync edit to server, switching to offline mode', error);
        setIsConnected(false);
      }
    }

    setEditingItem(null);
  };

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm('確定要刪除這筆待辦部落格嗎？')) return;

    setItems(items.filter(item => item.id !== id));

    if (isConnected) {
      try {
        const response = await fetch(`${API_BASE}/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete item');
      } catch (error) {
        console.error('Failed to sync delete to server, switching to offline mode', error);
        setIsConnected(false);
      }
    }
    
    // Close views if they were for the deleted item
    if (viewingItem && viewingItem.id === id) setViewingItem(null);
    if (editingItem && editingItem.id === id) setEditingItem(null);
  };

  // Clear completed
  const handleClearCompleted = async () => {
    const completedItems = items.filter(item => item.done);
    if (completedItems.length === 0) return;
    if (!window.confirm(`確定要刪除 ${completedItems.length} 筆已完成項目？`)) return;

    setItems(items.filter(item => !item.done));

    if (isConnected) {
      // Deleting all completed items sequentially
      for (const item of completedItems) {
        try {
          await fetch(`${API_BASE}/${item.id}`, { method: 'DELETE' });
        } catch (error) {
          console.error(`Failed to delete completed item: ${item.id}`, error);
          setIsConnected(false);
          break;
        }
      }
    }
  };

  // Re-try Connection manually
  const handleRetryConnection = () => {
    fetchTodos();
  };

  // 3. Filtering and Searching Logic
  const allTags = Array.from(
    new Set(items.flatMap(item => item.tags || []))
  );

  const processedItems = (() => {
    let list = [...items];

    // Status filter
    if (filter === 'active') list = list.filter(item => !item.done);
    if (filter === 'completed') list = list.filter(item => item.done);

    // Tag filter
    if (selectedTag) {
      list = list.filter(item => item.tags && item.tags.includes(selectedTag));
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        item =>
          item.title.toLowerCase().includes(q) ||
          (item.content && item.content.toLowerCase().includes(q))
      );
    }

    // Sort
    list.sort((a, b) => {
      const field = 'createdAt';
      const factor = sortOrder === 'asc' ? 1 : -1;
      return (a[field] - b[field]) * factor;
    });

    return list;
  })();

  return (
    <>
      <style>{`
        .todo-blog-container { max-width: 900px; margin: 0 auto; padding: 20px 15px; }
        
        /* Connection Status bar */
        .conn-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 20px;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }
        .conn-badge.connected {
          background: rgba(16, 185, 129, 0.15);
          color: #10b981;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }
        .conn-badge.disconnected {
          background: rgba(245, 158, 11, 0.15);
          color: #f59e0b;
          border: 1px solid rgba(245, 158, 11, 0.3);
          cursor: pointer;
        }
        .conn-badge.disconnected:hover {
          background: rgba(245, 158, 11, 0.25);
        }
        .conn-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          display: inline-block;
        }
        .connected .conn-dot { background-color: #10b981; box-shadow: 0 0 8px #10b981; }
        .disconnected .conn-dot { background-color: #f59e0b; box-shadow: 0 0 8px #f59e0b; }

        /* Form styling */
        .add-btn-trigger {
          width: 100%;
          padding: 14px;
          border-radius: 14px;
          border: 2px dashed var(--border);
          background: rgba(255, 255, 255, 0.02);
          color: var(--text);
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-bottom: 20px;
        }
        .add-btn-trigger:hover {
          border-color: var(--primary);
          background: rgba(124, 92, 255, 0.05);
          color: var(--primary);
        }
        .blog-form-panel {
          padding: 24px;
          border-radius: 16px;
          border: 1px solid var(--border);
          background: var(--panel);
          margin-bottom: 24px;
          animation: slideDown 0.3s ease-out;
        }
        .form-group {
          margin-bottom: 16px;
        }
        .form-group label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: var(--muted);
          margin-bottom: 6px;
        }
        .blog-input, .blog-textarea {
          width: 100%;
          padding: 12px 14px;
          border-radius: 10px;
          border: 1px solid var(--border);
          background: rgba(0, 0, 0, 0.2);
          color: var(--text);
          font: inherit;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .blog-input:focus, .blog-textarea:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: var(--focus);
        }
        .blog-textarea {
          min-height: 120px;
          resize: vertical;
        }
        
        /* Search & Toolbar styling */
        .search-row {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 12px;
          margin-bottom: 16px;
        }
        @media (max-width: 500px) {
          .search-row { grid-template-columns: 1fr; }
        }
        .filter-row {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--border);
          margin-bottom: 20px;
        }
        .tag-filter-container {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 16px;
          align-items: center;
        }
        .tag-pill {
          padding: 4px 10px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 600;
          background: rgba(255, 255, 255, 0.05);
          color: var(--muted);
          cursor: pointer;
          border: 1px solid transparent;
          transition: all 0.2s;
        }
        .tag-pill:hover {
          background: rgba(124, 92, 255, 0.15);
          color: var(--text);
        }
        .tag-pill.active {
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          color: white;
          border-color: rgba(255, 255, 255, 0.1);
        }
        .clear-tag-btn {
          font-size: 11px;
          color: #ef4444;
          background: transparent;
          border: none;
          cursor: pointer;
          font-weight: bold;
        }

        /* Todo-Blog Cards Grid */
        .blog-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }
        
        .blog-card {
          border-radius: 16px;
          border: 1px solid var(--border);
          background: var(--panel);
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
          position: relative;
          overflow: hidden;
        }
        .blog-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.25);
          border-color: rgba(124, 92, 255, 0.3);
        }
        .blog-card.done-card {
          border-color: rgba(255, 255, 255, 0.05);
          opacity: 0.7;
        }
        
        .blog-card-header {
          display: grid;
          grid-template-columns: auto 1fr auto;
          gap: 12px;
          align-items: center;
        }
        .todo-checkbox {
          width: 20px;
          height: 20px;
          border-radius: 6px;
          border: 2px solid var(--border);
          cursor: pointer;
          accent-color: var(--primary);
        }
        .blog-card-title {
          font-size: 18px;
          font-weight: 700;
          color: var(--text);
          cursor: pointer;
          transition: color 0.2s;
        }
        .blog-card-title:hover {
          color: var(--primary);
        }
        .done-card .blog-card-title {
          text-decoration: line-through;
          color: var(--muted);
        }

        .blog-card-date {
          font-size: 12px;
          color: var(--muted);
        }
        .blog-card-excerpt {
          font-size: 14px;
          line-height: 1.6;
          color: var(--text);
          opacity: 0.85;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          white-space: pre-wrap;
        }
        .blog-card-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .blog-tag-badge {
          font-size: 11px;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 6px;
          background: rgba(124, 92, 255, 0.1);
          color: #a78bfa;
          border: 1px solid rgba(124, 92, 255, 0.2);
        }
        
        .blog-card-footer {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 8px;
          padding-top: 12px;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        /* Modal Window System */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
          animation: fadeIn 0.2s ease;
        }
        .modal-content {
          background: var(--panel);
          border: 1px solid var(--border);
          border-radius: 20px;
          width: 100%;
          max-width: 650px;
          max-height: 85vh;
          overflow-y: auto;
          box-shadow: 0 20px 40px rgba(0,0,0,0.5);
          animation: scaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .modal-header {
          padding: 20px 24px;
          border-bottom: 1px solid var(--border);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .modal-close {
          background: transparent;
          border: none;
          color: var(--muted);
          font-size: 24px;
          cursor: pointer;
        }
        .modal-close:hover { color: var(--text); }
        .modal-body {
          padding: 24px;
        }
        .modal-title {
          font-size: 24px;
          font-weight: 800;
          margin-bottom: 8px;
          line-height: 1.3;
        }
        .modal-meta-row {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          align-items: center;
          font-size: 13px;
          color: var(--muted);
          margin-bottom: 20px;
        }
        .modal-content-text {
          font-size: 16px;
          line-height: 1.8;
          color: var(--text);
          opacity: 0.9;
          white-space: pre-wrap;
          margin-bottom: 24px;
          word-break: break-word;
        }
        .modal-footer {
          padding: 16px 24px;
          border-top: 1px solid var(--border);
          display: flex;
          justify-content: flex-end;
          gap: 12px;
        }

        /* Helper Animations */
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleUp {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>

      {/* Hero Section */}
      <section className="hero section">
        <div className="container">
          <div className="hero-copy reveal">
            <p className="badge">
              <span className="dot" aria-hidden="true"></span>
              全端實作專案
            </p>
            <h1 className="hero-title">待辦部落格 (Todo-Blog)</h1>
            <p className="hero-subtitle">
              將傳統待辦事項擴充為部落格型態，支援**標題、日誌內容與標籤分類**。
              整合後端 Node.js / Express，具備自動離線降級儲存機制！
            </p>
            <div className="hero-cta">
              <a className="btn btn-primary" href="#app">進入部落格</a>
              <Link className="btn btn-ghost" to="/#projects">回到首頁</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main App Section */}
      <section className="section" id="app">
        <div className="container todo-blog-container">
          
          {/* Connection Status Badge */}
          <div className="reveal">
            {isConnected ? (
              <div className="conn-badge connected">
                <span className="conn-dot"></span>
                <span>🟢 已連線伺服器 (Server Mode)</span>
              </div>
            ) : (
              <div 
                className="conn-badge disconnected" 
                title="點擊重試連線後端" 
                onClick={handleRetryConnection}
              >
                <span className="conn-dot"></span>
                <span>🟡 離線模式 (LocalStorage Fallback) ── 點擊重試連線</span>
              </div>
            )}
          </div>

          {/* Trigger to show create form */}
          {!isAdding ? (
            <button 
              className="add-btn-trigger reveal"
              onClick={() => setIsAdding(true)}
            >
              + 撰寫新的待辦部落格日誌
            </button>
          ) : (
            <div className="blog-form-panel reveal">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h3 style={{ margin: 0 }}>寫一篇新日誌…</h3>
                <button className="clear-tag-btn" onClick={() => setIsAdding(false)}>取消</button>
              </div>
              <form onSubmit={handleSubmit} autoComplete="off">
                <div className="form-group">
                  <label htmlFor="todo-title">標題 (Title) *</label>
                  <input
                    id="todo-title"
                    className="blog-input"
                    type="text"
                    required
                    maxLength="200"
                    placeholder="例如：實作全端 Todo-Blog 功能"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="todo-content">詳細日誌內容 (Content)</label>
                  <textarea
                    id="todo-content"
                    className="blog-textarea"
                    placeholder="撰寫此待辦事項的詳細筆記、規劃或執行紀錄..."
                    value={content}
                    onChange={e => setContent(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="todo-tags">分類標籤 (Tags) ── 使用逗號隔開</label>
                  <input
                    id="todo-tags"
                    className="blog-input"
                    type="text"
                    placeholder="例如：Fullstack, React, Node"
                    value={tags}
                    onChange={e => setTags(e.target.value)}
                  />
                </div>

                <button className="btn btn-primary" type="submit" style={{ width: '100%' }}>
                  發佈待辦日誌
                </button>
              </form>
            </div>
          )}

          {/* Search and Sort Toolbar */}
          <div className="panel reveal">
            <div className="search-row">
              <input
                className="blog-input"
                type="text"
                placeholder="搜尋標題或內文…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              <div className="todo-sort" style={{ margin: 0 }}>
                <select 
                  aria-label="排序依據" 
                  value={sortOrder} 
                  onChange={e => setSortOrder(e.target.value)}
                  className="blog-input"
                  style={{ width: 'auto' }}
                >
                  <option value="desc">新 → 舊</option>
                  <option value="asc">舊 → 新</option>
                </select>
              </div>
            </div>

            {/* Tag cloud filter */}
            {allTags.length > 0 && (
              <div className="tag-filter-container">
                <span style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--muted)', marginRight: '6px' }}>
                  標籤篩選:
                </span>
                {allTags.map(tag => (
                  <span
                    key={tag}
                    className={`tag-pill ${selectedTag === tag ? 'active' : ''}`}
                    onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                  >
                    #{tag}
                  </span>
                ))}
                {selectedTag && (
                  <button className="clear-tag-btn" onClick={() => setSelectedTag(null)}>
                    清除篩選
                  </button>
                )}
              </div>
            )}

            {/* Filters Row */}
            <div className="filter-row">
              <div className="todo-filters">
                <button 
                  type="button" 
                  onClick={() => setFilter('all')} 
                  className={filter === 'all' ? 'is-on' : ''}
                >
                  全部 ({items.length})
                </button>
                <button 
                  type="button" 
                  onClick={() => setFilter('active')} 
                  className={filter === 'active' ? 'is-on' : ''}
                >
                  進行中 ({items.filter(x => !x.done).length})
                </button>
                <button 
                  type="button" 
                  onClick={() => setFilter('completed')} 
                  className={filter === 'completed' ? 'is-on' : ''}
                >
                  已完成 ({items.filter(x => x.done).length})
                </button>
              </div>
              
              <button 
                type="button" 
                className="btn btn-ghost" 
                onClick={handleClearCompleted}
                disabled={items.filter(x => x.done).length === 0}
                style={{ padding: '6px 12px', fontSize: '13px' }}
              >
                清除已完成
              </button>
            </div>

            {/* Grid List */}
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--muted)' }}>
                載入中…
              </div>
            ) : processedItems.length === 0 ? (
              <div className="todo-empty">
                {items.length > 0 ? (
                  <p>目前篩選與搜尋下<strong>找不到任何日誌</strong>。</p>
                ) : (
                  <p>目前沒有日誌，<strong>在上方點擊新增</strong>開始第一篇待辦日誌！</p>
                )}
              </div>
            ) : (
              <div className="blog-grid">
                {processedItems.map(item => (
                  <article 
                    key={item.id} 
                    className={`blog-card ${item.done ? 'done-card' : ''}`}
                  >
                    <div className="blog-card-header">
                      <input
                        type="checkbox"
                        className="todo-checkbox"
                        checked={item.done}
                        onChange={() => handleToggleDone(item.id)}
                        aria-label="標記狀態"
                      />
                      <h3 
                        className="blog-card-title"
                        onClick={() => setViewingItem(item)}
                      >
                        {item.title}
                      </h3>
                      <span className="blog-card-date">
                        {new Date(item.createdAt).toLocaleDateString('zh-TW')}
                      </span>
                    </div>

                    {item.content && (
                      <p 
                        className="blog-card-excerpt" 
                        onClick={() => setViewingItem(item)}
                      >
                        {item.content}
                      </p>
                    )}

                    {item.tags && item.tags.length > 0 && (
                      <div className="blog-card-tags">
                        {item.tags.map(tag => (
                          <span 
                            key={tag} 
                            className="blog-tag-badge"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTag(selectedTag === tag ? null : tag);
                            }}
                            style={{ cursor: 'pointer' }}
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="blog-card-footer">
                      <button 
                        type="button" 
                        className="btn btn-small btn-primary"
                        onClick={() => setViewingItem(item)}
                      >
                        閱讀詳細
                      </button>
                      <button 
                        type="button" 
                        className="btn btn-small btn-ghost"
                        onClick={() => openEditModal(item)}
                      >
                        編輯
                      </button>
                      <button 
                        type="button" 
                        className="todo-del"
                        onClick={() => handleDelete(item.id)}
                      >
                        刪除
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* --- Detail Modal View --- */}
      {viewingItem && (
        <div className="modal-overlay" onClick={() => setViewingItem(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="blog-tag-badge" style={{ textTransform: 'uppercase' }}>
                {viewingItem.done ? '✅ 已完成' : '⏳ 進行中'}
              </span>
              <button className="modal-close" onClick={() => setViewingItem(null)}>&times;</button>
            </div>
            
            <div className="modal-body">
              <h2 className="modal-title">{viewingItem.title}</h2>
              
              <div className="modal-meta-row">
                <span>📅 建立於：{new Date(viewingItem.createdAt).toLocaleString('zh-TW')}</span>
                {viewingItem.updatedAt !== viewingItem.createdAt && (
                  <span>🔄 更新於：{new Date(viewingItem.updatedAt).toLocaleString('zh-TW')}</span>
                )}
              </div>

              <div className="modal-content-text">
                {viewingItem.content || <em style={{ color: 'var(--muted)' }}>此待辦項目沒有撰寫詳細內容。</em>}
              </div>

              {viewingItem.tags && viewingItem.tags.length > 0 && (
                <div style={{ marginBottom: '10px' }}>
                  <span style={{ fontSize: '13px', color: 'var(--muted)', fontWeight: 'bold', marginRight: '6px' }}>標籤：</span>
                  <div style={{ display: 'inline-flex', gap: '6px', flexWrap: 'wrap' }}>
                    {viewingItem.tags.map(tag => (
                      <span key={tag} className="blog-tag-badge">#{tag}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-ghost" 
                onClick={() => openEditModal(viewingItem)}
              >
                編輯日誌
              </button>
              <button 
                type="button" 
                className="btn btn-primary" 
                onClick={() => setViewingItem(null)}
              >
                關閉
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Edit Modal View --- */}
      {editingItem && (
        <div className="modal-overlay" onClick={() => setEditingItem(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ margin: 0 }}>編輯待辦日誌</h3>
              <button className="modal-close" onClick={() => setEditingItem(null)}>&times;</button>
            </div>
            
            <form onSubmit={handleSaveEdit}>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="edit-title">標題 (Title) *</label>
                  <input
                    id="edit-title"
                    className="blog-input"
                    type="text"
                    required
                    maxLength="200"
                    value={editTitle}
                    onChange={e => setEditTitle(e.target.value)}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="edit-content">詳細內容 (Content)</label>
                  <textarea
                    id="edit-content"
                    className="blog-textarea"
                    value={editContent}
                    onChange={e => setEditContent(e.target.value)}
                    style={{ minHeight: '180px' }}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="edit-tags">分類標籤 (Tags) ── 使用逗號隔開</label>
                  <input
                    id="edit-tags"
                    className="blog-input"
                    type="text"
                    value={editTags}
                    onChange={e => setEditTags(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-ghost" 
                  onClick={() => setEditingItem(null)}
                >
                  取消
                </button>
                <button type="submit" className="btn btn-primary">
                  儲存變更
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

