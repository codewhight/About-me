import React from 'react';
import { Link } from 'react-router-dom';

export default function BoardGames() {
  return (
    <>
      <section className="hero section">
        <div className="container">
          <div className="hero-copy reveal">
            <h1 className="hero-title">棋類遊戲</h1>
            <p className="hero-subtitle">新增兩款可直接在瀏覽器遊玩的棋類作品，皆支援雙人模式與 AI 對戰。</p>
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
          </div>
        </div>
      </section>
    </>
  );
}
