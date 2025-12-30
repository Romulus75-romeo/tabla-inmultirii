// ============================================
// Daily Training Mode - Antrenament Zilnic
// ============================================

class DailyTraining {
    constructor() {
        this.questionsPerDay = 10;
        this.loadProgress();
    }

    loadProgress() {
        const saved = localStorage.getItem('dailyTraining');
        if (saved) {
            this.data = JSON.parse(saved);
        } else {
            this.data = {
                streak: 0,
                lastDate: null,
                totalDaysCompleted: 0,
                history: []
            };
        }

        this.checkStreak();
    }

    saveProgress() {
        localStorage.setItem('dailyTraining', JSON.stringify(this.data));
    }

    checkStreak() {
        const today = new Date().toDateString();
        const lastDate = this.data.lastDate ? new Date(this.data.lastDate).toDateString() : null;

        if (lastDate === today) {
            // Already completed today
            return;
        }

        if (lastDate) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toDateString();

            if (lastDate !== yesterdayStr) {
                // Streak broken
                this.data.streak = 0;
            }
        }
    }

    hasCompletedToday() {
        const today = new Date().toDateString();
        return this.data.lastDate === today;
    }

    start(container, onComplete) {
        this.container = container;
        this.callback = onComplete;
        this.currentQuestion = 0;
        this.score = { correct: 0, wrong: 0 };
        this.engine = new GameEngine();

        // Generate 10 random questions from learned tables
        const learnedTables = JSON.parse(localStorage.getItem('multiplicationProgress') || '{}').tablesLearned || [];
        const maxTable = Math.max(...learnedTables, 2);
        this.engine.generateQuestions(this.questionsPerDay, 1, maxTable);

        this.showQuestion();
    }

    showQuestion() {
        if (this.currentQuestion >= this.questionsPerDay) {
            this.showResults();
            return;
        }

        const question = this.engine.currentQuestions[this.currentQuestion];
        const progress = ((this.currentQuestion / this.questionsPerDay) * 100).toFixed(0);

        this.container.innerHTML = `
            <div class="daily-training-container">
                <div class="daily-header">
                    <h2>🏋️ Antrenament Zilnic</h2>
                    <div class="daily-streak">
                        🔥 Streak: ${this.data.streak} zile
                        ${this.data.streak >= 3 ? '<span class="streak-bonus">🌟</span>' : ''}
                    </div>
                </div>

                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progress}%"></div>
                    <div class="progress-text">${this.currentQuestion + 1} / ${this.questionsPerDay}</div>
                </div>

                <div class="question-card">
                    <h3 class="question-label">Întrebarea ${this.currentQuestion + 1}</h3>
                    <div class="question-display">
                        <span class="question-num">${question.num1}</span>
                        <span class="question-op">×</span>
                        <span class="question-num">${question.num2}</span>
                        <span class="question-eq">=</span>
                        <input type="number" id="dailyAnswer" class="answer-input" autofocus>
                    </div>
                    <div class="feedback-area" id="dailyFeedback"></div>
                    <button class="btn btn-primary btn-large" id="submitDaily">Verifică ✓</button>
                </div>

                <div class="daily-stats">
                    <div class="stat">✅ Corecte: ${this.score.correct}</div>
                    <div class="stat">❌ Greșite: ${this.score.wrong}</div>
                </div>
            </div>
        `;

        // Voice narration
        if (window.narrator) {
            setTimeout(() => narrator.speakQuestion(question.num1, question.num2), 300);
        }

        this.setupAnswerInput(question.correctAnswer);
    }

    setupAnswerInput(correctAnswer) {
        const input = document.getElementById('dailyAnswer');
        const submitBtn = document.getElementById('submitDaily');
        const feedback = document.getElementById('dailyFeedback');

        const checkAnswer = () => {
            const userAnswer = parseInt(input.value);
            if (isNaN(userAnswer)) return;

            const isCorrect = userAnswer === correctAnswer;
            submitBtn.disabled = true;
            input.disabled = true;

            if (isCorrect) {
                feedback.innerHTML = '<div class="feedback correct">🎉 Excelent!</div>';
                this.score.correct++;
                if (window.narrator) narrator.speakCorrect();
            } else {
                feedback.innerHTML = `<div class="feedback wrong">Răspunsul corect: ${correctAnswer}</div>`;
                this.score.wrong++;
                if (window.narrator) narrator.speakWrong(correctAnswer);
            }

            setTimeout(() => {
                this.currentQuestion++;
                this.showQuestion();
            }, 1500);
        };

        submitBtn.addEventListener('click', checkAnswer);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') checkAnswer();
        });
    }

    showResults() {
        const percentage = (this.score.correct / this.questionsPerDay) * 100;
        const today = new Date().toDateString();

        // Update streak
        this.data.streak++;
        this.data.lastDate = today;
        this.data.totalDaysCompleted++;
        this.data.history.push({
            date: today,
            correct: this.score.correct,
            wrong: this.score.wrong
        });

        // Keep only last 30 days
        if (this.data.history.length > 30) {
            this.data.history = this.data.history.slice(-30);
        }

        this.saveProgress();

        let message = '';
        let emoji = '';
        if (percentage === 100) {
            message = 'Perfect! Zi extraordinară!';
            emoji = '🏆';
        } else if (percentage >= 80) {
            message = 'Foarte bine! Continuă așa!';
            emoji = '🌟';
        } else if (percentage >= 60) {
            message = 'Bine! Mai exersează puțin!';
            emoji = '👍';
        } else {
            message = 'Hai să mai exersăm!';
            emoji = '💪';
        }

        this.container.innerHTML = `
            <div class="daily-results">
                <div class="results-emoji">${emoji}</div>
                <h2>Antrenament Completat!</h2>
                <p class="results-message">${message}</p>

                <div class="results-stats">
                    <div class="stat-big">
                        <div class="stat-value">${this.score.correct}</div>
                        <div class="stat-label">Răspunsuri Corecte</div>
                    </div>
                    <div class="stat-big">
                        <div class="stat-value">${Math.round(percentage)}%</div>
                        <div class="stat-label">Acuratețe</div>
                    </div>
                </div>

                <div class="streak-display">
                    <h3>🔥 Streak Actual: ${this.data.streak} zile</h3>
                    ${this.data.streak >= 7 ? '<p class="streak-milestone">🎊 O săptămână completă!</p>' : ''}
                    ${this.data.streak >= 30 ? '<p class="streak-milestone">🏅 O lună completă!</p>' : ''}
                </div>

                <button class="btn btn-primary btn-large" id="closeDaily">Închide</button>
            </div>
        `;

        document.getElementById('closeDaily').addEventListener('click', () => {
            if (this.callback) {
                this.callback({ correct: this.score.correct, wrong: this.score.wrong });
            }
        });

        // Voice narration
        if (window.narrator) {
            setTimeout(() => narrator.speakGameEnd(this.score.correct, this.questionsPerDay), 500);
        }
    }

    getStreakInfo() {
        return {
            streak: this.data.streak,
            completedToday: this.hasCompletedToday(),
            totalDays: this.data.totalDaysCompleted
        };
    }
}

