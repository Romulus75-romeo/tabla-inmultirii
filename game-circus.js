// ============================================
// Game: Circus - "Circul Numerelor"
// ============================================

window.CircusGame = {
    start(container, onComplete) {
        const engine = new GameEngine();
        engine.generateQuestions(10);
        let current = 0;
        const score = { correct: 0, wrong: 0, stars: 0, time: 0 };

        const showQuestion = () => {
            if (current >= 10) {
                score.time = engine.getElapsedTime();
                score.stars = engine.calculateStars(score.correct, 10);
                container.innerHTML = `
                    <div class="game-results">
                        <h2>🎪 Circul s-a Încheiat!</h2>
                        <div class="stars-display">${'⭐'.repeat(score.stars)}${'☆'.repeat(3 - score.stars)}</div>
                        <p>Scor: ${score.correct}/10 corecte</p>
                        <button class="btn btn-primary" onclick="window.CircusGame.start(this.closest('.modal-content').querySelector('#gameContainer'))">Din Nou</button>
                    </div>
                `;
                if (onComplete) onComplete(score);
                return;
            }

            const q = engine.currentQuestions[current];
            const animals = ['🐘', '🦁', '🐯', '🐻', '🦒', '🦓', '🐼', '🦘'];
            const animal = animals[Math.floor(Math.random() * animals.length)];

            container.innerHTML = `
                <div class="circus-game">
                    <h2>🎪 Circul Numerelor</h2>
                    <p class="question-text">Întrebarea ${current + 1}/10</p>
                    <div class="circus-question">
                        <p>Creează <strong>${q.num1}</strong> grupe cu câte <strong>${q.num2}</strong> ${animal}</p>
                        <p class="hint">Câte ${animal} sunt în total?</p>
                    </div>
                    <div class="circus-visual">
                        <div class="animal-container" id="animalContainer"></div>
                    </div>
                    <div class="answer-section">
                        <input type="number" id="circusAnswer" placeholder="?" class="circus-input">
                        <button class="btn btn-primary" id="checkCircus">Verifică</button>
                    </div>
                    <div class="feedback"></div>
                </div>
            `;

            // Show visual representation
            const animalContainer = document.getElementById('animalContainer');
            for (let g = 0; g < q.num1; g++) {
                const group = document.createElement('div');
                group.className = 'animal-group';
                for (let a = 0; a < q.num2; a++) {
                    const span = document.createElement('span');
                    span.textContent = animal;
                    span.className = 'animal';
                    group.appendChild(span);
                }
                animalContainer.appendChild(group);
            }

            document.getElementById('checkCircus').addEventListener('click', () => {
                const answer = parseInt(document.getElementById('circusAnswer').value);
                const feedback = container.querySelector('.feedback');

                if (answer === q.correctAnswer) {
                    score.correct++;
                    feedback.innerHTML = '<div class="correct">🎉 Corect!</div>';
                    setTimeout(() => {
                        current++;
                        showQuestion();
                    }, 1000);
                } else {
                    score.wrong++;
                    feedback.innerHTML = `<div class="wrong">✗ Încearcă din nou!</div>`;
                }
            });

            document.getElementById('circusAnswer').addEventListener('keypress', (e) => {
                if (e.key === 'Enter') document.getElementById('checkCircus').click();
            });
        };

        showQuestion();
    }
};

const circusStyles = document.createElement('style');
circusStyles.textContent = `
    .circus-game {
        padding: 2rem;
        text-align: center;
        max-width: 700px;
        margin: 0 auto;
    }

    .circus-game h2 {
        font-family: var(--font-display);
        font-size: 2.5rem;
        color: var(--primary);
        margin-bottom: 1rem;
    }

    .circus-question {
        background: linear-gradient(135deg, var(--warning), var(--warning-dark));
        padding: 2rem;
        border-radius: var(--radius-lg);
        margin: 2rem 0;
        font-size: 1.3rem;
        font-weight: 600;
    }

    .circus-question strong {
        color: var(--primary-dark);
        font-size: 1.8rem;
    }

    .hint {
        margin-top: 1rem;
        font-style: italic;
    }

    .animal-container {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 1.5rem;
        margin: 2rem 0;
        padding: 2rem;
        background: var(--gray-50);
        border-radius: var(--radius-lg);
    }

    .animal-group {
        display: flex;
        gap: 0.5rem;
        padding: 1rem;
        background: var(--white);
        border: 3px dashed var(--secondary);
        border-radius: var(--radius-md);
    }

    .animal {
        font-size: 2.5rem;
        animation: bounce 1s ease-in-out infinite;
        animation-delay: calc(var(--i) * 0.1s);
    }

    .circus-input {
        font-size: 2rem;
        padding: 1rem 2rem;
        border: 3px solid var(--secondary);
        border-radius: var(--radius-lg);
        text-align: center;
        width: 150px;
        margin-right: 1rem;
        font-weight: 700;
    }

    .circus-input:focus {
        outline: none;
        border-color: var(--primary);
    }
`;
document.head.appendChild(circusStyles);
