// ==========================================================================
// ARCADE HUB - UNIFIED GAME CONTROLLER & LIFE-CYCLE MANAGER
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const menuPrincipal = document.getElementById('menu-principal');
    const telaJogo = document.getElementById('tela-jogo');
    const btnVoltar = document.getElementById('btn-voltar');
    const btnReiniciar = document.getElementById('btn-reiniciar');
    const topoJogoTitulo = document.getElementById('topo-jogo-titulo');
    
    // Tutorial Panel Elements
    const tutorialGame = document.getElementById('tutorial-game');
    const tutorialTitle = document.getElementById('tutorial-title');
    const tutorialDesc = document.getElementById('tutorial-desc');
    const tutorialIcon = document.getElementById('tutorial-icon');
    const tutorialControlsList = document.getElementById('tutorial-controls-list');
    const btnIniciarPartida = document.getElementById('btn-iniciar-partida');
    
    // Game View Container & Sub-views
    const arenaJogo = document.getElementById('arena-jogo');
    const gameFrameGlow = document.querySelector('.game-frame-glow');
    const gameViews = document.querySelectorAll('.game-view');

    // Global Active Game State Tracker
    let activeGameKey = null;
    let activeGameInstance = null;

    // Game Configurations (Metadata, Controls, Tutorial Contents)
    const gamesMetadata = {
        // Placeholder Games (Coming Soon)
        uno: {
            title: 'Uno',
            glowColor: 'rgba(255, 59, 48, 0.45)',
            viewId: 'game-view-placeholder',
            builder: () => new PlaceholderGame('Uno')
        },
        paciencia: {
            title: 'Paciência',
            glowColor: 'rgba(52, 199, 89, 0.4)',
            viewId: 'game-view-placeholder',
            builder: () => new PlaceholderGame('Paciência')
        },
        // Playable Board Games
        velha: {
            title: 'Jogo da Velha',
            icon: '❌',
            description: 'Partida local clássica de Jogo da Velha para dois jogadores. Alinhe três símbolos idênticos horizontalmente, verticalmente ou diagonalmente para vencer.',
            controls: [
                { key: 'Clique Esquerdo', desc: 'Posiciona o símbolo da rodada (X ou O) em uma célula vazia.' }
            ],
            glowColor: 'rgba(0, 242, 254, 0.4)',
            viewId: 'game-view-velha',
            builder: () => new TicTacToeGame()
        },
        damas: {
            title: 'Damas',
            icon: '🔴',
            description: 'Confronte seu adversário local no jogo de Damas. Desloque peças diagonalmente, capture as peças rivais saltando sobre elas e promova suas peças a Dama ao alcançar a última fileira.',
            controls: [
                { key: 'Clique Esquerdo (Selecionar)', desc: 'Escolhe uma peça da sua cor. As casas de movimento válidas serão iluminadas.' },
                { key: 'Clique Esquerdo (Mover)', desc: 'Pressione a casa iluminada de destino para deslocar ou realizar capturas.' }
            ],
            glowColor: 'rgba(255, 149, 0, 0.4)',
            viewId: 'game-view-damas',
            builder: () => new CheckersGame()
        },
        xadrez: {
            title: 'Xadrez',
            icon: '👑',
            description: 'O clássico duelo tático dos reis. Mova peões, cavalos, bispos, torres, rainhas e o rei de acordo com suas regras oficiais de deslocamento em um tabuleiro de cores chumbo e azul noturno.',
            controls: [
                { key: 'Clique Esquerdo (Selecionar)', desc: 'Selecione uma peça da sua cor. As posições legais de movimento serão iluminadas.' },
                { key: 'Clique Esquerdo (Mover)', desc: 'Pressione o bloco iluminado de destino para deslocar ou capturar a peça adversária.' }
            ],
            glowColor: 'rgba(226, 232, 240, 0.25)',
            viewId: 'game-view-xadrez',
            builder: () => new ChessGame()
        },
        // Active Retro Games
        memoria: {
            title: 'Sequência de Memória',
            icon: '🧠',
            description: 'Treine seu cérebro memorizando e reproduzindo uma sequência de cores e sons que aumenta progressivamente a cada nível. Desafie a sua memória de curto prazo!',
            controls: [
                { key: 'Clique Esquerdo', desc: 'Pressione o bloco colorido correto para reproduzir a sequência.' },
                { key: 'Áudio Retrô', desc: 'Ouça as notas musicais sintetizadas para ajudar na memorização.' }
            ],
            glowColor: 'rgba(255, 59, 48, 0.4)',
            viewId: 'game-view-memoria',
            builder: () => new MemoryGame()
        },
        cobrinha: {
            title: 'Jogo da Cobrinha',
            icon: '🐍',
            description: 'Mova a cobrinha pela tela para comer as frutas vermelhas. Cada fruta faz com que a cauda cresça. Evite colidir com o próprio corpo ou com as bordas!',
            controls: [
                { key: 'Setas direcionais (← ↑ → ↓)', desc: 'Direcionam os movimentos da cobrinha.' },
                { key: 'Espaço / P', desc: 'Pausa ou reinicia a velocidade do jogo.' }
            ],
            glowColor: 'rgba(56, 239, 125, 0.35)',
            viewId: 'game-view-cobrinha',
            builder: () => new SnakeGame()
        },
        'campo-minado': {
            title: 'Campo Minado',
            icon: '💣',
            description: 'Descubra todas as células vazias sem explodir nenhuma mina terrestre. Use os números indicativos para calcular a posição exata das bombas ocultas.',
            controls: [
                { key: 'Clique Esquerdo', desc: 'Revela o conteúdo da célula sob o cursor.' },
                { key: 'Clique Direito', desc: 'Insere ou remove uma bandeira de sinalização de mina.' }
            ],
            glowColor: 'rgba(242, 153, 74, 0.35)',
            viewId: 'game-view-campo-minado',
            builder: () => new MinesweeperGame()
        },
        tetris: {
            title: 'Tetris',
            icon: '🧱',
            description: 'Encaixe e ordene os blocos geométricos em queda para formar linhas horizontais contínuas. Completar linhas as elimina da tela e gera pontos.',
            controls: [
                { key: 'Seta Esquerda / Direita', desc: 'Move a peça ativa lateralmente.' },
                { key: 'Seta Cima (↑)', desc: 'Rotaciona a peça no sentido horário.' },
                { key: 'Seta Baixo (↓)', desc: 'Soft drop (aumenta a velocidade de queda).' }
            ],
            glowColor: 'rgba(155, 81, 224, 0.35)',
            viewId: 'game-view-tetris',
            builder: () => new TetrisGame()
        }
    };

    // Card Selection Handlers
    const gameCards = document.querySelectorAll('.game-card');
    gameCards.forEach(card => {
        card.addEventListener('click', () => {
            const gameKey = card.getAttribute('data-game');
            if (gameKey && gamesMetadata[gameKey]) {
                carregarJogo(gameKey);
            }
        });
    });

    // Control bar triggers
    btnVoltar.addEventListener('click', voltarAoMenu);
    btnReiniciar.addEventListener('click', reiniciarJogoAtivo);
    btnIniciarPartida.addEventListener('click', iniciarPartidaAtiva);

    /**
     * Prepares and displays the game context. Either redirects directly to the placeholder 
     * or triggers the tutorial modal for playable games.
     */
    function carregarJogo(gameKey) {
        limparJogoAtivo();
        activeGameKey = gameKey;
        const meta = gamesMetadata[gameKey];

        // 1. Setup Header title
        topoJogoTitulo.textContent = meta.title;

        // 2. Setup ambient neon glow
        gameFrameGlow.style.background = `radial-gradient(circle, ${meta.glowColor}, transparent 70%)`;

        // 3. IF PLACEHOLDER: Bypass tutorial panel, load placeholder view immediately
        const placeholderGames = ['uno', 'paciencia'];
        if (placeholderGames.includes(gameKey)) {
            menuPrincipal.classList.add('hidden');
            telaJogo.classList.remove('hidden');
            tutorialGame.classList.add('hidden');
            arenaJogo.classList.remove('hidden');
            btnReiniciar.classList.add('hidden'); // Hide reset button for placeholders

            gameViews.forEach(view => {
                if (view.id === meta.viewId) {
                    view.classList.remove('hidden');
                } else {
                    view.classList.add('hidden');
                }
            });

            activeGameInstance = meta.builder();
            activeGameInstance.start();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        // 4. IF PLAYABLE: Load tutorial modal
        btnReiniciar.classList.remove('hidden');
        tutorialTitle.textContent = meta.title;
        tutorialIcon.textContent = meta.icon;
        tutorialDesc.textContent = meta.description;

        // Populate controls checklist
        tutorialControlsList.innerHTML = '';
        meta.controls.forEach(ctrl => {
            const li = document.createElement('li');
            li.innerHTML = `<strong>${ctrl.key}</strong>: ${ctrl.desc}`;
            tutorialControlsList.appendChild(li);
        });

        // Toggle layouts
        menuPrincipal.classList.add('hidden');
        telaJogo.classList.remove('hidden');
        tutorialGame.classList.remove('hidden');
        arenaJogo.classList.add('hidden');

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    /**
     * Starts the actual active game engine session, hiding the tutorial panel.
     */
    function iniciarPartidaAtiva() {
        if (!activeGameKey || !gamesMetadata[activeGameKey]) return;
        const meta = gamesMetadata[activeGameKey];

        // 1. Hide tutorial and reveal arena layout
        tutorialGame.classList.add('hidden');
        arenaJogo.classList.remove('hidden');

        // 2. Activate appropriate sub-view template
        gameViews.forEach(view => {
            if (view.id === meta.viewId) {
                view.classList.remove('hidden');
            } else {
                view.classList.add('hidden');
            }
        });

        // 3. Instantiate and launch game engine object
        activeGameInstance = meta.builder();
        activeGameInstance.start();
    }

    /**
     * Resets the active game state immediately.
     */
    function reiniciarJogoAtivo() {
        if (activeGameInstance) {
            activeGameInstance.start();
        }
    }

    /**
     * Cleans up current active loop and reverts to the primary showcase menu.
     */
    function voltarAoMenu() {
        limparJogoAtivo();
        telaJogo.classList.add('hidden');
        menuPrincipal.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    /**
     * Invokes cleanup logic on active instances to clear intervals, listeners, and audio contexts.
     */
    function limparJogoAtivo() {
        if (activeGameInstance) {
            activeGameInstance.cleanup();
            activeGameInstance = null;
        }
        activeGameKey = null;
    }
});


// ==========================================================================
// GAME 0: CLASSIC GAME PLACEHOLDER ENGINE (UNO & PACIÊNCIA)
// ==========================================================================
class PlaceholderGame {
    constructor(name) {
        this.name = name;
    }
    start() {
        // Set dynamic text for placeholder
        const iconPulse = document.querySelector('.placeholder-icon-pulse');
        const descText = document.querySelector('.placeholder-desc');
        
        // Custom emoji icons based on classic game selected
        const icons = {
            'Uno': '🃏',
            'Paciência': '🃏'
        };
        
        if (iconPulse) iconPulse.textContent = icons[this.name] || '🔧';
        if (descText) descText.textContent = `${this.name} - Em Breve`;
    }
    cleanup() {
        // No loops to clear
    }
}


// ==========================================================================
// GAME 1: JOGO DA VELHA (TIC-TAC-TOE ENGINE)
// ==========================================================================
class TicTacToeGame {
    constructor() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.isGameOver = false;

        this.turnoText = document.getElementById('velha-turno');
        this.statusText = document.getElementById('velha-status');
        this.cells = document.querySelectorAll('.velha-cell');

        this.boundCellClick = this.onCellClick.bind(this);
    }

    start() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.isGameOver = false;

        this.turnoText.textContent = this.currentPlayer;
        this.turnoText.className = 'active-player-text x';
        this.statusText.textContent = 'Clique em uma casa vazia para jogar';
        this.statusText.style.color = '#94a3b8';

        this.cells.forEach(cell => {
            cell.textContent = '';
            cell.className = 'velha-cell';
            cell.addEventListener('click', this.boundCellClick);
        });
    }

    onCellClick(e) {
        if (this.isGameOver) return;
        const cell = e.target;
        const index = parseInt(cell.getAttribute('data-index'));

        // Cell already occupied
        if (this.board[index] !== '') return;

        // Apply symbol
        this.board[index] = this.currentPlayer;
        cell.textContent = this.currentPlayer;
        cell.classList.add(this.currentPlayer.toLowerCase());

        // Validate Victory
        const winCombo = this.checkWin();
        if (winCombo) {
            this.isGameOver = true;
            winCombo.forEach(i => this.cells[i].classList.add('win-highlight'));
            this.statusText.textContent = `Vitória! O jogador ${this.currentPlayer} venceu!`;
            this.statusText.style.color = '#38ef7d';
            return;
        }

        // Validate Draw
        if (this.board.every(cellValue => cellValue !== '')) {
            this.isGameOver = true;
            this.statusText.textContent = 'Velha! A partida terminou em empate.';
            this.statusText.style.color = '#ff9500';
            return;
        }

        // Switch turns
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        this.turnoText.textContent = this.currentPlayer;
        this.turnoText.className = `active-player-text ${this.currentPlayer.toLowerCase()}`;
    }

    checkWin() {
        const winningCombos = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
            [0, 4, 8], [2, 4, 6]             // diagonals
        ];

        for (const combo of winningCombos) {
            if (this.board[combo[0]] !== '' &&
                this.board[combo[0]] === this.board[combo[1]] &&
                this.board[combo[0]] === this.board[combo[2]]) {
                return combo;
            }
        }
        return null;
    }

    cleanup() {
        this.cells.forEach(cell => {
            cell.removeEventListener('click', this.boundCellClick);
        });
    }
}


