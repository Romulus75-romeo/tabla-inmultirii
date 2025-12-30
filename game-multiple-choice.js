// ============================================
// Game: Multiple Choice - "Lovește Tabla Corectă"
// ============================================

window.MultipleChoiceGame = {
    engine: null,
    container: null,
    callback: null,
    currentQuestion: 0,
    totalQuestions: 10,
    score: { correct: 0, wrong: 0, stars: 0, time: 0 },

    start(container, onComplete) {
        this.container = container;
        this.callback = onComplete;
        this.engine = new GameEngine();
        this.engine.generateQuestions(this.totalQuestions);
        this.currentQuestion = 0;
        this.score = { correct: 0, wrong: 0, stars: 0, time: 0 };

        // Voice narration
        if (window.narrator) {
            narrator.speakGameStart('multiple-choice');
        }

        this.showQuestion();
    },

    showQuestion() {
        if (this.currentQuestion >= this.totalQuestions) {
            this.showResults();
            return;
        }

        const question = this.engine.currentQuestions[this.currentQuestion];

        this.container.innerHTML = `
            <div class="game-screen multiple-choice-game">
                <div class="game-header">
                    <h2>🎯 Lovește Tabla Corectă</h2>
                    <div class="game-progress">
                        <span>Întrebarea ${this.currentQuestion + 1} din ${this.totalQuestions}</span>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${(this.currentQuestion / this.totalQuestions) * 100}%"></div>
                        </div>
                    </div>
                    <div class="game-score">
                        <span class="score-correct">✓ ${this.score.correct}</span>
                        <span class="score-wrong">✗ ${this.score.wrong}</span>
                    </div>
                </div>

                <div class="question-display">
                    <div class="question-text">
                        <span class="q-num">${question.num1}</span>
                        <span class="q-op">×</span>
                        <span class="q-num">${question.num2}</span>
                        <span class="q-eq">=</span>
                        <span class="q-mark">?</span>
                    </div>
                </div>

                <div class="answer-options">
                    ${question.options.map(option => `
                        <button class="answer-btn" data-answer="${option}">
                            ${option}
                        </button>
                    `).join('')}
                </div>

                <div class="feedback-area"></div>
            </div>
        `;

        this.setupAnswerButtons(question.correctAnswer);

        // Voice narration for question
        if (window.narrator) {
            setTimeout(() => narrator.speakQuestion(question.num1, question.num2), 300);
        }
    },

    setupAnswerButtons(correctAnswer) {
        const buttons = this.container.querySelectorAll('.answer-btn');
        const feedbackArea = this.container.querySelector('.feedback-area');

        buttons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const userAnswer = parseInt(e.target.dataset.answer);
                const isCorrect = userAnswer === correctAnswer;

                // Disable all buttons
                buttons.forEach(b => b.disabled = true);

                if (isCorrect) {
                    e.target.classList.add('correct');
                    feedbackArea.innerHTML = '<div class="feedback correct">🎉 Corect! Bravo!</div>';
                    this.score.correct++;

                    // Voice feedback
                    if (window.narrator) {
                        narrator.speakCorrect();
                    }
                } else {
                    e.target.classList.add('wrong');
                    buttons.forEach(b => {
                        if (parseInt(b.dataset.answer) === correctAnswer) {
                            b.classList.add('correct');
                        }
                    });
                    feedbackArea.innerHTML = `<div class="feedback wrong">😔 Răspunsul corect era ${correctAnswer}</div>`;
                    this.score.wrong++;

                    // Voice feedback
                    if (window.narrator) {
                        narrator.speakWrong(correctAnswer);
                    }
                }

                setTimeout(() => {
                    this.currentQuestion++;
                    this.showQuestion();
                }, 1500);
            });
        });
    },

    showResults() {
        this.score.time = this.engine.getElapsedTime();
        this.score.stars = this.engine.calculateStars(this.score.correct, this.totalQuestions);

        this.container.innerHTML = `
            <div class="game-results">
                <h2>🎊 Joc Terminat!</h2>
                
                <div class="stars-display">
                    ${this.renderStars(this.score.stars)}
                </div>

                <div class="results-stats">
                    <div class="result-stat">
                        <div class="stat-icon">✓</div>
                        <div class="stat-value">${this.score.correct}</div>
                        <div class="stat-label">Corecte</div>
                    </div>
                    <div class="result-stat">
                        <div class="stat-icon">✗</div>
                        <div class="stat-value">${this.score.wrong}</div>
                        <div class="stat-label">Greșite</div>
                    </div>
                    <div class="result-stat">
                        <div class="stat-icon">⏱️</div>
                        <div class="stat-value">${this.score.time}s</div>
                        <div class="stat-label">Timp</div>
                    </div>
                </div>

                <div class="results-message">
                    ${this.getEncouragementMessage()}
                </div>

                <button class="btn btn-primary" id="playAgain">Joacă Din Nou</button>
                <button class="btn btn-secondary" id="backToMenu">Înapoi la Meniu</button>
            </div>
        `;

        document.getElementById('playAgain').addEventListener('click', () => {
            this.start(this.container, this.callback);
        });

        document.getElementById('backToMenu').addEventListener('click', () => {
            document.getElementById('gameModal').classList.remove('active');
        });

        if (this.callback) {
            this.callback(this.score);
        }

        // Voice narration for results
        if (window.narrator) {
            setTimeout(() => narrator.speakGameEnd(this.score.correct, this.totalQuestions), 500);
        }
    },

    renderStars(count) {
        let html = '';
        for (let i = 0; i < 3; i++) {
            if (i < count) {
                html += '<span class="star filled">⭐</span>';
            } else {
                html += '<span class="star empty">☆</span>';
            }
        }
        return html;
    },

    getEncouragementMessage() {
        const percentage = (this.score.correct / this.totalQuestions) * 100;

        if (percentage === 100) {
            return '🏆 Perfect! Ești un campion absolut!';
        } else if (percentage >= 80) {
            return '🎉 Excelent! Ai făcut o treabă grozavă!';
        } else if (percentage >= 60) {
            return '👍 Bine lucrat! Continuă să exersezi!';
        } else if (percentage >= 40) {
            return '💪 Bun început! Mai exersează puțin!';
        } else {
            return '🌟 Nu renunța! Încearcă din nou!';
        }
    }
};

