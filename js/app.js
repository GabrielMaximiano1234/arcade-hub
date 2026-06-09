// Arcade Hub - Game Navigation and Transition Controller

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const menuPrincipal = document.getElementById('menu-principal');
    const telaJogo = document.getElementById('tela-jogo');
    const btnVoltar = document.getElementById('btn-voltar');
    const jogoTitulo = document.getElementById('jogo-titulo');
    const jogoMensagem = document.getElementById('jogo-mensagem');
    const gameFrameGlow = document.querySelector('.game-frame-glow');
    const loaderSpinner = document.querySelector('.loader-spinner');
    const gamePlaceholder = document.querySelector('.game-placeholder-visual');

    // Game Metadata for Custom Styling and Content
    const gamesConfig = {
        uno: {
            title: 'Uno',
            description: 'A infraestrutura do Uno está pronta! Prepare-se para descartar cartas de ação, inverter o fluxo do jogo e acumular vitórias contra a inteligência artificial ou amigos. O baralho clássico está sendo embaralhado.',
            glowColor: 'rgba(255, 59, 48, 0.5)',
            themeColor: '#ff3b30'
        },
        xadrez: {
            title: 'Xadrez',
            description: 'A infraestrutura do Xadrez está pronta! Prepare a sua estratégia mental para posicionar peões, cavalos e bispos em direção ao xeque-mate inevitável. O tabuleiro quadriculado de alta definição está pronto para renderização.',
            glowColor: 'rgba(226, 232, 240, 0.3)',
            themeColor: '#e2e8f0'
        },
        damas: {
            title: 'Damas',
            description: 'A infraestrutura do jogo de Damas está pronta! Mova-se diagonalmente pelas casas escuras, capture as peças rivais e conquiste o tabuleiro ao coroar suas damas. As peças de madeira virtual estão prontas.',
            glowColor: 'rgba(255, 149, 0, 0.5)',
            themeColor: '#ff9500'
        },
        velha: {
            title: 'Jogo da Velha',
            description: 'A infraestrutura do Jogo da Velha está pronta! Posicione estrategicamente o seu X ou O para completar a sequência de 3 elementos antes do seu adversário. Partidas rápidas e intensas esperam por você.',
            glowColor: 'rgba(0, 242, 254, 0.5)',
            themeColor: '#00f2fe'
        },
        paciencia: {
            title: 'Paciência',
            description: 'A infraestrutura do jogo de Paciência está pronta! Organize o baralho clássico de cartas em colunas ordenadas e naipes crescentes. O feltro verde digital está posicionado para as suas melhores jogadas.',
            glowColor: 'rgba(52, 199, 89, 0.5)',
            themeColor: '#34c759'
        }
    };

    // Add click listeners to all game cards
    const cards = document.querySelectorAll('.game-card');
    cards.forEach(card => {
        card.addEventListener('click', (e) => {
            // Prevent trigger duplication if clicking inside buttons
            const gameKey = card.getAttribute('data-game');
            if (gameKey && gamesConfig[gameKey]) {
                iniciarJogo(gameKey);
            }
        });
    });

    // Back button listener
    btnVoltar.addEventListener('click', voltarAoMenu);

    /**
     * Hides the showcase menu and displays the selected game canvas area with a loader.
     * @param {string} gameKey - Key pointing to the selected game metadata.
     */
    function iniciarJogo(gameKey) {
        const config = gamesConfig[gameKey];

        // 1. Configure the game screen data
        jogoTitulo.textContent = config.title;
        jogoMensagem.textContent = config.description;
        
        // 2. Set dynamic neon glow background color
        gameFrameGlow.style.background = `radial-gradient(circle, ${config.glowColor}, transparent 70%)`;
        
        // 3. Reset display states (hide/show placeholders and loaders)
        loaderSpinner.style.display = 'block';
        jogoTitulo.style.opacity = '0.3';
        jogoMensagem.style.opacity = '0.3';
        gamePlaceholder.style.opacity = '0.3';
        
        // 4. Hide Main Menu Grid and Show Game Screen with transition
        menuPrincipal.classList.add('hidden');
        telaJogo.classList.remove('hidden');
        
        // Scroll to top of the game screen smoothly
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // 5. Simulate professional loading state transition (750ms)
        setTimeout(() => {
            loaderSpinner.style.display = 'none';
            jogoTitulo.style.transition = 'opacity 0.5s ease';
            jogoMensagem.style.transition = 'opacity 0.5s ease';
            gamePlaceholder.style.transition = 'opacity 0.5s ease';
            
            jogoTitulo.style.opacity = '1';
            jogoMensagem.style.opacity = '1';
            gamePlaceholder.style.opacity = '1';
            
            // Set dynamic spinner and indicator colors matching game theme
            const pulse = document.querySelector('.pulse-indicator');
            if (pulse) {
                pulse.style.backgroundColor = config.themeColor;
            }
        }, 750);
    }

    /**
     * Hides the game interface and brings back the primary games showcase grid.
     */
    function voltarAoMenu() {
        // Toggle visibility classes
        telaJogo.classList.add('hidden');
        menuPrincipal.classList.remove('hidden');
        
        // Scroll smoothly back to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});
