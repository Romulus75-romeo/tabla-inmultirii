// ============================================
// Game: Rocket - "Racheta Spațială"
// ============================================

window.RocketGame = {
    start(container, onComplete) {
        const engine = new GameEngine();
        engine.generateQuestions(10);
        let current = 0;
        let rocketHeight = 0;
        const score = { correct: 0, wrong: 0, stars: 0, time: 0 };

        const showQuestion = () => {
            if (current >= 10) {
                score.time = engine.getElapsedTime();
                score.stars = engine.calculateStars(score.correct, 10);
                container.innerHTML = `
                    <div class="game-results">
                        <h2>🚀 ${rocketHeight >= 90 ? 'Ai Ajuns pe Lună!' : 'Zbor Terminat!'}</h2>
                        <div class="stars-display">${'⭐'.repeat(score.stars)}${'☆'.repeat(3 - score.stars)}</div>
                        <p>Scor: ${score.correct}/10 | Înălțime: ${Math.round(rocketHeight)}%</p>
                        <button class="btn btn-primary" onclick="window.RocketGame.start(this.closest('.modal-content').querySelector('#gameContainer'))">Încearcă Din Nou</button>
                    </div>
                `;
                if (onComplete) onComplete(score);
                return;
            }

            const q = engine.currentQuestions[current];

            container.innerHTML = `
                <div class="rocket-game">
                    <h2>🚀 Racheta Spațială</h2>
                    <div class="space-scene">
                        <div class="stars-bg"></div>
                        <div class="moon">🌕</div>
                        <div class="rocket" style="bottom: ${rocketHeight}%">🚀</div>
                        <div class="ground">🏕️</div>
                    </div>
                    <div class="rocket-question">
                        <p>Întrebarea ${current + 1}/10</p>
                        <h3>${q.num1} × ${q.num2} = ?</h3>
                        <div class="rocket-options">
                            ${q.options.map(opt => `
                                <button class="rocket-opt" data-answer="${opt}">${opt}</button>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;

            document.querySelectorAll('.rocket-opt').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const answer = parseInt(e.target.dataset.answer);
                    document.querySelectorAll('.rocket-opt').forEach(b => b.disabled = true);

                    if (answer === q.correctAnswer) {
                        score.correct++;
                        e.target.style.background = '#95E1D3';
                        rocketHeight += 10;
                        setTimeout(() => {
                            current++;
                            showQuestion();
                        }, 800);
                    } else {
                        score.wrong++;
                        e.target.style.background = '#F94144';
                        setTimeout(() => {
                            current++;
                            showQuestion();
                        }, 1200);
                    }
                });
            });
        };

        showQuestion();
    }
};

const rocketStyles = document.createElement('style');
rocketStyles.textContent = `
    .rocket-game {
        padding: 2rem;
        max-width: 600px;
        margin: 0 auto;
    }

    .rocket-game h2 {
        font-family: var(--font-display);
        font-size: 2rem;
        color: var(--primary);
        text-align: center;
        margin-bottom: 1rem;
    }

    .space-scene {
        position: relative;
        height: 400px;
        background: linear-gradient(to bottom, #0a0e27 0%, #1a1f3a 50%, #2a3f5f 100%);
        border-radius: var(--radius-lg);
        overflow: hidden;
        margin-bottom: 2rem;
    }

    .stars-bg {
        position: absolute;
        width: 100%;
        height: 100%;
        background-image: 
            radial-gradient(2px 2px at 20% 30%, white, transparent),
            radial-gradient(2px 2px at 60% 70%, white, transparent),
            radial-gradient(1px 1px at 50% 50%, white, transparent),
            radial-gradient(1px 1px at 80% 10%, white, transparent),
            radial-gradient(2px 2px at 90% 60%, white, transparent);
        background-size: 200% 200%;
        animation: twinkle 3s ease-in-out infinite;
    }

    @keyframes twinkle {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
    }

    .moon {
        position: absolute;
        top: 20px;
        right: 30px;
        font-size: 4rem;
    }

    .rocket {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        font-size: 4rem;
        transition: bottom 0.8s ease;
    }

    .ground {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        font-size: 2rem;
        text-align: center;
        background: linear-gradient(to top, #2a3f5f, transparent);
        padding: 1rem;
    }

    .rocket-question {
        background: var(--white);
        padding: 2rem;
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-md);
        text-align: center;
    }

    .rocket-question h3 {
        font-size: 2.5rem;
        color: var(--primary);
        margin: 1.5rem 0;
    }

    .rocket-options {
        display: flex;
        justify-content: center;
        gap: 1rem;
    }

    .rocket-opt {
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

    .rocket-opt:hover:not(:disabled) {
        transform: scale(1.1);
    }

    .rocket-opt:disabled {
        cursor: not-allowed;
        opacity: 0.7;
    }
`;
document.head.appendChild(rocketStyles);
