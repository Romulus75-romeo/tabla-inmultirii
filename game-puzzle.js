// ============================================
// Game: Puzzle - "Puzzle-ul Înmulțirii"
// ============================================

window.PuzzleGame = {
    start(container, onComplete) {
        const engine = new GameEngine();
        engine.generateQuestions(9);
        let solved = 0;
        const score = { correct: 0, wrong: 0, stars: 0, time: 0 };

        container.innerHTML = `
            <div class="puzzle-game">
                <h2>🧩 Puzzle-ul Înmulțirii</h2>
                <p>Rezolvă problemele pentru a debloca piesele de puzzle!</p>
                <div class="puzzle-grid" id="puzzleGrid"></div>
                <div class="current-question" id="currentQ"></div>
            </div>
        `;

        const grid = document.getElementById('puzzleGrid');
        const puzzleEmojis = ['🎨', '🎭', '🎪', '🎡', '🎢', '🎠', '🎰', '🎲', '🎯'];

        for (let i = 0; i < 9; i++) {
            const piece = document.createElement('div');
            piece.className = 'puzzle-piece locked';
            piece.innerHTML = '🔒';
            piece.dataset.index = i;
            grid.appendChild(piece);
        }

        const showQuestion = (index) => {
            if (index >= 9) {
                score.time = engine.getElapsedTime();
                score.stars = engine.calculateStars(score.correct, 9);
                container.innerHTML = `
                    <div class="game-results">
                        <h2>🎉 Puzzle Complet!</h2>
                        <div class="stars-display">${'⭐'.repeat(score.stars)}${'☆'.repeat(3 - score.stars)}</div>
                        <p>Ai rezolvat ${score.correct} din 9 probleme corect!</p>
                        <button class="btn btn-primary" onclick="window.PuzzleGame.start(this.closest('.modal-content').querySelector('#gameContainer'), ${onComplete})">Joacă Din Nou</button>
                    </div>
                `;
                if (onComplete) onComplete(score);
                return;
            }

            const q = engine.currentQuestions[index];
            document.getElementById('currentQ').innerHTML = `
                <div class="question-box">
                    <h3>Piesa ${index + 1} din 9</h3>
                    <p class="question">${q.num1} × ${q.num2} = ?</p>
                    <div class="options">
                        ${q.options.map(opt => `<button class="opt-btn" data-answer="${opt}">${opt}</button>`).join('')}
                    </div>
                </div>
            `;

            document.querySelectorAll('.opt-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const answer = parseInt(e.target.dataset.answer);
                    if (answer === q.correctAnswer) {
                        score.correct++;
                        const piece = grid.children[index];
                        piece.classList.remove('locked');
                        piece.classList.add('unlocked');
                        piece.innerHTML = puzzleEmojis[index];
                        setTimeout(() => showQuestion(index + 1), 500);
                    } else {
                        score.wrong++;
                        e.target.style.background = '#F94144';
                        setTimeout(() => e.target.style.background = '', 500);
                    }
                });
            });
        };

        showQuestion(0);
    }
};

const puzzleStyles = document.createElement('style');
puzzleStyles.textContent = `
    .puzzle-game {
        padding: 2rem;
        text-align: center;
    }

    .puzzle-game h2 {
        font-family: var(--font-display);
        font-size: 2rem;
        color: var(--primary);
        margin-bottom: 1rem;
    }

    .puzzle-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1rem;
        max-width: 400px;
        margin: 2rem auto;
    }

    .puzzle-piece {
        aspect-ratio: 1;
        font-size: 3rem;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: var(--radius-md);
        transition: all 0.3s ease;
    }

    .puzzle-piece.locked {
        background: var(--gray-300);
        filter: grayscale(100%);
    }

    .puzzle-piece.unlocked {
        background: linear-gradient(135deg, var(--success), var(--success-dark));
        animation: bounce 0.5s ease;
    }

    .current-question {
        margin-top: 2rem;
    }

    .question-box {
        background: var(--white);
        padding: 2rem;
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-md);
        max-width: 500px;
        margin: 0 auto;
    }

    .question-box .question {
        font-size: 2.5rem;
        font-weight: 700;
        color: var(--primary);
        margin: 1.5rem 0;
    }

    .options {
        display: flex;
        justify-content: center;
        gap: 1rem;
    }

    .opt-btn {
        padding: 1rem 2rem;
        font-size: 1.5rem;
        font-weight: 700;
        background: var(--secondary);
        color: var(--white);
        border: none;
        border-radius: var(--radius-lg);
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .opt-btn:hover {
        transform: scale(1.1);
    }
`;
document.head.appendChild(puzzleStyles);