// Initialize
window.dailyTraining = new DailyTraining();

// CSS Styles
const dailyStyles = document.createElement('style');
dailyStyles.textContent = `
    .daily-training-container {
        max-width: 600px;
        margin: 0 auto;
        padding: 2rem;
    }

    .daily-header {
        text-align: center;
        margin-bottom: 2rem;
    }

    .daily-header h2 {
        margin: 0;
        color: var(--primary);
        font-size: 2rem;
    }

    .daily-streak {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--warning);
        margin-top: 1rem;
    }

    .streak-bonus {
        display: inline-block;
        animation: pulse 1s infinite;
    }

    .progress-bar {
        height: 40px;
        background: var(--gray-200);
        border-radius: var(--radius-lg);
        position: relative;
        overflow: hidden;
        margin-bottom: 2rem;
    }

    .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, var(--success), var(--info));
        transition: width 0.5s ease;
    }

    .progress-text {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-weight: 700;
        color: var(--gray-900);
    }

    .question-card {
        background: var(--white);
        padding: 3rem 2rem;
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-lg);
        margin-bottom: 2rem;
        text-align: center;
    }

    .question-label {
        color: var(--gray-700);
        margin-bottom: 2rem;
    }

    .question-display {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        font-size: 3rem;
        font-weight: 700;
        margin-bottom: 2rem;
    }

    .question-num {
        color: var(--primary);
    }

    .question-op {
        color: var(--secondary);
    }

    .answer-input {
        width: 120px;
        height: 80px;
        font-size: 2.5rem;
        text-align: center;
        border: 3px solid var(--info);
        border-radius: var(--radius-md);
        font-weight: 700;
    }

    .answer-input:focus {
        outline: none;
        border-color: var(--primary);
        box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.2);
    }

    .daily-stats {
        display: flex;
        justify-content: space-around;
        gap: 2rem;
    }

    .daily-stats .stat {
        font-size: 1.2rem;
        font-weight: 600;
    }

    .daily-results {
        text-align: center;
        padding: 2rem;
        max-width: 600px;
        margin: 0 auto;
    }

    .results-emoji {
        font-size: 6rem;
        margin-bottom: 1rem;
    }

    .results-message {
        font-size: 1.5rem;
        color: var(--gray-700);
        margin: 1rem 0 2rem 0;
    }

    .results-stats {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 2rem;
        margin: 2rem 0;
    }

    .stat-big {
        background: var(--gray-50);
        padding: 2rem;
        border-radius: var(--radius-lg);
    }

    .stat-big .stat-value {
        font-size: 3rem;
        font-weight: 700;
        color: var(--primary);
    }

    .stat-big .stat-label {
        font-size: 1rem;
        color: var(--gray-700);
        margin-top: 0.5rem;
    }

    .streak-display {
        background: linear-gradient(135deg, var(--warning), var(--warning-dark));
        color: var(--white);
        padding: 2rem;
        border-radius: var(--radius-lg);
        margin: 2rem 0;
    }

    .streak-display h3 {
        margin: 0;
        font-size: 2rem;
    }

    .streak-milestone {
        font-size: 1.2rem;
        margin-top: 1rem;
        font-weight: 600;
    }

    .btn-large {
        padding: 1.5rem 3rem;
        font-size: 1.3rem;
    }

    @media (max-width: 768px) {
        .question-display {
            font-size: 2rem;
        }

        .answer-input {
            width: 80px;
            height: 60px;
            font-size: 1.8rem;
        }
    }
`;
document.head.appendChild(dailyStyles);
