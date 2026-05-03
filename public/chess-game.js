document.addEventListener('DOMContentLoaded', () => {
    // Check if chess.js is loaded
    if (typeof Chess === 'undefined') {
        document.getElementById('status').innerHTML = '<span style="color:red">無法載入 chess.js。請檢查網路連線。</span>';
        return;
    }

    const game = new Chess();
    const boardEl = document.getElementById('board');
    const statusEl = document.getElementById('status');
    const pgnEl = document.getElementById('pgn');
    const modeEl = document.getElementById('mode');
    const restartBtn = document.getElementById('restartBtn');
    const undoBtn = document.getElementById('undoBtn');

    let mode = 'pvp'; // 'pvp' or 'ai'
    let selectedSquare = null;
    let hintSquares = [];
    let lastMove = null;
    let historyStack = []; // To support undo in UI/AI properly
    
    // AI Difficulty settings (search depth)
    const AI_DEPTH = 3;

    const PIECES = {
        'p': { w: '♙', b: '♟' },
        'n': { w: '♘', b: '♞' },
        'b': { w: '♗', b: '♝' },
        'r': { w: '♖', b: '♜' },
        'q': { w: '♕', b: '♛' },
        'k': { w: '♔', b: '♚' }
    };

    // Piece values for Evaluation
    const PIECE_VALUES = {
        p: 10,
        n: 30,
        b: 30,
        r: 50,
        q: 90,
        k: 900
    };

    // Very basic Position/Square tables (from white perspective, reverse for black)
    const pawnEvalWhite = [
        [0,  0,  0,  0,  0,  0,  0,  0],
        [5, 10, 10,-20,-20, 10, 10,  5],
        [5, -5,-10,  0,  0,-10, -5,  5],
        [0,  0,  0, 20, 20,  0,  0,  0],
        [5,  5, 10, 25, 25, 10,  5,  5],
        [10, 10, 20, 30, 30, 20, 10, 10],
        [50, 50, 50, 50, 50, 50, 50, 50],
        [0,  0,  0,  0,  0,  0,  0,  0]
    ];
    const knightEval = [
        [-5, -4, -3, -3, -3, -3, -4, -5],
        [-4, -2,  0,  0,  0,  0, -2, -4],
        [-3,  0,  1,  1,  1,  1,  0, -3],
        [-3,  0,  1,  2,  2,  1,  0, -3],
        [-3,  0,  1,  2,  2,  1,  0, -3],
        [-3,  0,  1,  1,  1,  1,  0, -3],
        [-4, -2,  0,  0,  0,  0, -2, -4],
        [-5, -4, -3, -3, -3, -3, -4, -5]
    ].map(row => row.map(v => v * 10));

    // Flip table for black pieces
    const reverseArray = (arr) => arr.slice().reverse();

    const evaluateBoard = () => {
        let totalEvaluation = 0;
        const board = game.board();
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                totalEvaluation += getPieceValue(board[i][j], i, j);
            }
        }
        return totalEvaluation;
    };

    const getPieceValue = (piece, r, c) => {
        if (piece === null) return 0;
        let val = PIECE_VALUES[piece.type];
        
        // Add positional value
        if (piece.type === 'p') {
            val += (piece.color === 'w' ? pawnEvalWhite[r][c] : reverseArray(pawnEvalWhite)[r][c]);
        } else if (piece.type === 'n') {
            val += knightEval[r][c];
        } else {
            // Favor center slightly for other pieces
            val += (3 - Math.abs(3.5 - r) + 3 - Math.abs(3.5 - c)) * 2;
        }

        return piece.color === 'w' ? val : -val;
    };

    // Minimax with Alpha-Beta Pruning
    const minimax = (depth, alpha, beta, isMaximizingPlayer) => {
        if (depth === 0 || game.game_over()) {
            return evaluateBoard();
        }

        const moves = game.moves();
        
        if (isMaximizingPlayer) {
            let bestVal = -Infinity;
            for (let i = 0; i < moves.length; i++) {
                game.move(moves[i]);
                bestVal = Math.max(bestVal, minimax(depth - 1, alpha, beta, !isMaximizingPlayer));
                game.undo();
                alpha = Math.max(alpha, bestVal);
                if (beta <= alpha) break;
            }
            return bestVal;
        } else {
            let bestVal = Infinity;
            for (let i = 0; i < moves.length; i++) {
                game.move(moves[i]);
                bestVal = Math.min(bestVal, minimax(depth - 1, alpha, beta, !isMaximizingPlayer));
                game.undo();
                beta = Math.min(beta, bestVal);
                if (beta <= alpha) break;
            }
            return bestVal;
        }
    };

    const makeBestMove = async () => {
        if (game.game_over()) return;
        
        statusEl.innerHTML += ' <strong>(AI 思考中...)</strong>';
        
        // Use timeout to allow UI update
        setTimeout(() => {
            const moves = game.moves();
            if (moves.length === 0) return;
            
            let bestMove = null;
            let bestValue = game.turn() === 'w' ? -Infinity : Infinity;

            // Optional: Shuffle moves to prevent identical play
            moves.sort(() => Math.random() - 0.5);

            for (let i = 0; i < moves.length; i++) {
                const move = moves[i];
                game.move(move);
                const boardValue = minimax(AI_DEPTH - 1, -Infinity, Infinity, game.turn() === 'w');
                game.undo();

                if (game.turn() === 'w') {
                    if (boardValue > bestValue) {
                        bestValue = boardValue;
                        bestMove = move;
                    }
                } else {
                    if (boardValue < bestValue) {
                        bestValue = boardValue;
                        bestMove = move;
                    }
                }
            }

            if (bestMove === null) bestMove = moves[Math.floor(Math.random() * moves.length)];
            
            const result = game.move(bestMove);
            if(result) {
                lastMove = { from: result.from, to: result.to };
            }
            updateStatus();
            renderBoard();
        }, 50);
    };

    const initBoard = () => {
        boardEl.innerHTML = '';
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const isLight = (r + c) % 2 === 0;
                const square = document.createElement('div');
                const file = String.fromCharCode(97 + c);
                const rank = 8 - r;
                const sqName = `${file}${rank}`;

                square.className = `chess-cell ${isLight ? 'light' : 'dark'}`;
                square.dataset.sq = sqName;
                
                square.addEventListener('click', () => onSquareClick(sqName));
                
                boardEl.appendChild(square);
            }
        }
    };

    const renderBoard = () => {
        const board = game.board(); // 8x8 array
        const cells = document.querySelectorAll('.chess-cell');
        
        cells.forEach(cell => {
            // Clean up old classes and content
            cell.innerHTML = '';
            cell.classList.remove('selected', 'hint', 'last-move', 'capture', 'in-check');
            
            const sq = cell.dataset.sq;
            const file = sq.charCodeAt(0) - 97; // 0 to 7
            const rank = 8 - parseInt(sq[1]);   // 0 to 7
            
            const p = board[rank][file];
            if (p) {
                const span = document.createElement('span');
                span.className = `${p.type}-${p.color}`;
                span.innerText = PIECES[p.type][p.color];
                cell.appendChild(span);

                // Highlight king if in check
                if (p.type === 'k' && p.color === game.turn() && game.in_check()) {
                    cell.classList.add('in-check');
                }
            }

            // Highlights
            if (selectedSquare === sq) cell.classList.add('selected');
            if (hintSquares.some(m => m.to === sq)) {
                cell.classList.add('hint');
                if (p) cell.classList.add('capture');
            }
            if (lastMove && (lastMove.from === sq || lastMove.to === sq)) {
                cell.classList.add('last-move');
            }
        });
        
        pgnEl.innerText = game.pgn() || "尚未開始...";
        pgnEl.scrollTop = pgnEl.scrollHeight;
    };

    const updateStatus = () => {
        let status = '';
        let moveColor = game.turn() === 'w' ? '白方' : '黑方';

        if (game.in_checkmate()) {
            status = `遊戲結束：<strong>${moveColor} 被將死！</strong>`;
        } else if (game.in_draw()) {
            status = '遊戲結束：<strong>平手 (和局)</strong>';
        } else {
            status = `輪到：<strong>${moveColor}</strong>`;
            if (game.in_check()) {
                status += ' <span style="color: #e74c3c;">(將軍 Check)</span>';
            }
        }
        statusEl.innerHTML = status;
        
        if (mode === 'ai' && !game.game_over() && game.turn() === 'b') {
            makeBestMove();
        }
    };

    const onSquareClick = (sq) => {
        if (game.game_over()) return;
        if (mode === 'ai' && game.turn() === 'b') return; // AI is thinking

        // 1. Try to make a move if a piece is already selected
        if (selectedSquare) {
            const moves = game.moves({ square: selectedSquare, verbose: true });
            const move = moves.find(m => m.to === sq);

            if (move) {
                // Handle Promotion (always promote to Queen for simplicity)
                if (move.flags.includes('p') || move.flags.includes('cp')) {
                    game.move({ from: selectedSquare, to: sq, promotion: 'q' });
                } else {
                    game.move({ from: selectedSquare, to: sq });
                }
                
                historyStack.push(game.fen());
                lastMove = { from: selectedSquare, to: sq };
                selectedSquare = null;
                hintSquares = [];
                updateStatus();
                renderBoard();
                return;
            }
        }

        // 2. Select a square
        const piece = game.get(sq);
        if (piece && piece.color === game.turn()) {
            // Selecting my own piece
            if (selectedSquare === sq) {
                // Toggle off
                selectedSquare = null;
                hintSquares = [];
            } else {
                selectedSquare = sq;
                hintSquares = game.moves({ square: sq, verbose: true });
            }
        } else {
            // Clicking elsewhere clears selection
            selectedSquare = null;
            hintSquares = [];
        }

        renderBoard();
    };

    // Actions
    modeEl.addEventListener('change', () => {
        mode = modeEl.value;
        game.reset();
        historyStack = [];
        lastMove = null;
        selectedSquare = null;
        hintSquares = [];
        updateStatus();
        renderBoard();
    });

    restartBtn.addEventListener('click', () => {
        game.reset();
        historyStack = [];
        lastMove = null;
        selectedSquare = null;
        hintSquares = [];
        updateStatus();
        renderBoard();
    });

    undoBtn.addEventListener('click', () => {
        if (mode === 'ai') {
            // Undo 2 plys (AI and Player)
            game.undo();
            game.undo();
        } else {
            // Undo 1 ply
            game.undo();
        }
        
        lastMove = null;
        selectedSquare = null;
        hintSquares = [];
        updateStatus();
        renderBoard();
    });

    // Boot
    initBoard();
    updateStatus();
    renderBoard();
});
