import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { initGlobalScripts } from '../utils/script';

export default function Layout({ children }) {
  const location = useLocation();

  useEffect(() => {
    // Give DOM a tick to render children before running the script
    setTimeout(() => {
      initGlobalScripts();
    }, 100);
  }, [location.pathname]);

  return (
    <>
      <canvas className="fx-canvas" aria-hidden="true"></canvas>
      <div className="cursor-glow" aria-hidden="true"></div>
      <div className="scroll-progress" aria-hidden="true">
        <div className="scroll-progress-bar"></div>
      </div>

      <a className="skip-link" href="#content">跳到主要內容</a>

      <header className="site-header" id="top">
        <div className="container header-inner">
          <Link className="brand" to="/" aria-label="回到頁首">
            <span className="brand-text">林彥廷</span>
          </Link>

          <nav className="nav" aria-label="主要導覽">
            <button
              className="nav-toggle"
              type="button"
              aria-expanded="false"
              aria-controls="nav-menu"
            >
              <span className="nav-toggle-icon" aria-hidden="true"></span>
              <span className="sr-only">開啟/關閉選單</span>
            </button>

            <div className="nav-menu" id="nav-menu">
              <Link className="nav-link" to="/about.html">關於我</Link>
              <a className="nav-link" href="/#skills" data-scrollspy>技能</a>
              <a className="nav-link" href="/#projects" data-scrollspy>作品</a>
              <a className="nav-link" href="/#timeline" data-scrollspy>經歷</a>
              <a className="nav-link" href="/#contact" data-scrollspy>聯絡</a>
            </div>
          </nav>

          <div className="header-actions">

            <a className="btn btn-primary" href="/#contact">合作邀約</a>
          </div>
        </div>
      </header>

      <main id="content">
        {children}

        <div
          className="modal"
          id="project-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-modal-title"
          hidden
        >
          <div className="modal-backdrop" data-modal-close></div>
          <div className="modal-card" role="document">
            <div className="modal-head">
              <h3 className="modal-title" id="project-modal-title">作品詳情</h3>
              <button className="btn btn-small btn-ghost" type="button" data-modal-close>
                關閉
              </button>
            </div>
            <div className="modal-body">
              <p className="muted" id="project-modal-desc"></p>
              <div className="modal-meta" id="project-modal-meta"></div>
            </div>
            <div className="modal-actions" id="project-modal-actions"></div>
          </div>
        </div>

        <button className="back-to-top" type="button" aria-label="回到頁首" hidden>
          ↑
        </button>
      </main>

      <footer className="site-footer">
        <div className="container footer-inner">
          <p className="muted">© <span data-year></span> 林彥廷. All rights reserved.</p>
          <p className="muted">
            Built with <span aria-hidden="true">React · Vite</span
            ><span className="sr-only">React、Vite</span>
          </p>
        </div>
      </footer>
    </>
  );
}