// ==========================================================================
// GAME 2: DAMAS (CHECKERS ENGINE)
// ==========================================================================
class CheckersGame {
    constructor() {
        this.grid = document.getElementById('damas-grid');
        this.turnoText = document.getElementById('damas-turno');
        this.redCountText = document.getElementById('damas-red-captured');
        this.blackCountText = document.getElementById('damas-black-captured');
        this.statusText = document.getElementById('damas-status');

        this.rows = 8;
        this.cols = 8;
        
        this.board = [];
        this.currentPlayer = 'red'; // red vs black
        this.selectedPiece = null; // { r, c }
        this.validMoves = []; // array of { r, c, capture: { r, c } }
        this.isGameOver = false;

        this.redCount = 12; // remaining
        this.blackCount = 12; // remaining
    }

    start() {
        this.cleanup();
        this.board = Array.from({ length: this.rows }, () => Array(this.cols).fill(null));
        this.currentPlayer = 'red';
        this.selectedPiece = null;
        this.validMoves = [];
        this.isGameOver = false;
        this.redCount = 12;
        this.blackCount = 12;

        this.turnoText.textContent = 'Vermelhas';
        this.turnoText.className = 'active-player-text';
        this.turnoText.style.color = '#ff4b2b';
        this.statusText.textContent = 'Selecione uma de suas peças vermelhas para mover';
        this.statusText.style.color = '#94a3b8';

        this.redCountText.textContent = this.redCount;
        this.blackCountText.textContent = this.blackCount;

        this.setupBoard();
        this.desenharTabuleiro();
    }