// Add CSS for Multiple Choice Game
const mcStyles = document.createElement('style');
mcStyles.textContent = `
    .multiple-choice-game {
        max-width: 700px;
        margin: 0 auto;
        padding: 2rem;
    }

    .game-header {
        text-align: center;
        margin-bottom: 3rem;
    }

    .game-header h2 {
        font-family: var(--font-display);
        font-size: 2rem;
        color: var(--primary);
        margin-bottom: 1rem;
    }

    .game-progress {
        margin: 1rem 0;
    }

    .progress-bar {
        width: 100%;
        height: 20px;
        background: var(--gray-200);
        border-radius: var(--radius-full);
        overflow: hidden;
        margin-top: 0.5rem;
    }

    .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, var(--primary), var(--secondary));
        transition: width 0.3s ease;
    }

    .game-score {
        display: flex;
        justify-content: center;
        gap: 2rem;
        margin-top: 1rem;
        font-size: 1.2rem;
        font-weight: 700;
    }

    .score-correct {
        color: var(--success-dark);
    }

    .score-wrong {
        color: var(--danger);
    }

    .question-display {
        background: linear-gradient(135deg, var(--info), var(--info-dark));
        padding: 3rem;
        border-radius: var(--radius-xl);
        margin-bottom: 2rem;
        box-shadow: var(--shadow-lg);
    }

    .question-text {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 1rem;
        font-size: 4rem;
        font-weight: 700;
        color: var(--white);
        font-family: var(--font-display);
    }

    .q-num {
        color: var(--warning);
    }

    .q-op {
        font-size: 3rem;
    }

    .q-mark {
        color: var(--warning);
        animation: pulse 1s ease-in-out infinite;
    }

    .answer-options {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1rem;
        margin-bottom: 2rem;
    }

    .answer-btn {
        padding: 2rem;
        font-size: 2.5rem;
        font-weight: 700;
        font-family: var(--font-display);
        background: linear-gradient(135deg, var(--secondary), var(--secondary-light));
        color: var(--white);
        border: 4px solid transparent;
        border-radius: var(--radius-lg);
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: var(--shadow-md);
    }

    .answer-btn:hover:not(:disabled) {
        transform: translateY(-5px) scale(1.05);
        box-shadow: var(--shadow-xl);
        border-color: var(--white);
    }

    .answer-btn:disabled {
        cursor: not-allowed;
    }

    .answer-btn.correct {
        background: linear-gradient(135deg, var(--success), var(--success-dark));
        animation: bounce 0.5s ease;
        border-color: var(--white);
    }

    .answer-btn.wrong {
        background: linear-gradient(135deg, var(--danger), var(--primary-dark));
        animation: shake 0.5s ease;
    }

    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }

    .feedback-area {
        min-height: 60px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .feedback {
        padding: 1rem 2rem;
        border-radius: var(--radius-lg);
        font-size: 1.5rem;
        font-weight: 700;
        animation: fadeIn 0.3s ease;
    }

    .feedback.correct {
        background: var(--success);
        color: var(--white);
    }

    .feedback.wrong {
        background: var(--danger);
        color: var(--white);
    }

    .game-results {
        text-align: center;
        padding: 2rem;
    }

    .game-results h2 {
        font-family: var(--font-display);
        font-size: 2.5rem;
        color: var(--primary);
        margin-bottom: 2rem;
    }

    .stars-display {
        font-size: 4rem;
        margin-bottom: 2rem;
    }

    .star {
        display: inline-block;
        margin: 0 0.5rem;
        animation: bounce 0.5s ease;
    }

    .star.filled {
        animation: bounce 0.5s ease, pulse 2s ease-in-out infinite;
    }

    .results-stats {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1.5rem;
        margin-bottom: 2rem;
    }

    .result-stat {
        background: var(--gray-50);
        padding: 1.5rem;
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-sm);
    }

    .result-stat .stat-icon {
        font-size: 2rem;
        margin-bottom: 0.5rem;
    }

    .result-stat .stat-value {
        font-size: 2.5rem;
        font-weight: 700;
        color: var(--primary);
        margin-bottom: 0.5rem;
    }

    .result-stat .stat-label {
        color: var(--gray-700);
        font-weight: 600;
    }

    .results-message {
        background: linear-gradient(135deg, var(--warning), var(--warning-dark));
        color: var(--gray-900);
        padding: 1.5rem;
        border-radius: var(--radius-lg);
        font-size: 1.5rem;
        font-weight: 700;
        margin-bottom: 2rem;
    }

    .btn-secondary {
        background: var(--gray-300);
        color: var(--gray-900);
        margin-left: 1rem;
    }

    @media (max-width: 768px) {
        .question-text {
            font-size: 3rem;
        }

        .answer-options {
            grid-template-columns: 1fr;
        }

        .results-stats {
            grid-template-columns: 1fr;
        }
    }
`;
document.head.appendChild(mcStyles);
