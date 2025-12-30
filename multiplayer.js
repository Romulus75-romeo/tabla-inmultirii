// ============================================
// Multiplayer Local - 2 Jucători pe același device
// ============================================

class MultiplayerGame {
    constructor() {
        this.players = ['Jucător 1', 'Jucător 2'];
        this.currentPlayer = 0;
        this.scores = [0, 0];
        this.totalQuestions = 10;
        this.currentQuestion = 0;
    }

    start(container, onComplete) {
        this.container = container;
        this.callback = onComplete;
        this.engine = new GameEngine();
        this.engine.generateQuestions(this.totalQuestions);
        this.scores = [0, 0];
        this.currentPlayer = 0;
        this.currentQuestion = 0;

        this.showQuestion();
    }

    showQuestion() {
        if (this.currentQuestion >= this.totalQuestions) {
            this.showResults();
            return;
        }

        const question = this.engine.questions[this.currentQuestion];
        const playerName = this.players[this.currentPlayer];
        const playerColor = this.currentPlayer === 0 ? '#FF6B6B' : '#4ECDC4';

        this.container.innerHTML = `
            <div class="multiplayer-container">
                <div class="multiplayer-header">
                    <h2>⚔️ Mod Multiplayer</h2>
                    <div class="player-indicator" style="background: ${playerColor};">
                        Rândul: ${playerName}
                    </div>
                </div>

                <div class="multiplayer-scores">
                    <div class="player-score ${this.currentPlayer === 0 ? 'active' : ''}">
                        <div class="player-name">🔴 ${this.players[0]}</div>
                        <div class="score">${this.scores[0]}</div>
                    </div>
                    <div class="vs">VS</div>
                    <div class="player-score ${this.currentPlayer === 1 ? 'active' : ''}">
                        <div class="player-name">🔵 ${this.players[1]}</div>
                        <div class="score">${this.scores[1]}</div>
                    </div>
                </div>

                <div class="question-progress">
                    Întrebarea ${this.currentQuestion + 1} din ${this.totalQuestions}
                </div>

                <div class="multiplayer-question">
                    <h3>Cât face:</h3>
                    <div class="question-display">
                        <span class="num">${question.num1}</span>
                        <span class="op">×</span>
                        <span class="num">${question.num2}</span>
                        <span class="eq">=</span>
                        <span class="q">?</span>
                    </div>
                </div>

                <div class="multiplayer-options">
                    ${question.options.map(opt => `
                        <button class="multiplayer-option" data-answer="${opt}">${opt}</button>
                    `).join('')}
                </div>

                <div class="feedback-area" id="multiplayerFeedback"></div>
            </div>
        `;

        // Voice narration
        if (window.narrator) {
            setTimeout(() => narrator.speakQuestion(question.num1, question.num2), 300);
        }

        this.setupOptions(question.correctAnswer);
    }

    setupOptions(correctAnswer) {
        const buttons = this.container.querySelectorAll('.multiplayer-option');
        const feedback = document.getElementById('multiplayerFeedback');

        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                const userAnswer = parseInt(btn.dataset.answer);
                const isCorrect = userAnswer === correctAnswer;

                buttons.forEach(b => b.disabled = true);

                if (isCorrect) {
                    btn.classList.add('correct');
                    this.scores[this.currentPlayer]++;
                    feedback.innerHTML = `<div class="feedback correct">✓ Corect! +1 punct pentru ${this.players[this.currentPlayer]}</div>`;

                    if (window.narrator) narrator.speakCorrect();
                } else {
                    btn.classList.add('wrong');
                    buttons.forEach(b => {
                        if (parseInt(b.dataset.answer) === correctAnswer) {
                            b.classList.add('correct');
                        }
                    });
                    feedback.innerHTML = `<div class="feedback wrong">✗ Greșit! Răspunsul corect era ${correctAnswer}</div>`;

                    if (window.narrator) narrator.speakWrong(correctAnswer);
                }

                setTimeout(() => {
                    this.currentQuestion++;
                    this.currentPlayer = 1 - this.currentPlayer; // Switch player
                    this.showQuestion();
                }, 2000);
            });
        });
    }

    showResults() {
        const winner = this.scores[0] > this.scores[1] ? 0 : (this.scores[1] > this.scores[0] ? 1 : -1);
        let resultMessage = '';
        let emoji = '';

        if (winner === -1) {
            resultMessage = 'Remiză! Sunteți la egalitate!';
            emoji = '🤝';
        } else {
            resultMessage = `${this.players[winner]} a câștigat!`;
            emoji = winner === 0 ? '🏆' : '🥇';
        }

        this.container.innerHTML = `
            <div class="multiplayer-results">
                <div class="result-emoji">${emoji}</div>
                <h2>${resultMessage}</h2>

                <div class="final-scores">
                    <div class="final-score">
                        <div class="player-name">🔴 ${this.players[0]}</div>
                        <div class="score-value">${this.scores[0]} puncte</div>
                    </div>
                    <div class="final-score">
                        <div class="player-name">🔵 ${this.players[1]}</div>
                        <div class="score-value">${this.scores[1]} puncte</div>
                    </div>
                </div>

                <div class="result-buttons">
                    <button class="btn btn-primary" id="playAgainMulti">Joacă Din Nou</button>
                    <button class="btn btn-secondary" id="closeMulti">Închide</button>
                </div>
            </div>
        `;

        document.getElementById('playAgainMulti').addEventListener('click', () => {
            this.start(this.container, this.callback);
        });

        document.getElementById('closeMulti').addEventListener('click', () => {
            if (this.callback) {
                this.callback({ player1: this.scores[0], player2: this.scores[1] });
            }
        });
    }
}