    setupBoard() {
        // Place initial pieces on dark cells
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                if ((r + c) % 2 === 1) { // Dark squares
                    if (r < 3) {
                        this.board[r][c] = { type: 'black', king: false };
                    } else if (r > 4) {
                        this.board[r][c] = { type: 'red', king: false };
                    }
                }
            }
        }
    }

    desenharTabuleiro() {
        this.grid.innerHTML = '';
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                const cellWrapper = document.createElement('div');
                const isDark = (r + c) % 2 === 1;
                cellWrapper.className = `square-inner ${isDark ? 'dark-square' : 'light-square'}`;

                // Mark selection
                if (this.selectedPiece && this.selectedPiece.r === r && this.selectedPiece.c === c) {
                    cellWrapper.classList.add('selected-square');
                }

                // Check if this cell is a valid move destination
                const moveOption = this.validMoves.find(m => m.r === r && m.c === c);
                if (moveOption) {
                    if (moveOption.capture) {
                        cellWrapper.classList.add('valid-move-capture');
                    } else {
                        cellWrapper.classList.add('valid-move');
                    }
                    cellWrapper.addEventListener('click', () => this.executarMovimento(r, c));
                }

                // Draw pieces
                const piece = this.board[r][c];
                if (piece) {
                    const chip = document.createElement('div');
                    chip.className = `checker-piece piece-${piece.type}`;
                    if (piece.king) {
                        chip.classList.add('king');
                    }

                    // Add click listeners to current player's pieces
                    if (!this.isGameOver && piece.type === this.currentPlayer) {
                        chip.addEventListener('click', () => this.selecionarPeca(r, c));
                    }
                    cellWrapper.appendChild(chip);
                } else if (isDark && !moveOption) {
                    // Empty dark cell clicks deselect current choice
                    cellWrapper.addEventListener('click', () => this.deselecionar());
                }

                this.grid.appendChild(cellWrapper);
            }
        }
    }

    selecionarPeca(r, c) {
        if (this.isGameOver) return;
        this.selectedPiece = { r, c };
        this.validMoves = this.obterMovimentosValidos(r, c);
        
        if (this.validMoves.length === 0) {
            this.statusText.textContent = 'Esta peça não possui movimentos válidos!';
            this.statusText.style.color = '#ff4b2b';
        } else {
            this.statusText.textContent = 'Escolha uma casa iluminada para mover.';
            this.statusText.style.color = '#38ef7d';
        }

        this.desenharTabuleiro();
    }

    deselecionar() {
        this.selectedPiece = null;
        this.validMoves = [];
        this.statusText.textContent = this.currentPlayer === 'red' ? 
            'Selecione uma de suas peças vermelhas para mover' : 
            'Selecione uma de suas peças pretas para mover';
        this.statusText.style.color = '#94a3b8';
        this.desenharTabuleiro();
    }

    obterMovimentosValidos(r, c) {
        const piece = this.board[r][c];
        if (!piece || piece.type !== this.currentPlayer) return [];
        
        const moves = [];
        const opponent = this.currentPlayer === 'red' ? 'black' : 'red';
        
        // Define direction steps
        let directions = [];
        if (piece.king) {
            directions = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
        } else {
            directions = this.currentPlayer === 'red' ? [[-1, -1], [-1, 1]] : [[1, -1], [1, 1]];
        }

        directions.forEach(([dr, dc]) => {
            const nr = r + dr;
            const nc = c + dc;
            
            if (this.dentroDoTabuleiro(nr, nc)) {
                const target = this.board[nr][nc];
                if (!target) {
                    // Normal move to empty square
                    moves.push({ r: nr, c: nc, capture: null });
                } else if (target.type === opponent) {
                    // Check capture jump
                    const jr = nr + dr;
                    const jc = nc + dc;
                    if (this.dentroDoTabuleiro(jr, jc) && !this.board[jr][jc]) {
                        moves.push({ r: jr, c: jc, capture: { r: nr, c: nc } });
                    }
                }
            }
        });

        return moves;
    }

    executarMovimento(tr, tc) {
        if (!this.selectedPiece) return;
        const { r: sr, c: sc } = this.selectedPiece;
        const moveOption = this.validMoves.find(m => m.r === tr && m.c === tc);
        if (!moveOption) return;

        const piece = this.board[sr][sc];

        // Move piece
        this.board[tr][tc] = piece;
        this.board[sr][sc] = null;

        // Apply capture if it occurred
        if (moveOption.capture) {
            const { r: cr, c: cc } = moveOption.capture;
            const capturedPiece = this.board[cr][cc];
            this.board[cr][cc] = null;

            if (capturedPiece.type === 'red') {
                this.redCount--;
                this.redCountText.textContent = this.redCount;
            } else {
                this.blackCount--;
                this.blackCountText.textContent = this.blackCount;
            }
        }

        // King promotion upon reaching final row
        if ((this.currentPlayer === 'red' && tr === 0) || (this.currentPlayer === 'black' && tr === 7)) {
            piece.king = true;
        }

        // Validate Victory
        if (this.redCount === 0) {
            this.statusText.textContent = 'Vitória! As peças Pretas ganharam!';
            this.statusText.style.color = '#38ef7d';
            this.isGameOver = true;
            this.deseletarFimDeJogo();
            return;
        }
        if (this.blackCount === 0) {
            this.statusText.textContent = 'Vitória! As peças Vermelhas ganharam!';
            this.statusText.style.color = '#38ef7d';
            this.isGameOver = true;
            this.deseletarFimDeJogo();
            return;
        }

        // Swap players turns
        this.currentPlayer = this.currentPlayer === 'red' ? 'black' : 'red';
        this.turnoText.textContent = this.currentPlayer === 'red' ? 'Vermelhas' : 'Pretas';
        this.turnoText.style.color = this.currentPlayer === 'red' ? '#ff4b2b' : '#cbd5e1';

        this.selectedPiece = null;
        this.validMoves = [];
        this.statusText.textContent = this.currentPlayer === 'red' ? 
            'Selecione uma de suas peças vermelhas para mover' : 
            'Selecione uma de suas peças pretas para mover';
        this.statusText.style.color = '#94a3b8';

        this.desenharTabuleiro();
    }

    deseletarFimDeJogo() {
        this.selectedPiece = null;
        this.validMoves = [];
        this.desenharTabuleiro();
    }

    dentroDoTabuleiro(r, c) {
        return r >= 0 && r < this.rows && c >= 0 && c < this.cols;
    }

    cleanup() {
        this.grid.innerHTML = '';
    }
}


// ==========================================================================
// GAME 3: XADREZ (CHESS ENGINE)
// ==========================================================================
class ChessGame {
    constructor() {
        this.grid = document.getElementById('xadrez-grid');
        this.turnoText = document.getElementById('xadrez-turno');
        this.statusText = document.getElementById('xadrez-status');

        this.rows = 8;
        this.cols = 8;

        this.board = [];
        this.currentPlayer = 'w'; // w = White, b = Black
        this.selectedSquare = null; // { r, c }
        this.validMoves = []; // array of { r, c }
        this.isGameOver = false;

        this.unicodePieces = {
            'w': { 'k': '♔', 'q': '♕', 'r': '♖', 'b': '♗', 'n': '♘', 'p': '♙' },
            'b': { 'k': '♚', 'q': '♛', 'r': '♜', 'b': '♝', 'n': '♞', 'p': '♟' }
        };
    }

