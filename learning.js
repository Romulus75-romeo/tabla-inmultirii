// ============================================
// Learning Module - Interactive Table Learning
// ============================================

window.LearningModule = {
    currentTable: null,
    progress: null,
    onComplete: null,

    showTable(tableNumber, progress, onCompleteCallback) {
        this.currentTable = tableNumber;
        this.progress = progress;
        this.onComplete = onCompleteCallback;

        const container = document.getElementById('learningContainer');
        container.innerHTML = this.createLearningContent(tableNumber);

        this.setupInteractions();

        // Voice narration
        if (window.narrator) {
            setTimeout(() => narrator.speakTableIntro(tableNumber), 500);
        }
    },

    createLearningContent(num) {
        let html = `
            <div class="learning-content">
                <h2 class="learning-title">📚 Tabla lui ${num}</h2>
                <p class="learning-intro">Hai să învățăm tabla lui ${num} într-un mod distractiv!</p>
                
                <div class="visual-explanation">
                    <h3>Ce înseamnă înmulțirea?</h3>
                    <p>Înmulțirea înseamnă să adunăm același număr de mai multe ori.</p>
                    <p>De exemplu: <strong>${num} × 3</strong> = ${num} + ${num} + ${num} = ${num * 3}</p>
                </div>

                <div class="table-visualization">
        `;

        // Create visual representations for each multiplication
        for (let i = 1; i <= 10; i++) {
            const result = num * i;
            html += `
                <div class="table-row" data-num="${num}" data-mult="${i}" data-result="${result}">
                    <button class="speak-row-btn" onclick="window.LearningModule.speakRow(${num}, ${i}, ${result})" title="Ascultă explicația">🔊</button>
                    <div class="equation">
                        <span class="number">${num}</span>
                        <span class="operator">×</span>
                        <span class="number">${i}</span>
                        <span class="equals">=</span>
                        <span class="result">${result}</span>
                    </div>
                    <div class="visual-groups">
                        ${this.createVisualGroups(num, i)}
                    </div>
                </div>
            `;
        }

        html += `
                </div>

                <div class="mini-quiz">
                    <h3>🎯 Mini Test</h3>
                    <p>Acum să testăm ce ai învățat!</p>
                    <div id="miniQuizContainer"></div>
                </div>

                <button class="btn btn-primary" id="completeLearning">
                    Am învățat tabla lui ${num}! ✓
                </button>
                
                <div class="worksheet-buttons">
                    <h3 style="margin-top: 2rem;">📄 Descarcă Fișe de Lucru:</h3>
                    <div class="worksheet-grid">
                        <button class="btn btn-secondary" onclick="window.worksheetGenerator.printWorksheet(${num}, 'practice', false)">
                            📝 Fișă Goală
                        </button>
                        <button class="btn btn-success" onclick="window.worksheetGenerator.printWorksheet(${num}, 'practice', true)">
                            ✅ Fișă cu Răspunsuri
                        </button>
                        <button class="btn btn-warning" onclick="window.worksheetGenerator.printWorksheet(${num}, 'test', false)">
                            🎯 Test (20 exerciții)
                        </button>
                    </div>
                </div>
            </div>
        `;

        return html;
    },

    createVisualGroups(num, times) {
        const objects = ['🍎', '⚽', '🎁', '⭐', '🍬', '🚗', '🎈', '🏀', '🎵', '🌸'];
        const selectedObject = objects[num % objects.length];

        let html = '';
        for (let group = 0; group < times; group++) {
            html += '<div class="group">';
            for (let item = 0; item < num; item++) {
                html += `<span class="visual-object">${selectedObject}</span>`;
            }
            html += '</div>';
        }

        return html;
    },

    speakRow(num, multiplier, result) {
        if (window.narrator) {
            narrator.speakTableRow(num, multiplier, result);
        }
    },

    setupInteractions() {
        // Start mini quiz
        this.startMiniQuiz();

        // Complete button
        const completeBtn = document.getElementById('completeLearning');
        if (completeBtn) {
            completeBtn.addEventListener('click', () => {
                // Speak completion message
                if (window.narrator) {
                    narrator.speakTableComplete(this.currentTable);
                }

                if (this.onComplete) {
                    this.onComplete();
                }

                setTimeout(() => {
                    document.getElementById('learningModal').classList.remove('active');
                }, 500);
            });
        }
    },

    startMiniQuiz() {
        const container = document.getElementById('miniQuizContainer');
        if (!container) return;

        const questions = [];
        for (let i = 0; i < 3; i++) {
            const multiplier = Math.floor(Math.random() * 10) + 1;
            questions.push({
                question: `${this.currentTable} × ${multiplier}`,
                answer: this.currentTable * multiplier
            });
        }

        let currentQ = 0;
        let correct = 0;

        const showQuestion = () => {
            if (currentQ >= questions.length) {
                container.innerHTML = `
                    <div class="quiz-result">
                        <h4>Felicitări! 🎉</h4>
                        <p>Ai răspuns corect la ${correct} din ${questions.length} întrebări!</p>
                    </div>
                `;
                return;
            }

            const q = questions[currentQ];
            const wrongAnswers = [q.answer + 3, q.answer - 2];
            const allOptions = [q.answer, ...wrongAnswers].sort(() => Math.random() - 0.5);

            container.innerHTML = `
                <div class="quiz-question">
                    <h4>Întrebarea ${currentQ + 1} din ${questions.length}</h4>
                    <p class="question-text">${q.question} = ?</p>
                    <div class="quiz-options">
                        ${allOptions.map(opt => `
                            <button class="quiz-option" data-answer="${opt}">${opt}</button>
                        `).join('')}
                    </div>
                    <div class="quiz-feedback"></div>
                </div>
            `;

            container.querySelectorAll('.quiz-option').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const userAnswer = parseInt(e.target.dataset.answer);
                    const isCorrect = userAnswer === q.answer;

                    if (isCorrect) {
                        correct++;
                        e.target.style.background = '#95E1D3';
                        container.querySelector('.quiz-feedback').innerHTML = '✓ Corect!';
                    } else {
                        e.target.style.background = '#F94144';
                        container.querySelector('.quiz-feedback').innerHTML = `✗ Răspunsul corect este ${q.answer}`;
                    }

                    container.querySelectorAll('.quiz-option').forEach(b => b.disabled = true);

                    setTimeout(() => {
                        currentQ++;
                        showQuestion();
                    }, 1500);
                });
            });
        };

        showQuestion();
    }
};

