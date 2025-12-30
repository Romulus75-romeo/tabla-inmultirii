// ============================================
// Game: Race - "Cursă cu Numere"
// ============================================

window.RaceGame = {
    engine: null,
    container: null,
    callback: null,
    currentQuestion: 0,
    totalQuestions: 10,
    score: { correct: 0, wrong: 0, stars: 0, time: 0 },
    playerPosition: 0,
    botPosition: 0,

    start(container, onComplete) {
        this.container = container;
        this.callback = onComplete;
        this.engine = new GameEngine();
        this.engine.generateQuestions(this.totalQuestions);
        this.currentQuestion = 0;
        this.score = { correct: 0, wrong: 0, stars: 0, time: 0 };
        this.playerPosition = 0;
        this.botPosition = 0;

        this.showQuestion();
        this.startBotMovement();
    },

    showQuestion() {
        if (this.currentQuestion >= this.totalQuestions) {
            this.showResults();
            return;
        }

        const question = this.engine.currentQuestions[this.currentQuestion];

        this.container.innerHTML = `
            <div class="game-screen race-game">
                <div class="game-header">
                    <h2>🏃 Cursă cu Numere</h2>
                    <div class="question-counter">Întrebarea ${this.currentQuestion + 1}/${this.totalQuestions}</div>
                </div>

                <div class="race-track">
                    <div class="lane player-lane">
                        <div class="racer player" style="left: ${this.playerPosition}%">🦝</div>
                        <div class="lane-label">Tu</div>
                    </div>
                    <div class="lane bot-lane">
                        <div class="racer bot" style="left: ${this.botPosition}%">🤖</div>
                        <div class="lane-label">Bot</div>
                    </div>
                    <div class="finish-line">🏁</div>
                </div>

                <div class="question-area">
                    <div class="question">${question.num1} × ${question.num2} = ?</div>
                    <input type="number" class="answer-input" id="raceAnswer" placeholder="Răspunsul tău" autofocus>
                    <button class="btn btn-primary" id="submitAnswer">Verifică</button>
                </div>

                <div class="feedback-area"></div>
            </div>
        `;

        this.setupInput(question.correctAnswer);
    },

    setupInput(correctAnswer) {
        const input = document.getElementById('raceAnswer');
        const submitBtn = document.getElementById('submitAnswer');
        const feedbackArea = this.container.querySelector('.feedback-area');

        const checkAnswer = () => {
            const userAnswer = parseInt(input.value);
            if (isNaN(userAnswer)) return;

            submitBtn.disabled = true;
            input.disabled = true;

            if (userAnswer === correctAnswer) {
                feedbackArea.innerHTML = '<div class="feedback correct">✓ Corect! Alergi mai repede!</div>';
                this.score.correct++;
                this.playerPosition += 10;
                this.updateRacers();
            } else {
                feedbackArea.innerHTML = `<div class="feedback wrong">✗ Greșit! Răspunsul era ${correctAnswer}</div>`;
                this.score.wrong++;
            }

            setTimeout(() => {
                this.currentQuestion++;
                this.showQuestion();
            }, 1200);
        };

        submitBtn.addEventListener('click', checkAnswer);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') checkAnswer();
        });
    },

    startBotMovement() {
        this.botInterval = setInterval(() => {
            if (this.botPosition < 100) {
                this.botPosition += Math.random() * 3;
                this.updateRacers();
            }
        }, 500);
    },

    updateRacers() {
        const playerRacer = this.container.querySelector('.racer.player');
        const botRacer = this.container.querySelector('.racer.bot');

        if (playerRacer) {
            playerRacer.style.left = Math.min(this.playerPosition, 100) + '%';
        }
        if (botRacer) {
            botRacer.style.left = Math.min(this.botPosition, 100) + '%';
        }
    },

    showResults() {
        clearInterval(this.botInterval);
        this.score.time = this.engine.getElapsedTime();
        this.score.stars = this.engine.calculateStars(this.score.correct, this.totalQuestions);

        const won = this.playerPosition > this.botPosition;

        this.container.innerHTML = `
            <div class="game-results">
                <h2>${won ? '🏆 Ai Câștigat!' : '😊 Ai Terminat!'}</h2>
                <div class="race-result">
                    <div class="result-bar">
                        <div class="bar-fill player-fill" style="width: ${this.playerPosition}%">
                            🦝 ${Math.round(this.playerPosition)}%
                        </div>
                    </div>
                    <div class="result-bar">
                        <div class="bar-fill bot-fill" style="width: ${this.botPosition}%">
                            🤖 ${Math.round(this.botPosition)}%
                        </div>
                    </div>
                </div>
                <div class="stars-display">
                    ${'⭐'.repeat(this.score.stars)}${'☆'.repeat(3 - this.score.stars)}
                </div>
                <p>Răspunsuri corecte: ${this.score.correct}/${this.totalQuestions}</p>
                <button class="btn btn-primary" onclick="window.RaceGame.start(window.RaceGame.container, window.RaceGame.callback)">Joacă Din Nou</button>
                <button class="btn btn-secondary" onclick="document.getElementById('gameModal').classList.remove('active')">Înapoi</button>
            </div>
        `;

        if (this.callback) {
            this.callback(this.score);
        }
    }
};

// Add CSS
const raceStyles = document.createElement('style');
raceStyles.textContent = `
    .race-game {
        padding: 2rem;
        max-width: 800px;
        margin: 0 auto;
    }

    .race-track {
        position: relative;
        background: linear-gradient(to right, #FFE66D, #95E1D3);
        border-radius: var(--radius-lg);
        padding: 2rem;
        margin: 2rem 0;
        min-height: 150px;
    }

    .lane {
        position: relative;
        height: 50px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: var(--radius-md);
        margin-bottom: 1rem;
    }

    .racer {
        position: absolute;
        font-size: 2.5rem;
        transition: left 0.5s ease;
        top: 50%;
        transform: translateY(-50%);
    }

    .finish-line {
        position: absolute;
        right: 0;
        top: 0;
        bottom: 0;
        font-size: 3rem;
        display: flex;
        align-items: center;
    }

    .question-area {
        text-align: center;
        background: var(--white);
        padding: 2rem;
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-md);
    }

    .question-area .question {
        font-size: 3rem;
        font-weight: 700;
        color: var(--primary);
        margin-bottom: 1.5rem;
    }

    .answer-input {
        font-size: 2rem;
        padding: 1rem 2rem;
        border: 3px solid var(--secondary);
        border-radius: var(--radius-lg);
        text-align: center;
        width: 200px;
        margin-right: 1rem;
        font-family: var(--font-body);
        font-weight: 700;
    }

    .answer-input:focus {
        outline: none;
        border-color: var(--primary);
        box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.2);
    }

    .race-result {
        margin: 2rem 0;
    }

    .result-bar {
        background: var(--gray-200);
        height: 50px;
        border-radius: var(--radius-lg);
        margin-bottom: 1rem;
        overflow: hidden;
    }

    .bar-fill {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding-right: 1rem;
        font-weight: 700;
        color: var(--white);
        transition: width 0.5s ease;
    }

    .player-fill {
        background: linear-gradient(90deg, var(--primary), var(--primary-light));
    }

    .bot-fill {
        background: linear-gradient(90deg, var(--gray-700), var(--gray-300));
    }

    @media (max-width: 768px) {
        .race-track {
            min-height: 120px;
        }

        .answer-input {
            width: 100%;
            margin-bottom: 1rem;
        }
    }
`;
document.head.appendChild(raceStyles);