    start() {
        this.cleanup();
        this.board = Array.from({ length: this.rows }, () => Array(this.cols).fill(null));
        this.currentPlayer = 'w';
        this.selectedSquare = null;
        this.validMoves = [];
        this.isGameOver = false;

        this.turnoText.textContent = 'Brancas';
        this.turnoText.style.color = '#f8fafc';
        this.statusText.textContent = 'Selecione uma de suas peças brancas para jogar';
        this.statusText.style.color = '#94a3b8';

        this.setupBoard();
        this.desenharTabuleiro();
    }

    setupBoard() {
        // Black pieces row 0
        const backRow = ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'];
        for (let c = 0; c < this.cols; c++) {
            this.board[0][c] = { type: backRow[c], color: 'b' };
            this.board[1][c] = { type: 'p', color: 'b' };
            
            // White pieces rows 6 and 7
            this.board[6][c] = { type: 'p', color: 'w' };
            this.board[7][c] = { type: backRow[c], color: 'w' };
        }
    }

    desenharTabuleiro() {
        this.grid.innerHTML = '';
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                const cellWrapper = document.createElement('div');
                const isDark = (r + c) % 2 === 1;
                cellWrapper.className = `square-inner ${isDark ? 'dark-square' : 'light-square'}`;

                // Mark selection
                if (this.selectedSquare && this.selectedSquare.r === r && this.selectedSquare.c === c) {
                    cellWrapper.classList.add('selected-square');
                }

                // Check if valid destination
                const isMoveValid = this.validMoves.some(m => m.r === r && m.c === c);
                if (isMoveValid) {
                    const hasEnemy = this.board[r][c] !== null;
                    if (hasEnemy) {
                        cellWrapper.classList.add('valid-move-capture');
                    } else {
                        cellWrapper.classList.add('valid-move');
                    }
                    cellWrapper.addEventListener('click', () => this.executarMovimento(r, c));
                }

                // Render piece symbols
                const piece = this.board[r][c];
                if (piece) {
                    const glyph = document.createElement('div');
                    glyph.className = `chess-piece chess-${piece.color === 'w' ? 'white' : 'black'}`;
                    glyph.textContent = this.unicodePieces[piece.color][piece.type];

                    // Select trigger
                    if (!this.isGameOver && piece.color === this.currentPlayer) {
                        glyph.addEventListener('click', (e) => {
                            e.stopPropagation(); // Avoid cellWrapper click reset
                            this.selecionarSquare(r, c);
                        });
                    }
                    cellWrapper.appendChild(glyph);
                } else if (!isMoveValid) {
                    // Empty square deselects
                    cellWrapper.addEventListener('click', () => this.deselecionar());
                }

                this.grid.appendChild(cellWrapper);
            }
        }
    }

    selecionarSquare(r, c) {
        if (this.isGameOver) return;
        this.selectedSquare = { r, c };
        this.validMoves = this.obterMovimentosValidos(r, c);

        if (this.validMoves.length === 0) {
            this.statusText.textContent = 'Nenhum movimento válido para esta peça!';
            this.statusText.style.color = '#ff4b2b';
        } else {
            this.statusText.textContent = 'Selecione uma casa iluminada para mover.';
            this.statusText.style.color = '#38ef7d';
        }

        this.desenharTabuleiro();
    }

    deselecionar() {
        this.selectedSquare = null;
        this.validMoves = [];
        this.statusText.textContent = this.currentPlayer === 'w' ? 
            'Selecione uma de suas peças brancas para jogar' : 
            'Selecione uma de suas peças pretas para jogar';
        this.statusText.style.color = '#94a3b8';
        this.desenharTabuleiro();
    }

    obterMovimentosValidos(r, c) {
        const piece = this.board[r][c];
        if (!piece || piece.color !== this.currentPlayer) return [];
        
        const moves = [];
        const oppColor = this.currentPlayer === 'w' ? 'b' : 'w';

        switch (piece.type) {
            case 'p': { // Pawn rules
                const dir = this.currentPlayer === 'w' ? -1 : 1;
                const startRow = this.currentPlayer === 'w' ? 6 : 1;
                
                // Move 1 forward
                if (this.dentroDoTabuleiro(r + dir, c) && !this.board[r + dir][c]) {
                    moves.push({ r: r + dir, c });
                    // Move 2 forward from starting line
                    if (r === startRow && !this.board[r + 2 * dir][c]) {
                        moves.push({ r: r + 2 * dir, c });
                    }
                }
                // Diagonal captures
                const diagCols = [c - 1, c + 1];
                diagCols.forEach(nc => {
                    if (this.dentroDoTabuleiro(r + dir, nc)) {
                        const target = this.board[r + dir][nc];
                        if (target && target.color === oppColor) {
                            moves.push({ r: r + dir, c: nc });
                        }
                    }
                });
                break;
            }
            case 'r': { // Rook rules
                this.adicionarMovimentosLongos(r, c, [[1,0], [-1,0], [0,1], [0,-1]], moves, oppColor);
                break;
            }
            case 'b': { // Bishop rules
                this.adicionarMovimentosLongos(r, c, [[1,1], [1,-1], [-1,1], [-1,-1]], moves, oppColor);
                break;
            }
            case 'q': { // Queen rules
                this.adicionarMovimentosLongos(r, c, [[1,0], [-1,0], [0,1], [0,-1], [1,1], [1,-1], [-1,1], [-1,-1]], moves, oppColor);
                break;
            }
            case 'k': { // King rules
                const offsets = [[1,0], [-1,0], [0,1], [0,-1], [1,1], [1,-1], [-1,1], [-1,-1]];
                offsets.forEach(([dr, dc]) => {
                    const nr = r + dr;
                    const nc = c + dc;
                    if (this.dentroDoTabuleiro(nr, nc)) {
                        const target = this.board[nr][nc];
                        if (!target || target.color === oppColor) {
                            moves.push({ r: nr, c: nc });
                        }
                    }
                });
                break;
            }
            case 'n': { // Knight rules
                const offsets = [[2,1], [2,-1], [-2,1], [-2,-1], [1,2], [1,-2], [-1,2], [-1,-2]];
                offsets.forEach(([dr, dc]) => {
                    const nr = r + dr;
                    const nc = c + dc;
                    if (this.dentroDoTabuleiro(nr, nc)) {
                        const target = this.board[nr][nc];
                        if (!target || target.color === oppColor) {
                            moves.push({ r: nr, c: nc });
                        }
                    }
                });
                break;
            }
        }

        return moves;
    }

    adicionarMovimentosLongos(r, c, directions, moves, oppColor) {
        directions.forEach(([dr, dc]) => {
            let nr = r + dr;
            let nc = c + dc;
            while (this.dentroDoTabuleiro(nr, nc)) {
                const target = this.board[nr][nc];
                if (!target) {
                    moves.push({ r: nr, c: nc });
                } else {
                    if (target.color === oppColor) {
                        moves.push({ r: nr, c: nc });
                    }
                    break; // blocked path
                }
                nr += dr;
                nc += dc;
            }
        });
    }

    executarMovimento(tr, tc) {
        if (!this.selectedSquare) return;
        const { r: sr, c: sc } = this.selectedSquare;
        const piece = this.board[sr][sc];
        const targetPiece = this.board[tr][tc];

        // Move piece
        this.board[tr][tc] = piece;
        this.board[sr][sc] = null;

        // Special promotion rule for pawn reaching opposite end
        if (piece.type === 'p' && (tr === 0 || tr === 7)) {
            piece.type = 'q'; // Automate Queen promotion for simplicity
        }

        // Validate King Capture (simple Chess checkmate end condition)
        if (targetPiece && targetPiece.type === 'k') {
            this.statusText.textContent = `Xeque-mate! Jogador das ${this.currentPlayer === 'w' ? 'Brancas' : 'Pretas'} venceu!`;
            this.statusText.style.color = '#38ef7d';
            this.isGameOver = true;
            this.deseletarFimDeJogo();
            return;
        }

        // Swap turns
        this.currentPlayer = this.currentPlayer === 'w' ? 'b' : 'w';
        this.turnoText.textContent = this.currentPlayer === 'w' ? 'Brancas' : 'Pretas';
        this.turnoText.style.color = this.currentPlayer === 'w' ? '#f8fafc' : '#38bdf8';

        this.selectedSquare = null;
        this.validMoves = [];
        this.statusText.textContent = this.currentPlayer === 'w' ? 
            'Selecione uma de suas peças brancas para jogar' : 
            'Selecione uma de suas peças pretas para jogar';
        this.statusText.style.color = '#94a3b8';

        this.desenharTabuleiro();
    }

    deseletarFimDeJogo() {
        this.selectedSquare = null;
        this.validMoves = [];
        this.desenharTabuleiro();
    }

    dentroDoTabuleiro(r, c) {
        return r >= 0 && r < this.rows && c >= 0 && c < this.cols;
    }

    cleanup() {
        this.grid.innerHTML = '';
    }
}


