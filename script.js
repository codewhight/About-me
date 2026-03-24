(() => {
  const root = document.documentElement;
  const themeToggle = document.querySelector(".theme-toggle");
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.getElementById("nav-menu");
  const backToTop = document.querySelector(".back-to-top");
  const toast = document.querySelector(".toast");
  const fxCanvas = document.querySelector(".fx-canvas");
  const cursorGlow = document.querySelector(".cursor-glow");
  const scrollProgressBar = document.querySelector(".scroll-progress-bar");
  const typeRotateEl = document.querySelector(".type-rotate");
  const projectModal = document.getElementById("project-modal");

  const EMAIL = "linyan071319@gmail.com";
  const STORAGE_KEY = "profile_theme";
  const prefersReducedMotion = () =>
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const prefersLight = () =>
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: light)").matches;

  const applyTheme = (value) => {
    // value: "light" | "dark" | "auto"
    const v = value || "auto";
    if (v === "auto") {
      root.setAttribute("data-theme", prefersLight() ? "light" : "dark");
    } else {
      root.setAttribute("data-theme", v);
    }
  };

  const getSavedTheme = () => {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  };

  const saveTheme = (value) => {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // ignore
    }
  };

  const cycleTheme = () => {
    const current = getSavedTheme() || "auto";
    const next =
      current === "auto" ? "light" : current === "light" ? "dark" : "auto";
    saveTheme(next);
    applyTheme(next);
    updateThemeAria(next);
  };

  const updateThemeAria = (savedValue) => {
    if (!themeToggle) return;
    const label =
      savedValue === "auto"
        ? "切換深色模式（目前：自動）"
        : savedValue === "light"
          ? "切換深色模式（目前：淺色）"
          : "切換深色模式（目前：深色）";
    themeToggle.setAttribute("aria-label", label);
  };

  const initTheme = () => {
    const saved = getSavedTheme() || "auto";
    applyTheme(saved);
    updateThemeAria(saved);

    if (window.matchMedia) {
      const mq = window.matchMedia("(prefers-color-scheme: light)");
      const onChange = () => {
        if ((getSavedTheme() || "auto") === "auto") applyTheme("auto");
      };
      if (mq.addEventListener) mq.addEventListener("change", onChange);
      else if (mq.addListener) mq.addListener(onChange);
    }
  };

  const setNavOpen = (open) => {
    document.body.classList.toggle("nav-open", open);
    if (navToggle) navToggle.setAttribute("aria-expanded", open ? "true" : "false");
  };

  const initNav = () => {
    if (!navToggle) return;
    navToggle.addEventListener("click", () => {
      const open = !document.body.classList.contains("nav-open");
      setNavOpen(open);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setNavOpen(false);
    });

    document.addEventListener("click", (e) => {
      const target = e.target;
      if (!(target instanceof Element)) return;
      if (!document.body.classList.contains("nav-open")) return;
      if (navToggle.contains(target)) return;
      if (navMenu && navMenu.contains(target)) {
        if (target.closest("a")) setNavOpen(false);
        return;
      }
      setNavOpen(false);
    });
  };

  const initScrollSpy = () => {
    const links = Array.from(document.querySelectorAll("[data-scrollspy]"));
    if (links.length === 0) return;

    const sections = links
      .map((a) => document.querySelector(a.getAttribute("href")))
      .filter(Boolean);

    const setActive = (id) => {
      links.forEach((a) => {
        const href = a.getAttribute("href");
        a.classList.toggle("is-active", href === `#${id}`);
      });
    };

    if (!("IntersectionObserver" in window)) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0))[0];
        if (!visible) return;
        setActive(visible.target.id);
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: [0.1, 0.2, 0.35] }
    );

    sections.forEach((s) => io.observe(s));
  };

  const initScrollProgress = () => {
    if (!scrollProgressBar) return;
    const update = () => {
      const doc = document.documentElement;
      const scrollTop = window.scrollY || doc.scrollTop || 0;
      const max = (doc.scrollHeight || 1) - (window.innerHeight || 1);
      const p = max <= 0 ? 0 : Math.min(1, Math.max(0, scrollTop / max));
      scrollProgressBar.style.width = `${(p * 100).toFixed(2)}%`;
    };
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  };

  const initReveal = () => {
    const items = Array.from(document.querySelectorAll(".reveal"));
    if (items.length === 0) return;

    if (!("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-in"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        });
      },
      { threshold: 0.12 }
    );
    items.forEach((el) => io.observe(el));
  };

  const initCursorGlow = () => {
    if (!cursorGlow) return;
    if (prefersReducedMotion()) return;
    const coarse =
      window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
    if (coarse) return;

    let raf = 0;
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let tx = x;
    let ty = y;

    const tick = () => {
      x += (tx - x) * 0.14;
      y += (ty - y) * 0.14;
      cursorGlow.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      raf = window.requestAnimationFrame(tick);
    };

    const onMove = (e) => {
      tx = e.clientX;
      ty = e.clientY;
      cursorGlow.style.opacity = "1";
      if (!raf) raf = window.requestAnimationFrame(tick);
    };

    const onLeave = () => {
      cursorGlow.style.opacity = "0";
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("blur", onLeave);
    document.addEventListener("mouseleave", onLeave);
  };

  const initTypeRotate = () => {
    if (!typeRotateEl) return;
    const rolesRaw = typeRotateEl.getAttribute("data-roles") || "";
    const roles = rolesRaw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (roles.length === 0) return;

    const reduce = prefersReducedMotion();
    if (reduce) {
      typeRotateEl.textContent = roles[0];
      return;
    }

    let roleIdx = 0;
    let charIdx = 0;
    let deleting = false;

    const speed = () => (deleting ? 28 : 44) + Math.random() * 18;
    const pause = (ms) => new Promise((r) => window.setTimeout(r, ms));

    const loop = async () => {
      while (true) {
        const word = roles[roleIdx % roles.length];
        if (!deleting) {
          charIdx = Math.min(word.length, charIdx + 1);
          typeRotateEl.textContent = word.slice(0, charIdx);
          if (charIdx === word.length) {
            await pause(850);
            deleting = true;
          } else {
            await pause(speed());
          }
        } else {
          charIdx = Math.max(0, charIdx - 1);
          typeRotateEl.textContent = word.slice(0, charIdx);
          if (charIdx === 0) {
            deleting = false;
            roleIdx += 1;
            await pause(220);
          } else {
            await pause(speed());
          }
        }
      }
    };

    loop();
  };

  const copyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      try {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.setAttribute("readonly", "true");
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        const ok = document.execCommand("copy");
        document.body.removeChild(ta);
        return ok;
      } catch {
        return false;
      }
    }
  };

  const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.hidden = false;
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => {
      toast.hidden = true;
    }, 1500);
  };
  showToast._t = 0;

  const confettiBurst = (x, y) => {
    if (prefersReducedMotion()) return;
    const count = 18;
    const colors = ["#7c5cff", "#39d0ff", "#2dd4bf", "#ffffff"];
    for (let i = 0; i < count; i += 1) {
      const el = document.createElement("div");
      el.className = "confetti";
      el.style.background = colors[i % colors.length];
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      const a = Math.random() * Math.PI * 2;
      const v = 4 + Math.random() * 6;
      const vx = Math.cos(a) * v;
      const vy = Math.sin(a) * v - 4;
      const rot = (Math.random() * 360) | 0;
      const life = 650 + Math.random() * 500;
      const start = performance.now();
      document.body.appendChild(el);
      const tick = (t) => {
        const p = Math.min(1, (t - start) / life);
        const dx = vx * p * 70;
        const dy = (vy * p * 70) + p * p * 220;
        el.style.transform = `translate(${dx}px, ${dy}px) rotate(${rot + p * 520}deg)`;
        el.style.opacity = String(1 - p);
        if (p < 1) requestAnimationFrame(tick);
        else el.remove();
      };
      requestAnimationFrame(tick);
    }
  };

  const initCopyEmail = () => {
    const btns = Array.from(document.querySelectorAll("[data-copy-email]"));
    if (btns.length === 0) return;
    btns.forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const ok = await copyText(EMAIL);
        showToast(ok ? "已複製到剪貼簿" : "複製失敗，請手動複製");
        if (ok) {
          const ev = e;
          const x = ev.clientX || window.innerWidth / 2;
          const y = ev.clientY || window.innerHeight / 2;
          confettiBurst(x, y);
        }
      });
    });
  };

  const initProjectModal = () => {
    if (!projectModal) return;
    const titleEl = document.getElementById("project-modal-title");
    const descEl = document.getElementById("project-modal-desc");
    const metaEl = document.getElementById("project-modal-meta");
    const actionsEl = document.getElementById("project-modal-actions");

    const data = {
      a: {
        title: "作品 A：個人網站",
        desc: "單頁式簡介網站：深色模式、RWD、ScrollSpy、滑入動畫、粒子背景、作品詳情 Modal。",
        tags: ["HTML", "CSS", "JavaScript", "RWD", "UI"],
        demo: null,
        github: null,
      },
      b: {
        title: "作品 B：待辦清單 Web App",
        desc:
          "純前端待辦應用：新增／完成／雙擊編輯／刪除；篩選「全部、進行中、已完成」；依建立時間新→舊或舊→新排序；資料以 LocalStorage 持久化，重新整理不遺失；篩選無結果與清單為空時顯示不同提示；可一鍵清除已完成並含確認對話框。",
        tags: ["JavaScript", "LocalStorage", "DOM 事件", "UX", "無障礙"],
        demo: "todo-app.html",
        github: null,
      },
      c: {
        title: "作品 C：資料視覺化儀表板",
        desc:
          "使用 Fetch 呼叫 JSONPlaceholder 公開 API 取得文章列表，依 userId 匯總每位使用者的文章數，並以 Chart.js 繪製長條圖。流程包含載入中狀態、失敗時顯示錯誤與重試、以及「空資料」示範按鈕，方便展示邊界情境。",
        tags: ["Fetch API", "Chart.js", "REST", "非同步", "錯誤處理"],
        demo: "data-viz.html",
        github: null,
      },
      games: {
        title: "Python 小遊戲集",
        desc: "在瀏覽器中以 Python（Pyodide）執行：踩地雷、井字棋、打磚塊。與 Unity 作品為不同專案。",
        tags: ["Python", "Pyodide", "遊戲邏輯"],
        demo: "games.html",
        github: null,
      },
      unity: {
        title: "Unity 2D 冒險遊戲",
        desc: "使用 Unity 製作的 2D 冒險遊戲（場景、角色、敵人與道具設計）。",
        tags: ["Unity", "2D", "C#", "遊戲設計"],
        demo: "unity-game/index.html",
        github: null,
      },
    };

    let lastFocus = null;

    const open = (id) => {
      const p = data[id];
      if (!p) return;
      lastFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;

      if (titleEl) titleEl.textContent = p.title;
      if (descEl) descEl.textContent = p.desc;
      if (metaEl) {
        metaEl.innerHTML = "";
        p.tags.forEach((t) => {
          const s = document.createElement("span");
          s.className = "chip";
          s.textContent = t;
          metaEl.appendChild(s);
        });
      }
      if (actionsEl) {
        actionsEl.innerHTML = "";
        const mk = (label, href, primary) => {
          const a = document.createElement("a");
          a.className = `btn btn-small ${primary ? "btn-primary" : "btn-ghost"}`;
          a.textContent = label;
          if (!href) {
            a.setAttribute("aria-disabled", "true");
            a.href = "#";
          } else {
            a.href = href;
            const isExternal =
              /^https?:\/\//i.test(href) || href.startsWith("//");
            if (isExternal) {
              a.target = "_blank";
              a.rel = "noreferrer";
            }
          }
          return a;
        };
        actionsEl.appendChild(mk("Demo", p.demo, true));
        actionsEl.appendChild(mk("GitHub", p.github, false));
      }

      projectModal.hidden = false;
      document.body.style.overflow = "hidden";
      const closeBtn = projectModal.querySelector("[data-modal-close]");
      if (closeBtn instanceof HTMLElement) closeBtn.focus();
    };

    const close = () => {
      projectModal.hidden = true;
      document.body.style.overflow = "";
      if (lastFocus) lastFocus.focus();
    };

    document.addEventListener("click", (e) => {
      const t = e.target;
      if (!(t instanceof Element)) return;

      const openBtn = t.closest("[data-project-open]");
      if (openBtn) {
        const card = openBtn.closest("[data-project-id]");
        const id = card && card.getAttribute("data-project-id");
        if (id) open(id);
        return;
      }

      const closeBtn = t.closest("[data-modal-close]");
      if (closeBtn && !projectModal.hidden) {
        close();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !projectModal.hidden) close();
    });
  };

  const initBackToTop = () => {
    if (!backToTop) return;
    const onScroll = () => {
      const show = window.scrollY > 600;
      backToTop.hidden = !show;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  };

  const initYear = () => {
    const el = document.querySelector("[data-year]");
    if (el) el.textContent = String(new Date().getFullYear());
  };

  const initParticles = () => {
    if (!fxCanvas) return;
    if (prefersReducedMotion()) return;

    const ctx = fxCanvas.getContext("2d");
    if (!ctx) return;

    const coarse =
      window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
    const starCount = coarse ? 80 : 150;

    let w = 0;
    let h = 0;
    let dpr = 1;

    const resize = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      w = Math.max(1, window.innerWidth);
      h = Math.max(1, window.innerHeight);
      fxCanvas.width = Math.floor(w * dpr);
      fxCanvas.height = Math.floor(h * dpr);
      fxCanvas.style.width = `${w}px`;
      fxCanvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const rand = (a, b) => a + Math.random() * (b - a);

    // Create stars
    const stars = Array.from({ length: starCount }, () => ({
      x: rand(0, w || window.innerWidth),
      y: rand(0, h || window.innerHeight),
      r: rand(0.5, 2.5),
      brightness: rand(0.3, 1),
      twinkle: rand(0, Math.PI * 2),
      twinkleSpeed: rand(0.01, 0.05),
    }));

    // Define constellations (simplified star patterns)
    const constellations = [
      // Orion constellation (simplified)
      [
        { x: 0.2, y: 0.3 }, { x: 0.25, y: 0.35 }, { x: 0.3, y: 0.3 },
        { x: 0.25, y: 0.25 }, { x: 0.2, y: 0.4 }, { x: 0.3, y: 0.4 }
      ],
      // Ursa Major (Big Dipper)
      [
        { x: 0.7, y: 0.2 }, { x: 0.75, y: 0.25 }, { x: 0.8, y: 0.3 },
        { x: 0.85, y: 0.35 }, { x: 0.75, y: 0.4 }, { x: 0.8, y: 0.45 },
        { x: 0.85, y: 0.5 }
      ],
      // Cassiopeia
      [
        { x: 0.1, y: 0.6 }, { x: 0.15, y: 0.65 }, { x: 0.2, y: 0.6 },
        { x: 0.25, y: 0.65 }, { x: 0.3, y: 0.6 }
      ],
      // Random constellation
      [
        { x: 0.6, y: 0.7 }, { x: 0.65, y: 0.75 }, { x: 0.7, y: 0.7 },
        { x: 0.75, y: 0.8 }, { x: 0.8, y: 0.75 }
      ]
    ];

    const step = () => {
      ctx.clearRect(0, 0, w, h);

      // Draw dark background
      ctx.fillStyle = 'rgba(11, 15, 25, 0.95)';
      ctx.fillRect(0, 0, w, h);

      // Draw constellation lines
      ctx.strokeStyle = 'rgba(124, 92, 255, 0.3)';
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 4]);

      constellations.forEach(constellation => {
        ctx.beginPath();
        constellation.forEach((star, index) => {
          const x = star.x * w;
          const y = star.y * h;
          if (index === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        });
        ctx.stroke();
      });

      ctx.setLineDash([]);

      // Draw stars
      stars.forEach((star) => {
        // Update twinkle
        star.twinkle += star.twinkleSpeed;
        const twinkleFactor = 0.7 + 0.3 * Math.sin(star.twinkle);

        // Draw star
        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness * twinkleFactor})`;
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fill();

        // Add glow for brighter stars
        if (star.brightness > 0.7) {
          const gradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.r * 3);
          gradient.addColorStop(0, `rgba(124, 92, 255, ${star.brightness * 0.2 * twinkleFactor})`);
          gradient.addColorStop(1, 'rgba(124, 92, 255, 0)');
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.r * 3, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      requestAnimationFrame(step);
    };

    window.addEventListener("resize", () => {
      resize();
      // Recreate stars on resize
      stars.length = 0;
      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: rand(0, w),
          y: rand(0, h),
          r: rand(0.5, 2.5),
          brightness: rand(0.3, 1),
          twinkle: rand(0, Math.PI * 2),
          twinkleSpeed: rand(0.01, 0.05),
        });
      }
    });

    resize();
    step();
  };

  initTheme();
  initNav();
  initScrollSpy();
  initScrollProgress();
  initReveal();
  initCursorGlow();
  initTypeRotate();
  initProjectModal();
  initParticles();
  initCopyEmail();
  initBackToTop();
  initYear();

  if (themeToggle) themeToggle.addEventListener("click", cycleTheme);
})();