// Add CSS for learning content
const learningStyles = document.createElement('style');
learningStyles.textContent = `
    .learning-content {
        max-width: 800px;
        margin: 0 auto;
    }

    .learning-title {
        font-family: var(--font-display);
        font-size: 2rem;
        color: var(--primary);
        text-align: center;
        margin-bottom: 1rem;
    }

    .learning-intro {
        text-align: center;
        font-size: 1.1rem;
        margin-bottom: 2rem;
        color: var(--gray-700);
    }

    .visual-explanation {
        background: var(--info);
        color: var(--white);
        padding: 1.5rem;
        border-radius: var(--radius-lg);
        margin-bottom: 2rem;
        text-align: center;
    }

    .visual-explanation h3 {
        margin-bottom: 1rem;
        font-size: 1.3rem;
    }

    .table-visualization {
        margin-bottom: 2rem;
    }

    .table-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1rem;
        background: var(--gray-50);
        border-radius: var(--radius-md);
        margin-bottom: 0.5rem;
        gap: 1rem;
        position: relative;
    }

    .speak-row-btn {
        background: linear-gradient(135deg, var(--info), var(--info-dark));
        color: var(--white);
        border: none;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 1.2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        box-shadow: var(--shadow-sm);
    }

    .speak-row-btn:hover {
        transform: scale(1.1);
        box-shadow: var(--shadow-md);
    }

    .speak-row-btn:active {
        transform: scale(0.95);
    }

    .equation {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 1.5rem;
        font-weight: 700;
        min-width: 150px;
    }

    .number {
        color: var(--primary);
    }

    .operator {
        color: var(--secondary);
    }

    .result {
        color: var(--info);
        font-size: 1.8rem;
    }

    .visual-groups {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
    }

    .group {
        display: flex;
        gap: 0.25rem;
        padding: 0.25rem;
        background: var(--white);
        border-radius: var(--radius-sm);
    }

    .visual-object {
        font-size: 1.2rem;
    }

    .mini-quiz {
        background: var(--warning);
        padding: 2rem;
        border-radius: var(--radius-lg);
        margin-bottom: 2rem;
    }

    .mini-quiz h3 {
        margin-bottom: 1rem;
        font-size: 1.5rem;
    }

    .quiz-question {
        background: var(--white);
        padding: 1.5rem;
        border-radius: var(--radius-md);
        margin-top: 1rem;
    }

    .question-text {
        font-size: 2rem;
        font-weight: 700;
        text-align: center;
        color: var(--primary);
        margin: 1.5rem 0;
    }

    .quiz-options {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
        gap: 1rem;
        margin-bottom: 1rem;
    }

    .quiz-option {
        padding: 1.5rem;
        font-size: 1.5rem;
        font-weight: 700;
        background: var(--secondary);
        color: var(--white);
        border: none;
        border-radius: var(--radius-md);
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .quiz-option:hover:not(:disabled) {
        transform: scale(1.1);
        box-shadow: var(--shadow-md);
    }

    .quiz-option:disabled {
        cursor: not-allowed;
    }

    .quiz-feedback {
        text-align: center;
        font-size: 1.2rem;
        font-weight: 700;
        margin-top: 1rem;
        min-height: 30px;
    }

    .quiz-result {
        background: var(--success);
        padding: 2rem;
        border-radius: var(--radius-lg);
        text-align: center;
        color: var(--white);
    }

    .quiz-result h4 {
        font-size: 2rem;
        margin-bottom: 1rem;
    }

    #completeLearning {
        display: block;
        margin: 2rem auto;
        font-size: 1.2rem;
        padding: 1rem 2rem;
    }

    .worksheet-buttons {
        margin-top: 2rem;
        padding: 2rem;
        background: var(--gray-50);
        border-radius: var(--radius-lg);
        text-align: center;
    }

    .worksheet-buttons h3 {
        margin-bottom: 1rem;
        color: var(--gray-900);
    }

    .worksheet-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        margin-top: 1rem;
    }

    .worksheet-grid .btn {
        width: 100%;
        font-size: 1rem;
        padding: 1rem;
    }

    @media (max-width: 768px) {
        .table-row {
            flex-direction: column;
            text-align: center;
        }

        .visual-groups {
            justify-content: center;
        }

        .equation {
            justify-content: center;
        }
    }
`;
document.head.appendChild(learningStyles);