// ==========================================================================
// GAME 4: SEQUÊNCIA DE MEMÓRIA (SIMON ENGINE)
// ==========================================================================
class MemoryGame {
    constructor() {
        this.sequence = [];
        this.userSequence = [];
        this.score = 0;
        this.highScore = parseInt(localStorage.getItem('arcade_memory_highscore')) || 0;
        this.isPlayingSequence = false;
        this.audioCtx = null;
        this.timeouts = [];

        // DOM elements
        this.scoreDisplay = document.getElementById('memory-score');
        this.highScoreDisplay = document.getElementById('memory-highscore');
        this.statusText = document.getElementById('memory-status');
        this.pads = document.querySelectorAll('.memory-pad');

        // Bind handler reference for cleanup
        this.boundPadHandler = this.onPadClick.bind(this);
    }

    start() {
        this.cleanup();
        this.sequence = [];
        this.userSequence = [];
        this.score = 0;
        this.isPlayingSequence = false;

        this.scoreDisplay.textContent = this.score;
        this.highScoreDisplay.textContent = this.highScore;
        this.statusText.textContent = 'Prepare-se para começar...';
        this.statusText.style.color = '#94a3b8';

        // Add pad clicks
        this.pads.forEach(pad => {
            pad.addEventListener('click', this.boundPadHandler);
            pad.classList.remove('active');
        });

        // Start round after a brief delay
        this.registerTimeout(() => {
            this.proximaRodada();
        }, 1200);
    }

    proximaRodada() {
        this.userSequence = [];
        this.isPlayingSequence = true;
        this.statusText.textContent = 'Preste atenção na sequência!';
        this.statusText.style.color = '#ffeb3b';

        // Add a new random step to the sequence (0-3)
        const nextPad = Math.floor(Math.random() * 4);
        this.sequence.push(nextPad);

        this.tocarSequencia();
    }

    tocarSequencia() {
        let index = 0;
        const playNext = () => {
            if (index >= this.sequence.length) {
                this.isPlayingSequence = false;
                this.statusText.textContent = 'Sua vez! Repita o padrão.';
                this.statusText.style.color = '#00f2fe';
                return;
            }

            const padIdx = this.sequence[index];
            this.piscarPad(padIdx);
            index++;

            this.registerTimeout(playNext, 600); // interval between flashes
        };

        this.registerTimeout(playNext, 400);
    }

    piscarPad(padIdx) {
        const pad = this.pads[padIdx];
        if (!pad) return;

        pad.classList.add('active');
        this.tocarFrequencia(padIdx);

        this.registerTimeout(() => {
            pad.classList.remove('active');
        }, 300);
    }

    tocarFrequencia(padIdx) {
        // Lazy initialize AudioContext on user action
        if (!this.audioCtx) {
            this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }

        if (this.audioCtx.state === 'suspended') {
            this.audioCtx.resume();
        }

        // Frequencies for pads: Green, Red, Yellow, Blue
        const frequencies = [261.63, 293.66, 329.63, 349.23]; // C4, D4, E4, F4
        const freq = frequencies[padIdx] || 440;

        try {
            const osc = this.audioCtx.createOscillator();
            const gainNode = this.audioCtx.createGain();

            osc.type = 'triangle'; // Retro gaming tone
            osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

            gainNode.gain.setValueAtTime(0.15, this.audioCtx.currentTime);
            // Dynamic envelope release (prevent pop sound)
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.3);

            osc.connect(gainNode);
            gainNode.connect(this.audioCtx.destination);

            osc.start();
            osc.stop(this.audioCtx.currentTime + 0.35);
        } catch (e) {
            console.warn('Audio Context tone synthesis issue:', e);
        }
    }

    tocarFailBuzzer() {
        if (!this.audioCtx) return;
        try {
            const osc = this.audioCtx.createOscillator();
            const gainNode = this.audioCtx.createGain();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(120, this.audioCtx.currentTime);

            gainNode.gain.setValueAtTime(0.2, this.audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.5);

            osc.connect(gainNode);
            gainNode.connect(this.audioCtx.destination);

            osc.start();
            osc.stop(this.audioCtx.currentTime + 0.55);
        } catch (e) {
            console.warn(e);
        }
    }

    onPadClick(e) {
        if (this.isPlayingSequence) return; // Ignore user input while sequence plays

        const padIdx = parseInt(e.target.getAttribute('data-game') === null ? e.target.getAttribute('data-pad') : null);
        if (isNaN(padIdx)) return;

        // Flash pad and play sound
        this.piscarPad(padIdx);

        // Add to user choice
        this.userSequence.push(padIdx);

        // Check if user choices match sequence
        const currentCheckIdx = this.userSequence.length - 1;
        if (this.userSequence[currentCheckIdx] !== this.sequence[currentCheckIdx]) {
            this.gameOver();
            return;
        }

        // Check if round is complete
        if (this.userSequence.length === this.sequence.length) {
            this.score++;
            this.scoreDisplay.textContent = this.score;

            if (this.score > this.highScore) {
                this.highScore = this.score;
                this.highScoreDisplay.textContent = this.highScore;
                localStorage.setItem('arcade_memory_highscore', this.highScore);
            }

            this.statusText.textContent = 'Muito bem! Avançando...';
            this.statusText.style.color = '#38ef7d';

            this.isPlayingSequence = true; // Block clicking
            this.registerTimeout(() => {
                this.proximaRodada();
            }, 1000);
        }
    }

    gameOver() {
        this.isPlayingSequence = true; // Lock interactions
        this.statusText.textContent = 'Erro! Fim de Jogo!';
        this.statusText.style.color = '#ff3b30';
        this.tocarFailBuzzer();

        // Flash board as error
        this.pads.forEach(pad => pad.classList.add('active'));
        this.registerTimeout(() => {
            this.pads.forEach(pad => pad.classList.remove('active'));
        }, 500);
    }

    registerTimeout(fn, ms) {
        const id = setTimeout(fn, ms);
        this.timeouts.push(id);
    }

    cleanup() {
        this.timeouts.forEach(clearTimeout);
        this.timeouts = [];
        this.pads.forEach(pad => {
            pad.removeEventListener('click', this.boundPadHandler);
            pad.classList.remove('active');
        });
        if (this.audioCtx) {
            this.audioCtx.close().catch(() => {});
            this.audioCtx = null;
        }
    }
}