// Initialize
window.multiplayerGame = new MultiplayerGame();

// CSS Styles
const multiStyles = document.createElement('style');
multiStyles.textContent = `
    .multiplayer-container {
        max-width: 700px;
        margin: 0 auto;
        padding: 2rem;
    }

    .multiplayer-header {
        text-align: center;
        margin-bottom: 2rem;
    }

    .multiplayer-header h2 {
        margin: 0 0 1rem 0;
        color: var(--primary);
    }

    .player-indicator {
        display: inline-block;
        padding: 0.75rem 2rem;
        border-radius: var(--radius-lg);
        color: white;
        font-weight: 700;
        font-size: 1.2rem;
    }

    .multiplayer-scores {
        display: grid;
        grid-template-columns: 1fr auto 1fr;
        gap: 2rem;
        align-items: center;
        margin-bottom: 2rem;
        padding: 1.5rem;
        background: var(--gray-50);
        border-radius: var(--radius-lg);
    }

    .player-score {
        text-align: center;
        padding: 1rem;
        border-radius: var(--radius-md);
        transition: all 0.3s ease;
    }

    .player-score.active {
        background: var(--white);
        box-shadow: var(--shadow-md);
        transform: scale(1.05);
    }

    .player-name {
        font-weight: 600;
        font-size: 1.1rem;
        margin-bottom: 0.5rem;
    }

    .score {
        font-size: 2.5rem;
        font-weight: 700;
        color: var(--primary);
    }

    .vs {
        font-size: 2rem;
        font-weight: 700;
        color: var(--gray-700);
    }

    .question-progress {
        text-align: center;
        font-weight: 600;
        color: var(--gray-700);
        margin-bottom: 2rem;
    }

    .multiplayer-question {
        text-align: center;
        margin-bottom: 2rem;
    }

    .multiplayer-question h3 {
        color: var(--gray-700);
        margin-bottom: 1rem;
    }

    .multiplayer-options {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1rem;
        margin-bottom: 2rem;
    }

    .multiplayer-option {
        padding: 2rem;
        font-size: 2rem;
        font-weight: 700;
        background: var(--secondary);
        color: var(--white);
        border: none;
        border-radius: var(--radius-md);
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .multiplayer-option:hover:not(:disabled) {
        transform: scale(1.1);
        box-shadow: var(--shadow-lg);
    }

    .multiplayer-option:disabled {
        cursor: not-allowed;
    }

    .multiplayer-option.correct {
        background: var(--success);
    }

    .multiplayer-option.wrong {
        background: var(--danger);
    }

    .multiplayer-results {
        text-align: center;
        padding: 2rem;
    }

    .result-emoji {
        font-size: 5rem;
        margin-bottom: 1rem;
    }

    .final-scores {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 2rem;
        margin: 2rem 0;
    }

    .final-score {
        background: var(--gray-50);
        padding: 2rem;
        border-radius: var(--radius-lg);
    }

    .score-value {
        font-size: 2.5rem;
        font-weight: 700;
        color: var(--primary);
        margin-top: 0.5rem;
    }

    .result-buttons {
        display: flex;
        gap: 1rem;
        justify-content: center;
        margin-top: 2rem;
    }

    @media (max-width: 768px) {
        .multiplayer-options {
            grid-template-columns: 1fr;
        }

        .final-scores {
            grid-template-columns: 1fr;
        }
    }
`;
document.head.appendChild(multiStyles);
