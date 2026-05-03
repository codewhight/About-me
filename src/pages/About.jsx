import React from 'react';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <>
      <section className="hero section">
        <div className="container">
          <div className="hero-copy reveal">
            <p className="badge">
              <span className="dot" aria-hidden="true"></span>
              關於我
            </p>
            <h1 className="hero-title">【實習應徵自傳】林彥廷</h1>
            <p className="hero-subtitle">
              具備 RAG 開發實力與優化思維的資工人才。來自新竹，就讀國立金門大學資訊工程系，
              持續以工程化方式解決問題並創造可量化的價值。
            </p>
            <div className="hero-cta">
              <a className="btn btn-primary" href="#story">開始閱讀</a>
              <Link className="btn btn-ghost" to="/">回到首頁</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="story">
        <div className="container">
          <header className="section-head reveal">
            <h2 className="section-title">一、專業背景：跨越環境挑戰，深耕程式底蘊</h2>
            <p className="section-desc">
              主動離開舒適圈，培養獨立性、適應力與長期自我管理能力。
            </p>
          </header>
          <div className="panel reveal">
            <p className="muted" style={{ lineHeight: 1.9, margin: 0 }}>
              我是林彥廷，來自新竹。為了磨練自身的獨立性與適應力，我選擇離開舒適圈，前往國立金門大學資訊工程系就讀。
              這段異地求學經驗，培養了我高度的自主管理能力與解決問題的韌性。
            </p>
            <p className="muted" style={{ lineHeight: 1.9, margin: '12px 0 0' }}>
              我的程式啟蒙自國中 Scratch 邏輯訓練，高中取得 APCS 觀念三級、實作三級，大學期間持續精進技術並習慣使用 GitHub 進行版本管理。
              我深信開發者的價值不只在程式碼，更在於能將複雜技術轉化為易懂語言的溝通力，這也在我多年擔任程式設計助教與講師的經歷中獲得驗證。
            </p>
          </div>
        </div>
      </section>

      <section className="section" id="education">
        <div className="container">
          <header className="section-head reveal">
            <h2 className="section-title">二、技術實戰：專精 RAG 架構與生成式 AI 應用</h2>
            <p className="section-desc">
              聚焦 AI 技術與數據處理的實務整合，強調回應精度、系統穩定與可落地性。
            </p>
          </header>
          <div className="about-grid">
            <div className="panel reveal">
              <h3 className="panel-title">大學專題：AI 智慧導覽員</h3>
              <ul className="list">
                <li>獨立建立資料庫並轉換為向量資料庫（Vector Database）。</li>
                <li>使用 RAG 架構強化回應準確度與可追溯性。</li>
                <li>深入理解 Embedding 與語義搜尋優化流程。</li>
              </ul>
            </div>
            <div className="panel reveal">
              <h3 className="panel-title">競賽與高壓開發</h3>
              <ul className="list">
                <li>參與 AI CUP 2025 玉山人工智慧挑戰賽。</li>
                <li>參與 ITSA 生成式 AI 應用競賽。</li>
                <li>在時限內產出高效能與高穩定度程式。</li>
              </ul>
            </div>
            <div className="panel reveal">
              <h3 className="panel-title">專業認證</h3>
              <p className="muted">
                考取 IT Specialist（ITS）資訊科技專家認證，確認具備業界標準的基礎架構知識與實作能力。
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="values">
        <div className="container">
          <header className="section-head reveal">
            <h2 className="section-title">三、工程師思維：從遊戲與實作中優化 SOP</h2>
            <p className="section-desc">
              以「持續改善」為核心，建立可複製、可驗證的問題排查與優化流程。
            </p>
          </header>
          <div className="panel reveal">
            <p className="muted" style={{ lineHeight: 1.9, margin: 0 }}>
              我習慣將持續改善精神融入生活與技術開發。閒暇時透過 MOBA 競賽遊戲鍛鍊邏輯，主動觀看對戰回放、分析數據、建立並改良操作 SOP。
              這種從回饋中尋求優化空間的習慣，讓我在面對軟體 Bug 或效能瓶頸（如 Unity 物件碰撞邏輯、RAG 檢索偏差）時，
              能快速建立系統化的 troubleshooting 流程。
            </p>
            <p className="muted" style={{ lineHeight: 1.9, margin: '12px 0 0' }}>
              在開發 Unity（C#）遊戲與個人網站時，我也善用 AI 協作輔助，透過精準 Prompt Engineering 提升開發效率與 UI/UX 載入表現。
            </p>
          </div>
        </div>
      </section>

      <section className="section" id="future">
        <div className="container">
          <header className="section-head reveal">
            <h2 className="section-title">四、職場穩定度與團隊精神：獲得業界肯定的協作者</h2>
            <p className="section-desc">
              穩定、負責任、可長期協作，並能在跨域團隊中落實標準化溝通。
            </p>
          </header>
          <div className="panel reveal">
            <p className="muted" style={{ lineHeight: 1.9, margin: 0 }}>
              我長期擔任大學助教與補習班助教，連續多年獲得主管好評並續聘。這證明了我具備高度穩定度、責任感與抗壓性。
            </p>
            <p className="muted" style={{ lineHeight: 1.9, margin: '12px 0 0' }}>
              我曾獲遠哲科學趣味競賽全國第五名，並在社團擔任講師。這些經驗讓我深刻理解：在高度分工的產業中，
              良好的團隊默契與標準化溝通是專案成功的關鍵。
            </p>
          </div>
        </div>
      </section>

      <section className="section" id="goal">
        <div className="container">
          <header className="section-head reveal">
            <h2 className="section-title">五、未來展望</h2>
            <p className="section-desc">將 RAG 開發經驗與數據分析能力轉化為可衡量的產能貢獻。</p>
          </header>
          <div className="panel reveal">
            <p className="muted" style={{ lineHeight: 1.9, margin: 0 }}>
              身為新竹子弟，我渴望進入半導體產業發揮所學。我具備「主動離開舒適圈」的特質與「建立並優化 SOP」的工程師思維，
              已準備好將 RAG 開發經驗與數據分析能力轉化為產能，為團隊創造實質價值。
            </p>
            <p className="muted" style={{ lineHeight: 1.9, margin: '12px 0 0' }}>
              若你認為我的背景符合職缺需求，歡迎透過
              <Link className="link" to="/#contact">聯絡頁面</Link> 與我進一步討論。
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