// ==========================================================================
// GAME 5: COBRINHA (SNAKE ENGINE)
// ==========================================================================
class SnakeGame {
    constructor() {
        this.canvas = document.getElementById('snake-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.scoreDisplay = document.getElementById('snake-score');
        
        this.gridSize = 20; // 20px cell sizes
        this.tileCount = this.canvas.width / this.gridSize; // 20 cells wide
        
        this.snake = [];
        this.direction = { x: 0, y: 0 };
        this.apple = { x: 0, y: 0 };
        this.score = 0;
        this.gameInterval = null;
        this.isGameOver = false;

        // Bind handler reference for cleanup
        this.boundKeyHandler = this.onKeyDown.bind(this);
    }

    start() {
        this.cleanup();

        this.snake = [
            { x: 10, y: 10 },
            { x: 9, y: 10 },
            { x: 8, y: 10 }
        ];
        this.direction = { x: 1, y: 0 }; // Start moving right
        this.score = 0;
        this.isGameOver = false;
        this.scoreDisplay.textContent = this.score;

        this.spawnApple();
        
        // Setup control listeners
        window.addEventListener('keydown', this.boundKeyHandler);

        // Run game loop every 110ms
        this.gameInterval = setInterval(() => {
            this.update();
            this.draw();
        }, 110);
    }

    spawnApple() {
        let proposedApple;
        let onSnake = true;

        while (onSnake) {
            proposedApple = {
                x: Math.floor(Math.random() * this.tileCount),
                y: Math.floor(Math.random() * this.tileCount)
            };
            onSnake = this.snake.some(segment => segment.x === proposedApple.x && segment.y === proposedApple.y);
        }

        this.apple = proposedApple;
    }

    update() {
        if (this.isGameOver) return;

        // Calculate next head position
        const head = {
            x: this.snake[0].x + this.direction.x,
            y: this.snake[0].y + this.direction.y
        };

        // Wall collisions
        if (head.x < 0 || head.x >= this.tileCount || head.y < 0 || head.y >= this.tileCount) {
            this.gameOver();
            return;
        }

        // Self collisions (skip the tail end because it moves forward)
        const selfCollision = this.snake.slice(0, -1).some(segment => segment.x === head.x && segment.y === head.y);
        if (selfCollision) {
            this.gameOver();
            return;
        }

        // Move snake by unshifting new head
        this.snake.unshift(head);

        // Apple collision
        if (head.x === this.apple.x && head.y === this.apple.y) {
            this.score += 10;
            this.scoreDisplay.textContent = this.score;
            this.spawnApple();
        } else {
            // Remove tail if didn't eat apple
            this.snake.pop();
        }
    }

    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#020306';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw Apple (with modern rounded drop-shadow appearance)
        this.ctx.fillStyle = '#ff4b2b';
        this.ctx.shadowColor = 'rgba(255, 75, 43, 0.5)';
        this.ctx.shadowBlur = 10;
        this.ctx.beginPath();
        const ax = this.apple.x * this.gridSize + this.gridSize / 2;
        const ay = this.apple.y * this.gridSize + this.gridSize / 2;
        this.ctx.arc(ax, ay, this.gridSize / 2 - 2, 0, Math.PI * 2);
        this.ctx.fill();

        // Draw Snake
        this.ctx.shadowBlur = 0; // Reset shadow blur
        this.snake.forEach((segment, index) => {
            const isHead = index === 0;
            this.ctx.fillStyle = isHead ? '#11998e' : '#38ef7d';
            
            // Draw rounded squares for snake body
            this.ctx.beginPath();
            const x = segment.x * this.gridSize + 1;
            const y = segment.y * this.gridSize + 1;
            const w = this.gridSize - 2;
            const h = this.gridSize - 2;
            const r = isHead ? 6 : 4; // corner radius
            this.ctx.roundRect ? this.ctx.roundRect(x, y, w, h, r) : this.ctx.rect(x, y, w, h);
            this.ctx.fill();

            // Draw tiny eyes for snake head
            if (isHead) {
                this.ctx.fillStyle = '#ffffff';
                const eyeRadius = 1.5;
                if (this.direction.x !== 0) { // Moving horizontal
                    const eyeX = x + (this.direction.x > 0 ? w - 5 : 5);
                    this.ctx.beginPath();
                    this.ctx.arc(eyeX, y + 5, eyeRadius, 0, Math.PI * 2);
                    this.ctx.arc(eyeX, y + h - 5, eyeRadius, 0, Math.PI * 2);
                    this.ctx.fill();
                } else if (this.direction.y !== 0) { // Moving vertical
                    const eyeY = y + (this.direction.y > 0 ? h - 5 : 5);
                    this.ctx.beginPath();
                    this.ctx.arc(x + 5, eyeY, eyeRadius, 0, Math.PI * 2);
                    this.ctx.arc(x + w - 5, eyeY, eyeRadius, 0, Math.PI * 2);
                    this.ctx.fill();
                }
            }
        });

        // If game over, draw overlay
        if (this.isGameOver) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            this.ctx.font = '800 2.2rem Outfit, sans-serif';
            this.ctx.fillStyle = '#ff4b2b';
            this.ctx.textAlign = 'center';
            this.ctx.shadowColor = 'rgba(255, 75, 43, 0.4)';
            this.ctx.shadowBlur = 15;
            this.ctx.fillText('GAME OVER', this.canvas.width / 2, this.canvas.height / 2 - 10);
            
            this.ctx.shadowBlur = 0;
            this.ctx.font = '500 1rem Outfit, sans-serif';
            this.ctx.fillStyle = '#94a3b8';
            this.ctx.fillText('Clique em "Reiniciar" para jogar de novo', this.canvas.width / 2, this.canvas.height / 2 + 25);
        }
    }

    onKeyDown(e) {
        if (this.isGameOver) return;

        // Prevent default arrow behavior to stop browser from scrolling page
        const arrowKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '];
        if (arrowKeys.includes(e.key)) {
            e.preventDefault();
        }

        switch (e.key) {
            case 'ArrowUp':
                if (this.direction.y === 0) {
                    this.direction = { x: 0, y: -1 };
                }
                break;
            case 'ArrowDown':
                if (this.direction.y === 0) {
                    this.direction = { x: 0, y: 1 };
                }
                break;
            case 'ArrowLeft':
                if (this.direction.x === 0) {
                    this.direction = { x: -1, y: 0 };
                }
                break;
            case 'ArrowRight':
                if (this.direction.x === 0) {
                    this.direction = { x: 1, y: 0 };
                }
                break;
        }
    }

    gameOver() {
        this.isGameOver = true;
        this.draw();
        clearInterval(this.gameInterval);
    }

    cleanup() {
        if (this.gameInterval) {
            clearInterval(this.gameInterval);
            this.gameInterval = null;
        }
        window.removeEventListener('keydown', this.boundKeyHandler);
    }
}


// ==========================================================================
// GAME 6: CAMPO MINADO (MINESWEEPER ENGINE)
// ==========================================================================
class MinesweeperGame {
    constructor() {
        this.grid = document.getElementById('minesweeper-grid');
        this.flagCountDisplay = document.getElementById('mines-flag-count');
        this.statusText = document.getElementById('mines-status-text');

        this.rows = 9;
        this.cols = 9;
        this.minesTotal = 10;
        
        this.board = [];
        this.flagsPlaced = 0;
        this.isGameOver = false;
        this.revealedCount = 0;

        // Save reference for contextmenu override cleanup
        this.boundContextMenuBlock = (e) => e.preventDefault();
    }

