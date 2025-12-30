// ============================================
// Certificate Generator
// ============================================

window.CertificateGenerator = {
    generate(progress) {
        const container = document.getElementById('certificateContainer');
        const today = new Date().toLocaleDateString('ro-RO');

        container.innerHTML = `
            <div class="certificate">
                <div class="certificate-border">
                    <div class="certificate-content">
                        <div class="cert-header">
                            <h2>🏆 CERTIFICAT DE PERFORMANȚĂ 🏆</h2>
                            <div class="cert-subtitle">Tabla Înmulțirii</div>
                        </div>

                        <div class="cert-body">
                            <p class="cert-text">Acest certificat atestă că</p>
                            
                            <div class="cert-name-input">
                                <input type="text" id="studentName" placeholder="Numele elevului" class="name-input">
                            </div>

                            <p class="cert-text">a finalizat cu succes programul de învățare a tablei înmulțirii (1-10) și a demonstrat:</p>

                            <ul class="cert-achievements">
                                <li>✓ Stăpânirea tuturor celor 10 table de înmulțire</li>
                                <li>✓ ${progress.gamesPlayed} jocuri completate</li>
                                <li>✓ ${progress.correctAnswers} răspunsuri corecte</li>
                                <li>✓ ${progress.totalStars} stele acumulate</li>
                            </ul>

                            <div class="cert-badges">
                                <div class="badge-display">
                                    ${this.getBadgesHTML(progress)}
                                </div>
                            </div>
                        </div>

                        <div class="cert-footer">
                            <div class="cert-date">Data: ${today}</div>
                            <div class="cert-signature">
                                <div class="signature-line"></div>
                                <div class="signature-label">Rică Ratonul - Ghid Educațional</div>
                            </div>
                        </div>

                        <div class="cert-mascot">🦝</div>
                    </div>
                </div>

<button class="btn btn-primary cert-download" onclick="window.CertificateGenerator.downloadCertificate()">
                    📥 Descarcă Certificatul
                </button>
            </div>
        `;

        // Unlock certificate display
        container.classList.add('certificate-unlocked');
        this.showConfetti();
    },

    getBadgesHTML(progress) {
        const badges = ['🥉', '🥈', '🥇', '🏅', '🎖️', '🏆', '👑', '💎', '⭐', '🌟'];
        let html = '';

        for (let i = 0; i < 10; i++) {
            if (progress.tablesLearned.includes(i + 1)) {
                html += `<span class="cert-badge">${badges[i]}</span>`;
            }
        }

        return html;
    },

    downloadCertificate() {
        const studentName = document.getElementById('studentName').value || 'Elev Dedicat';
        alert(`Certificatul pentru ${studentName} este gata de printare!\n\nApasă Ctrl+P sau Cmd+P pentru a printa certificatul.`);
        window.print();
    },

    showConfetti() {
        const container = document.getElementById('confettiContainer');
        const colors = ['#FF6B6B', '#4ECDC4', '#95E1D3', '#FFE66D', '#A78BFA'];

        for (let i = 0; i < 100; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                confetti.style.left = Math.random() * 100 + '%';
                confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.animationDelay = Math.random() * 0.5 + 's';
                container.appendChild(confetti);

                setTimeout(() => confetti.remove(), 3000);
            }, i * 30);
        }
    }
};

const certificateStyles = document.createElement('style');
certificateStyles.textContent = `
    .certificate {
        padding: 2rem;
        text-align: center;
    }

    .certificate-border {
        border: 10px double var(--primary);
        padding: 3rem;
        background: linear-gradient(135deg, #FFF9E6, #FFFFFF);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-xl);
        position: relative;
        overflow: hidden;
    }

    .certificate-border::before {
        content: '';
        position: absolute;
        top: 20px;
        left: 20px;
        right: 20px;
        bottom: 20px;
        border: 2px solid var(--warning);
        border-radius: var(--radius-md);
        pointer-events: none;
    }

    .certificate-content {
        position: relative;
        z-index: 1;
    }

    .cert-header h2 {
        font-family: var(--font-display);
        font-size: 2.5rem;
        color: var(--primary);
        margin-bottom: 0.5rem;
    }

    .cert-subtitle {
        font-size: 1.3rem;
        color: var(--info);
        font-weight: 600;
        margin-bottom: 2rem;
    }

    .cert-text {
        font-size: 1.2rem;
        color: var(--gray-900);
        margin: 1rem 0;
    }

    .cert-name-input {
        margin: 2rem 0;
    }

    .name-input {
        font-family: 'Brush Script MT', cursive;
        font-size: 2.5rem;
        text-align: center;
        border: none;
        border-bottom: 3px solid var(--primary);
        background: transparent;
        padding: 0.5rem;
        min-width: 300px;
        color: var(--primary);
    }

    .name-input:focus {
        outline: none;
        border-bottom-color: var(--secondary);
    }

    .cert-achievements {
        list-style: none;
        padding: 0;
        margin: 2rem 0;
        text-align: left;
        max-width: 500px;
        margin-left: auto;
        margin-right: auto;
    }

    .cert-achievements li {
        padding: 0.5rem 0;
        font-size: 1.1rem;
        font-weight: 500;
    }

    .cert-badges {
        margin: 2rem 0;
    }

    .badge-display {
        display: flex;
        justify-content: center;
        gap: 0.5rem;
        flex-wrap: wrap;
    }

    .cert-badge {
        font-size: 2.5rem;
        animation: bounce 1s ease;
    }

    .cert-footer {
        margin-top: 3rem;
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
    }

    .cert-date {
        font-weight: 600;
        color: var(--gray-700);
    }

    .cert-signature {
        text-align: center;
    }

    .signature-line {
        width: 200px;
        height: 2px;
        background: var(--gray-900);
        margin-bottom: 0.5rem;
    }

    .signature-label {
        font-size: 0.9rem;
        color: var(--gray-700);
        font-style: italic;
    }

    .cert-mascot {
        position: absolute;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        font-size: 4rem;
        opacity: 0.2;
    }

    .cert-download {
        margin-top: 2rem;
        font-size: 1.2rem;
    }

    @media print {
        .cert-download, .modal-close, .parent-btn, .main-nav, .duel-setup {
            display: none !important;
        }

        .certificate-border {
            box-shadow: none;
        }

        body {
            background: white;
        }
    }

    @media (max-width: 768px) {
        .certificate-border {
            padding: 1.5rem;
        }

        .cert-header h2 {
            font-size: 1.8rem;
        }

        .name-input {
            min-width: 200px;
            font-size: 2rem;
        }

        .cert-footer {
            flex-direction: column;
            gap: 2rem;
        }
    }
`;
document.head.appendChild(certificateStyles);
