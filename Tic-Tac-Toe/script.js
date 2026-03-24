(() => {
  const LINES = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const $ = (id) => document.getElementById(id);
  const modeEl = $("mode");
  const humanMarkEl = $("humanMark");
  const humanMarkFieldEl = $("humanMarkField");
  const resetEl = $("reset");
  const boardEl = $("board");
  const statusEl = $("status");

  let board = Array(9).fill(null);
  let current = "X";
  let gameOver = false;
  let mode = "pvp"; // 'pvp' | 'cpu'

  const state = () => {
    const human = humanMarkEl.value;
    const cpu = human === "X" ? "O" : "X";
    return { human, cpu };
  };

  function emptyIndices(b) {
    const out = [];
    for (let i = 0; i < b.length; i++) if (!b[i]) out.push(i);
    return out;
  }

  function winnerOf(b) {
    for (const [a, c, d] of LINES) {
      if (b[a] && b[a] === b[c] && b[a] === b[d]) {
        return { winner: b[a], line: [a, c, d] };
      }
    }
    if (emptyIndices(b).length === 0) return { winner: "draw", line: null };
    return { winner: null, line: null };
  }

  function setStatus(html) {
    statusEl.innerHTML = html;
  }

  function render(result = null) {
    boardEl.innerHTML = "";
    const winningLine = result?.line ?? null;

    for (let i = 0; i < 9; i++) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "cell";
      btn.setAttribute("role", "gridcell");
      btn.setAttribute("aria-label", `格子 ${i + 1}`);
      btn.dataset.index = String(i);

      const mark = board[i];
      if (mark) {
        btn.textContent = mark;
        btn.classList.add(mark === "X" ? "x" : "o");
      } else {
        btn.textContent = "";
      }

      if (winningLine && winningLine.includes(i)) btn.classList.add("win");

      const disableBecauseOver = gameOver;
      const disableBecauseFilled = Boolean(mark);
      const disableBecauseCpuTurn =
        mode === "cpu" && !gameOver && current === state().cpu;

      if (disableBecauseOver || disableBecauseFilled || disableBecauseCpuTurn) {
        btn.disabled = true;
      }

      btn.addEventListener("click", onCellClick);
      boardEl.appendChild(btn);
    }
  }

  function announceTurn() {
    if (gameOver) return;
    if (mode === "cpu") {
      const { human, cpu } = state();
      const who = current === human ? "你" : "電腦";
      setStatus(`輪到：<strong>${who}</strong>（${current}）`);
      if (current === cpu) setStatus(`輪到：<strong>電腦</strong>（${current}）正在思考…`);
    } else {
      setStatus(`輪到：<strong>${current}</strong>`);
    }
  }

  function endGame(result) {
    gameOver = true;
    if (result.winner === "draw") {
      setStatus("結果：<strong>平手</strong>");
      render(result);
      return;
    }

    if (mode === "cpu") {
      const { human } = state();
      const msg = result.winner === human ? "你贏了" : "電腦贏了";
      setStatus(`結果：<strong>${msg}</strong>（${result.winner}）`);
    } else {
      setStatus(`結果：<strong>${result.winner}</strong> 獲勝`);
    }
    render(result);
  }

  function placeAt(idx, mark) {
    if (gameOver) return false;
    if (board[idx]) return false;
    board[idx] = mark;
    const result = winnerOf(board);
    if (result.winner) {
      endGame(result);
      return true;
    }
    current = current === "X" ? "O" : "X";
    render();
    announceTurn();
    return true;
  }

  function onCellClick(e) {
    const idx = Number(e.currentTarget.dataset.index);
    if (!Number.isFinite(idx)) return;

    if (mode === "cpu") {
      const { human } = state();
      if (current !== human) return;
    }

    const ok = placeAt(idx, current);
    if (!ok) return;

    if (mode === "cpu" && !gameOver) {
      const { cpu } = state();
      if (current === cpu) {
        requestAnimationFrame(() => cpuMove());
      }
    }
  }

  // Zero-sum Minimax: CPU maximizes, Human minimizes.
  function minimax(b, turn, cpu, human, depth, alpha, beta) {
    const r = winnerOf(b);
    if (r.winner) {
      if (r.winner === cpu) return 10 - depth;
      if (r.winner === human) return depth - 10;
      return 0;
    }

    const empties = emptyIndices(b);

    if (turn === cpu) {
      let best = -Infinity;
      for (const idx of empties) {
        b[idx] = cpu;
        const score = minimax(b, human, cpu, human, depth + 1, alpha, beta);
        b[idx] = null;
        if (score > best) best = score;
        if (best > alpha) alpha = best;
        if (beta <= alpha) break;
      }
      return best;
    } else {
      let best = Infinity;
      for (const idx of empties) {
        b[idx] = human;
        const score = minimax(b, cpu, cpu, human, depth + 1, alpha, beta);
        b[idx] = null;
        if (score < best) best = score;
        if (best < beta) beta = best;
        if (beta <= alpha) break;
      }
      return best;
    }
  }

  function bestMoveForCpu() {
    const { human, cpu } = state();
    let bestScore = -Infinity;
    let bestIdx = null;

    for (const idx of emptyIndices(board)) {
      board[idx] = cpu;
      const score = minimax(board, human, cpu, human, 0, -Infinity, Infinity);
      board[idx] = null;

      if (score > bestScore) {
        bestScore = score;
        bestIdx = idx;
      }
    }
    return bestIdx;
  }

  function cpuMove() {
    if (gameOver) return;
    if (mode !== "cpu") return;
    const { cpu } = state();
    if (current !== cpu) return;

    const idx = bestMoveForCpu();
    if (idx == null) return;
    placeAt(idx, cpu);
  }

  function resetGame({ keepMode = true } = {}) {
    board = Array(9).fill(null);
    current = "X";
    gameOver = false;
    if (!keepMode) mode = modeEl.value;
    render();
    announceTurn();

    if (mode === "cpu") {
      const { cpu } = state();
      if (current === cpu) {
        requestAnimationFrame(() => cpuMove());
      }
    }
  }

  function applyModeUI() {
    mode = modeEl.value;
    humanMarkFieldEl.style.display = mode === "cpu" ? "grid" : "none";
  }

  // Init
  function initBoard() {
    boardEl.setAttribute("aria-rowcount", "3");
    boardEl.setAttribute("aria-colcount", "3");
    applyModeUI();

    modeEl.addEventListener("change", () => {
      applyModeUI();
      resetGame({ keepMode: false });
    });

    humanMarkEl.addEventListener("change", () => {
      if (mode !== "cpu") return;
      resetGame({ keepMode: true });
    });

    resetEl.addEventListener("click", () => resetGame({ keepMode: true }));
    resetGame({ keepMode: false });
  }

  initBoard();
})();