    start() {
        this.cleanup();
        this.board = [];
        this.flagsPlaced = 0;
        this.isGameOver = false;
        this.revealedCount = 0;

        this.flagCountDisplay.textContent = `0/${this.minesTotal}`;
        this.statusText.textContent = 'Seguro';
        this.statusText.className = 'score-pill status-em-jogo';

        // Block context menus inside the grid to handle right click flag toggles smoothly
        this.grid.addEventListener('contextmenu', this.boundContextMenuBlock);

        // Configure Grid Columns
        this.grid.style.gridTemplateColumns = `repeat(${this.cols}, 30px)`;

        this.gerarTabuleiro();
        this.desenharTabuleiro();
    }

    gerarTabuleiro() {
        // 1. Initialize board layout
        for (let r = 0; r < this.rows; r++) {
            this.board[r] = [];
            for (let c = 0; c < this.cols; c++) {
                this.board[r][c] = {
                    row: r,
                    col: c,
                    isMine: false,
                    isRevealed: false,
                    isFlagged: false,
                    neighborMines: 0
                };
            }
        }

        // 2. Place random mines
        let minesPlaced = 0;
        while (minesPlaced < this.minesTotal) {
            const r = Math.floor(Math.random() * this.rows);
            const c = Math.floor(Math.random() * this.cols);
            if (!this.board[r][c].isMine) {
                this.board[r][c].isMine = true;
                minesPlaced++;
            }
        }

        // 3. Count neighbor mines
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                if (this.board[r][c].isMine) continue;
                
                let minesCount = 0;
                // Scan 3x3 surrounding
                for (let dr = -1; dr <= 1; dr++) {
                    for (let dc = -1; dc <= 1; dc++) {
                        const nr = r + dr;
                        const nc = c + dc;
                        if (nr >= 0 && nr < this.rows && nc >= 0 && nc < this.cols) {
                            if (this.board[nr][nc].isMine) minesCount++;
                        }
                    }
                }
                this.board[r][c].neighborMines = minesCount;
            }
        }
    }

    desenharTabuleiro() {
        this.grid.innerHTML = '';
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                const cell = this.board[r][c];
                const btn = document.createElement('button');
                btn.className = 'mine-cell';
                btn.setAttribute('data-row', r);
                btn.setAttribute('data-col', c);
                
                // Add event listeners
                btn.addEventListener('click', (e) => this.revelarCelula(r, c));
                btn.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                    this.toggleBandeira(r, c);
                });

                this.grid.appendChild(btn);
            }
        }
    }

    revelarCelula(r, c) {
        if (this.isGameOver) return;
        const cell = this.board[r][c];
        
        // Skip if revealed or flagged
        if (cell.isRevealed || cell.isFlagged) return;

        const btn = this.obterBotaoDaCelula(r, c);
        cell.isRevealed = true;
        this.revealedCount++;

        // Mine hit
        if (cell.isMine) {
            btn.classList.add('mine');
            btn.innerHTML = '💣';
            this.finalizarJogo(false);
            return;
        }

        // Reveal safe content
        btn.classList.add('revealed');
        if (cell.neighborMines > 0) {
            btn.textContent = cell.neighborMines;
            btn.classList.add(`mine-${cell.neighborMines}`);
        } else {
            // Flood-fill for empty cells (0 neighbors)
            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    const nr = r + dr;
                    const nc = c + dc;
                    if (nr >= 0 && nr < this.rows && nc >= 0 && nc < this.cols) {
                        this.revelarCelula(nr, nc);
                    }
                }
            }
        }

        // Validate Victory condition
        const totalSafeCells = (this.rows * this.cols) - this.minesTotal;
        if (this.revealedCount === totalSafeCells) {
            this.finalizarJogo(true);
        }
    }

    toggleBandeira(r, c) {
        if (this.isGameOver) return;
        const cell = this.board[r][c];
        if (cell.isRevealed) return;

        const btn = this.obterBotaoDaCelula(r, c);
        
        if (!cell.isFlagged) {
            // Try to place flag
            cell.isFlagged = true;
            this.flagsPlaced++;
            btn.classList.add('flagged');
            btn.innerHTML = '🚩';
        } else {
            // Remove flag
            cell.isFlagged = false;
            this.flagsPlaced--;
            btn.classList.remove('flagged');
            btn.innerHTML = '';
        }

        this.flagCountDisplay.textContent = `${this.flagsPlaced}/${this.minesTotal}`;
    }

    obterBotaoDaCelula(r, c) {
        const idx = r * this.cols + c;
        return this.grid.children[idx];
    }

    finalizarJogo(isVictory) {
        this.isGameOver = true;
        
        // Expose all mines
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                const cell = this.board[r][c];
                const btn = this.obterBotaoDaCelula(r, c);
                if (cell.isMine) {
                    btn.classList.add('revealed');
                    if (!isVictory) {
                        btn.innerHTML = '💣';
                        if (!cell.isRevealed) btn.style.background = 'rgba(255, 59, 48, 0.2)';
                    } else {
                        btn.innerHTML = '🚩';
                        btn.classList.add('flagged');
                    }
                }
            }
        }

        if (isVictory) {
            this.statusText.textContent = 'VITÓRIA!';
            this.statusText.className = 'score-pill status-vitoria';
        } else {
            this.statusText.textContent = 'EXPLODIU!';
            this.statusText.className = 'score-pill status-derrota';
        }
    }

    cleanup() {
        this.grid.innerHTML = '';
        this.grid.removeEventListener('contextmenu', this.boundContextMenuBlock);
    }
}


// ==========================================================================
// GAME 7: TETRIS ENGINE
// ==========================================================================
class TetrisGame {
    constructor() {
        this.canvas = document.getElementById('tetris-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.nextCanvas = document.getElementById('tetris-next-canvas');
        this.nextCtx = this.nextCanvas.getContext('2d');
        
        this.scoreVal = document.getElementById('tetris-score');
        this.linesVal = document.getElementById('tetris-lines');

        // Matrix scale dimensions
        this.ctx.scale(24, 24); // 240 width / 24 scale = 10 columns
        this.nextCtx.scale(20, 20); // 80 width / 20 scale = 4x4 block fits

        this.board = [];
        this.score = 0;
        this.lines = 0;
        
        this.player = {
            pos: { x: 0, y: 0 },
            matrix: null,
            color: ''
        };
        
        this.nextPiece = null;
        this.dropCounter = 0;
        this.dropInterval = 800; // 800ms gravity drop
        this.lastTime = 0;
        
        this.rAF_id = null; // Animation frame tracker
        this.boundKeyHandler = this.onKeyDown.bind(this);

        // Piece Palette Configurations
        this.pieces = 'ILJSZOT';
        this.colors = {
            'I': '#00f2fe',
            'L': '#f2994a',
            'J': '#2d82b7',
            'S': '#38ef7d',
            'Z': '#ff4b2b',
            'O': '#ffeb3b',
            'T': '#9b51e0'
        };
    }

    start() {
        this.cleanup();
        
        // Initialize Board Grid (10x20 filled with 0)
        this.board = Array.from({ length: 20 }, () => Array(10).fill(0));
        
        this.score = 0;
        this.lines = 0;
        this.scoreVal.textContent = this.score;
        this.linesVal.textContent = this.lines;
        
        this.nextPiece = this.criarPecaNova();
        this.spawnPeca();

        window.addEventListener('keydown', this.boundKeyHandler);

        // Begin render loop
        this.lastTime = 0;
        const loop = (time = 0) => {
            const deltaTime = time - this.lastTime;
            this.lastTime = time;
            
            this.dropCounter += deltaTime;
            if (this.dropCounter > this.dropInterval) {
                this.drop();
            }

            this.draw();
            this.rAF_id = requestAnimationFrame(loop);
        };

        this.rAF_id = requestAnimationFrame(loop);
    }

    criarPecaNova() {
        const randomPieceType = this.pieces[Math.floor(Math.random() * this.pieces.length)];
        let matrix;
        
        switch (randomPieceType) {
            case 'I':
                matrix = [
                    [0, 0, 0, 0],
                    [1, 1, 1, 1],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0]
                ];
                break;
            case 'L':
                matrix = [
                    [0, 0, 1],
                    [1, 1, 1],
                    [0, 0, 0]
                ];
                break;
            case 'J':
                matrix = [
                    [1, 0, 0],
                    [1, 1, 1],
                    [0, 0, 0]
                ];
                break;
            case 'S':
                matrix = [
                    [0, 1, 1],
                    [1, 1, 0],
                    [0, 0, 0]
                ];
                break;
            case 'Z':
                matrix = [
                    [1, 1, 0],
                    [0, 1, 1],
                    [0, 0, 0]
                ];
                break;
            case 'O':
                matrix = [
                    [1, 1],
                    [1, 1]
                ];
                break;
            case 'T':
                matrix = [
                    [0, 1, 0],
                    [1, 1, 1],
                    [0, 0, 0]
                ];
                break;
        }

        return {
            matrix: matrix,
            color: this.colors[randomPieceType]
        };
    }

