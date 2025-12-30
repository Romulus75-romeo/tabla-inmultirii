// ============================================
// Duel Mode - Bot Challenge
// ============================================

window.DuelGame = {
    start(container, difficulty, onComplete) {
        const engine = new GameEngine();
        engine.generateQuestions(10);
        let current = 0;
        let playerScore = 0;
        let botScore = 0;
        let botSpeed = difficulty === 'easy' ? 3000 : difficulty === 'medium' ? 2000 : 1500;
        let botAccuracy = difficulty === 'easy' ? 0.6 : difficulty === 'medium' ? 0.8 : 0.95;

        const showQuestion = () => {
            if (current >= 10) {
                const won = playerScore > botScore;
                container.innerHTML = `
                    <div class="duel-results">
                        <h2>${won ? '🏆 AI CÂȘTIGAT!' : botScore > playerScore ? '😊 BOT-UL A CÂȘTIGAT' : '🤝 EGALITATE'}</h2>
                        <div class="duel-score-final">
                            <div class="player-final">
                                <div class="avatar">🦝</div>
                                <div class="score">${playerScore}</div>
                                <div class="label">Tu</div>
                            </div>
                            <div class="vs">VS</div>
                            <div class="bot-final">
                                <div class="avatar">🤖</div>
                                <div class="score">${botScore}</div>
                                <div class="label">Bot</div>
                            </div>
                        </div>
                        <button class="btn btn-primary" onclick="window.DuelGame.start(this.closest('.modal-content').querySelector('#gameContainer'), '${difficulty}')">Duel Din Nou</button>
                        <button class="btn btn-secondary" onclick="document.getElementById('gameModal').classList.remove('active')">Înapoi</button>
                    </div>
                `;
                if (onComplete) onComplete({ won, playerScore, botScore });
                return;
            }

            const q = engine.currentQuestions[current];
            let answered = false;

            container.innerHTML = `
                <div class="duel-game">
                    <div class="duel-header">
                        <h2>⚔️ DUEL! ⚔️</h2>
                        <p>Întrebarea ${current + 1}/10</p>
                    </div>

                    <div class="duel-scores">
                        <div class="duel-player">
                            <div class="avatar">🦝</div>
                            <div class="score">${playerScore}</div>
                            <div class="name">Tu</div>
                        </div>
                        <div class="vs-indicator">VS</div>
                        <div class="duel-bot">
                            <div class="avatar">🤖</div>
                            <div class="score">${botScore}</div>
                            <div class="name">Bot (${difficulty})</div>
                        </div>
                    </div>

                    <div class="duel-question">
                        <h3>${q.num1} × ${q.num2} = ?</h3>
                        <div class="duel-options">
                            ${q.options.map(opt => `
                                <button class="duel-option" data-answer="${opt}">${opt}</button>
                            `).join('')}
                        </div>
                    </div>

                    <div class="bot-status" id="botStatus">Bot se gândește...</div>
                </div>
            `;

            // Bot timer
            const botTimer = setTimeout(() => {
                if (!answered) {
                    const botCorrect = Math.random() < botAccuracy;
                    if (botCorrect) {
                        botScore++;
                        document.getElementById('botStatus').textContent = '🤖 Bot-ul a răspuns corect!';
                    } else {
                        document.getElementById('botStatus').textContent = '🤖 Bot-ul a greșit';
                    }
                }
            }, botSpeed);

            document.querySelectorAll('.duel-option').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    if (answered) return;
                    answered = true;
                    clearTimeout(botTimer);

                    const answer = parseInt(e.target.dataset.answer);
                    document.querySelectorAll('.duel-option').forEach(b => b.disabled = true);

                    if (answer === q.correctAnswer) {
                        e.target.style.background = '#95E1D3';
                        playerScore++;
                    } else {
                        e.target.style.background = '#F94144';
                    }

                    // Bot also answers
                    const botCorrect = Math.random() < botAccuracy;
                    if (botCorrect) {
                        botScore++;
                        document.getElementById('botStatus').textContent = '🤖 Bot-ul a răspuns corect!';
                    } else {
                        document.getElementById('botStatus').textContent = '🤖 Bot-ul a greșit';
                    }

                    setTimeout(() => {
                        current++;
                        showQuestion();
                    }, 1500);
                });
            });
        };

        showQuestion();
    }
};

const duelStyles = document.createElement('style');
duelStyles.textContent = `
    .duel-game {
        padding: 2rem;
        max-width: 700px;
        margin: 0 auto;
    }

    .duel-header {
        text-align: center;
        margin-bottom: 2rem;
    }

    .duel-header h2 {
        font-family: var(--font-display);
        font-size: 2.5rem;
        background: linear-gradient(135deg, var(--danger), var(--warning));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }

    .duel-scores {
        display: flex;
        justify-content: space-around;
        align-items: center;
        margin-bottom: 2rem;
        background: var(--gray-50);
        padding: 1.5rem;
        border-radius: var(--radius-lg);
    }

    .duel-player, .duel-bot {
        text-align: center;
    }

    .duel-player .avatar, .duel-bot .avatar {
        font-size: 4rem;
        margin-bottom: 0.5rem;
    }

    .duel-player .score, .duel-bot .score {
        font-size: 3rem;
        font-weight: 700;
        color: var(--primary);
    }

    .vs-indicator {
        font-size: 2rem;
        font-weight: 700;
        color: var(--gray-700);
    }

    .duel-question {
        background: var(--white);
        padding: 2rem;
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-md);
        text-align: center;
        margin-bottom: 1rem;
    }

    .duel-question h3 {
        font-size: 3rem;
        color: var(--primary);
        margin-bottom: 2rem;
    }

    .duel-options {
        display: flex;
        justify-content: center;
        gap: 1rem;
    }

    .duel-option {
        padding: 1.5rem 2rem;
        font-size: 2rem;
        font-weight: 700;
        background: var(--secondary);
        color: var(--white);
        border: none;
        border-radius: var(--radius-lg);
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .duel-option:hover:not(:disabled) {
        transform: scale(1.1);
    }

    .bot-status {
        text-align: center;
        font-size: 1.2rem;
        font-weight: 600;
        color: var(--info-dark);
        padding: 1rem;
    }

    .duel-results {
        text-align: center;
        padding: 2rem;
    }

    .duel-results h2 {
        font-family: var(--font-display);
        font-size: 3rem;
        margin-bottom: 2rem;
    }

    .duel-score-final {
        display: flex;
        justify-content: space-around;
        align-items: center;
        margin: 3rem 0;
    }

    .player-final, .bot-final {
        text-align: center;
    }

    .player-final .avatar, .bot-final .avatar {
        font-size: 5rem;
    }

    .player-final .score, .bot-final .score {
        font-size: 4rem;
        font-weight: 700;
        color: var(--primary);
        margin: 1rem 0;
    }

    .vs {
        font-size: 3rem;
        font-weight: 700;
        color: var(--gray-700);
    }
`;
document.head.appendChild(duelStyles);