    spawnPeca() {
        this.player.matrix = this.nextPiece.matrix;
        this.player.color = this.nextPiece.color;
        
        // Align starting position center top
        this.player.pos.y = 0;
        this.player.pos.x = Math.floor((this.board[0].length - this.player.matrix[0].length) / 2);
        
        // Load next piece ahead
        this.nextPiece = this.criarPecaNova();
        this.desenharProximaPeca();

        // Game over validation upon spawn collision
        if (this.verificarColisao()) {
            this.gameOver();
        }
    }

    verificarColisao(matrix = this.player.matrix, offset = this.player.pos) {
        const m = matrix;
        const o = offset;
        for (let y = 0; y < m.length; ++y) {
            for (let x = 0; x < m[y].length; ++x) {
                if (m[y][x] !== 0 &&
                   (this.board[y + o.y] &&
                    this.board[y + o.y][x + o.x]) !== 0) {
                    return true;
                }
            }
        }
        return false;
    }

    mover(dir) {
        this.player.pos.x += dir;
        if (this.verificarColisao()) {
            this.player.pos.x -= dir; // Undo move if collide
        }
    }

    rotacionarPeca() {
        const originalMatrix = this.player.matrix;
        
        // Transpose matrix
        const transposed = Array.from({ length: this.player.matrix.length }, () => []);
        for (let r = 0; r < this.player.matrix.length; r++) {
            for (let c = 0; c < this.player.matrix[r].length; c++) {
                transposed[c][r] = this.player.matrix[r][c];
            }
        }
        
        // Reverse rows to complete 90deg rotation
        const rotated = transposed.map(row => row.reverse());
        this.player.matrix = rotated;

        // Collision check. If collides, try wall kicks, or revert if they fail
        let offset = 1;
        const pos = this.player.pos.x;
        while (this.verificarColisao()) {
            this.player.pos.x += offset;
            offset = -(offset + (offset > 0 ? 1 : -1));
            if (offset > this.player.matrix[0].length) {
                this.player.matrix = originalMatrix; // Revert
                this.player.pos.x = pos;
                return;
            }
        }
    }

    drop() {
        this.player.pos.y++;
        if (this.verificarColisao()) {
            this.player.pos.y--;
            this.mesclarTabuleiro();
            this.limparLinhas();
            this.spawnPeca();
        }
        this.dropCounter = 0;
    }

    mesclarTabuleiro() {
        this.player.matrix.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    this.board[y + this.player.pos.y][x + this.player.pos.x] = this.player.color;
                }
            });
        });
    }

    limparLinhas() {
        let linesClearedThisRound = 0;
        outer: for (let y = this.board.length - 1; y >= 0; --y) {
            for (let x = 0; x < this.board[y].length; ++x) {
                if (this.board[y][x] === 0) {
                    continue outer;
                }
            }

            // Remove full row and prepend empty row
            const row = this.board.splice(y, 1)[0].fill(0);
            this.board.unshift(row);
            ++y; // offset decrement because we spliced
            linesClearedThisRound++;
        }

        if (linesClearedThisRound > 0) {
            this.lines += linesClearedThisRound;
            // Classical scoring weights: single = 100, double = 300, triple = 500, tetris = 800
            const scores = [0, 100, 300, 500, 800];
            this.score += (scores[linesClearedThisRound] || 800);
            
            this.scoreVal.textContent = this.score;
            this.linesVal.textContent = this.lines;
        }
    }

    draw() {
        // Clear Main Board
        this.ctx.fillStyle = '#020306';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw merged board grid
        this.board.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    this.ctx.fillStyle = value;
                    this.ctx.fillRect(x, y, 1, 1);
                    this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
                    this.ctx.strokeRect(x, y, 1, 1);
                }
            });
        });

        // Draw active piece
        this.player.matrix.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    this.ctx.fillStyle = this.player.color;
                    this.ctx.fillRect(this.player.pos.x + x, this.player.pos.y + y, 1, 1);
                    this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
                    this.ctx.strokeRect(this.player.pos.x + x, this.player.pos.y + y, 1, 1);
                }
            });
        });
    }

    desenharProximaPeca() {
        // Clear Next Canvas
        this.nextCtx.fillStyle = '#020306';
        this.nextCtx.fillRect(0, 0, 4, 4);

        if (!this.nextPiece) return;

        // Draw Next Piece centered
        const matrix = this.nextPiece.matrix;
        const color = this.nextPiece.color;
        
        const offsetX = (4 - matrix[0].length) / 2;
        const offsetY = (4 - matrix.length) / 2;

        matrix.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    this.nextCtx.fillStyle = color;
                    this.nextCtx.fillRect(x + offsetX, y + offsetY, 1, 1);
                    this.nextCtx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
                    this.nextCtx.strokeRect(x + offsetX, y + offsetY, 1, 1);
                }
            });
        });
    }

    onKeyDown(e) {
        // Stop browser page scroll default actions
        const preventKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
        if (preventKeys.includes(e.key)) {
            e.preventDefault();
        }

        switch (e.key) {
            case 'ArrowLeft':
                this.mover(-1);
                break;
            case 'ArrowRight':
                this.mover(1);
                break;
            case 'ArrowDown':
                this.drop();
                break;
            case 'ArrowUp':
                this.rotacionarPeca();
                break;
        }
    }

    gameOver() {
        cancelAnimationFrame(this.rAF_id);
        this.rAF_id = null;
        window.removeEventListener('keydown', this.boundKeyHandler);

        // Render game over overlay text inside canvas
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        this.ctx.fillRect(0, 0, 10, 20);

        this.ctx.font = 'bold 1.2px Outfit, sans-serif';
        this.ctx.fillStyle = '#ff4b2b';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('GAME OVER', 5, 8);

        this.ctx.font = '0.5px Outfit, sans-serif';
        this.ctx.fillStyle = '#94a3b8';
        this.ctx.fillText('Clique em Reiniciar', 5, 11);
    }

    cleanup() {
        if (this.rAF_id) {
            cancelAnimationFrame(this.rAF_id);
            this.rAF_id = null;
        }
        window.removeEventListener('keydown', this.boundKeyHandler);
        
        // Reset scale matrices values before constructor reinstantiates to prevent multipliers
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.scale(24, 24);
        
        this.nextCtx.setTransform(1, 0, 0, 1, 0, 0);
        this.nextCtx.scale(20, 20);
    }
}
