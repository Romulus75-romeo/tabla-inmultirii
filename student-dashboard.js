// ============================================
// Student Dashboard - Tablou de Campion pentru Elevi
// ============================================

class StudentDashboard {
    constructor() {
        this.progress = null;
    }

    show() {
        this.progress = JSON.parse(localStorage.getItem('multiplicationProgress')) || this.getDefaultProgress();

        // Get or create modal
        let modal = document.getElementById('studentDashboardModal');
        if (!modal) {
            this.createModal();
            modal = document.getElementById('studentDashboardModal');
        }

        // Update content
        this.updateContent();

        // FORCE display using styles - bypass CSS classes issues
        modal.style.display = 'flex';
        modal.style.opacity = '1';
        modal.classList.add('active');

        console.log('Dashboard modal opened - display:', modal.style.display);
    }

    getDefaultProgress() {
        return {
            learnedTables: [],
            badges: [],
            totalStars: 0,
            gamesPlayed: 0,
            lastActivity: null,
            correctAnswers: 0,
            wrongAnswers: 0
        };
    }

    createModal() {
        const modal = document.createElement('div');
        modal.id = 'studentDashboardModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content student-dashboard-content">
                <button class="modal-close" onclick="document.getElementById('studentDashboardModal').classList.remove('active')">✖️</button>
                <div id="studentDashboardContent"></div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    updateContent() {
        const container = document.getElementById('studentDashboardContent');
        const stats = this.calculateStats();

        container.innerHTML = `
            <div class="student-dashboard">
                <div class="dashboard-header">
                    <h1>🎉 Tabloul Tău de Campion!</h1>
                    <p class="welcome-message">Bine ai venit, ${this.getStudentName()}!</p>
                </div>

                <div class="progress-overview">
                    <h2>📊 Progresul Tău</h2>
                    <div class="progress-card">
                        <div class="progress-circle">
                            <svg viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="45" fill="none" stroke="#E5E7EB" stroke-width="10"/>
                                <circle cx="50" cy="50" r="45" fill="none" stroke="#4ECDC4" stroke-width="10"
                                    stroke-dasharray="${stats.progressPercent * 2.827} 282.7"
                                    transform="rotate(-90 50 50)"/>
                            </svg>
                            <div class="progress-text">
                                <span class="progress-number">${stats.learnedCount}/10</span>
                                <span class="progress-label">Table</span>
                            </div>
                        </div>
                        <div class="progress-bar-container">
                            <div class="progress-bar-fill" style="width: ${stats.progressPercent}%"></div>
                        </div>
                        <p class="progress-message">${this.getProgressMessage(stats.learnedCount)}</p>
                    </div>
                </div>

                <div class="stats-grid">
                    <div class="stat-card stars">
                        <div class="stat-icon">⭐</div>
                        <div class="stat-value">${stats.totalStars}</div>
                        <div class="stat-label">Stele Totale</div>
                    </div>
                    
                    <div class="stat-card badges">
                        <div class="stat-icon">🏅</div>
                        <div class="stat-value">${stats.badgeCount}/15</div>
                        <div class="stat-label">Badge-uri</div>
                    </div>
                    
                    <div class="stat-card games">
                        <div class="stat-icon">🎮</div>
                        <div class="stat-value">${stats.gamesPlayed}</div>
                        <div class="stat-label">Jocuri Jucate</div>
                    </div>
                    
                    <div class="stat-card streak">
                        <div class="stat-icon">🔥</div>
                        <div class="stat-value">${stats.streak}</div>
                        <div class="stat-label">Zile Consecutive</div>
                    </div>
                </div>

                ${this.renderBadges()}

                ${this.renderFavoriteTable(stats)}

                ${this.renderNextChallenge(stats)}

                <div class="dashboard-actions">
                    <button class="btn btn-primary btn-large" onclick="document.getElementById('studentDashboardModal').classList.remove('active'); showTab('learn')">
                        🚀 Hai să Învățăm!
                    </button>
                    <button class="btn btn-secondary" onclick="document.getElementById('studentDashboardModal').classList.remove('active'); showTab('games')">
                        🎮 Hai să Jucăm!
                    </button>
                </div>
            </div>
        `;
    }

    calculateStats() {
        const learnedCount = this.progress.learnedTables.length;
        const progressPercent = (learnedCount / 10) * 100;
        const badgeCount = this.progress.badges.length;
        const totalStars = this.progress.totalStars || 0;
        const gamesPlayed = this.progress.gamesPlayed || 0;
        const streak = this.calculateStreak();

        return {
            learnedCount,
            progressPercent,
            badgeCount,
            totalStars,
            gamesPlayed,
            streak
        };
    }

    calculateStreak() {
        // Simple streak calculation based on last activity
        const lastActivity = this.progress.lastActivity;
        if (!lastActivity) return 0;

        const today = new Date().toDateString();
        const lastDate = new Date(lastActivity).toDateString();

        return today === lastDate ? (this.progress.streak || 1) : 0;
    }

    getProgressMessage(learnedCount) {
        if (learnedCount === 0) {
            return "Hai să începem aventura! 🚀";
        } else if (learnedCount < 5) {
            return `Super început! Mai ${10 - learnedCount} table! 💪`;
        } else if (learnedCount < 10) {
            return `Ești aproape campion! Încă ${10 - learnedCount}! 🏆`;
        } else {
            return "🎊 CAMPION ABSOLUT! Ai învățat toate tablele!";
        }
    }

    getStudentName() {
        const selectedAvatar = localStorage.getItem('selectedAvatar') || '🦝';
        const avatarNames = {
            '🦝': 'Campionule',
            '🐰': 'Iepurașule',
            '🤖': 'Robotelule',
            '🦊': 'Vulpițo',
            '🐻': 'Urșuletule',
            '🐼': 'Panda',
            '🦁': 'Leoaicule',
            '🐯': 'Tigrule'
        };
        return avatarNames[selectedAvatar] || 'Campionule';
    }

    renderBadges() {
        const unlockedBadges = this.progress.badges || [];
        const allBadges = [
            { id: 'table-1', name: 'Tabla lui 1', emoji: '1️⃣' },
            { id: 'table-2', name: 'Tabla lui 2', emoji: '2️⃣' },
            { id: 'table-3', name: 'Tabla lui 3', emoji: '3️⃣' },
            { id: 'table-4', name: 'Tabla lui 4', emoji: '4️⃣' },
            { id: 'table-5', name: 'Tabla lui 5', emoji: '5️⃣' },
            { id: 'table-6', name: 'Tabla lui 6', emoji: '6️⃣' },
            { id: 'table-7', name: 'Tabla lui 7', emoji: '7️⃣' },
            { id: 'table-8', name: 'Tabla lui 8', emoji: '8️⃣' },
            { id: 'table-9', name: 'Tabla lui 9', emoji: '9️⃣' },
            { id: 'table-10', name: 'Tabla lui 10', emoji: '🔟' },
            { id: 'all-tables', name: 'Toate Tablele', emoji: '👑' },
            { id: 'first-game', name: 'Primul Joc', emoji: '🎮' },
            { id: 'perfectionist', name: 'Perfectionist', emoji: '💯' },
            { id: 'speed-demon', name: 'Vitezoman', emoji: '⚡' },
            { id: 'persistent', name: 'Stăruitor', emoji: '🔥' }
        ];

        const badgesHTML = allBadges.map(badge => {
            const unlocked = unlockedBadges.includes(badge.id);
            return `
                <div class="badge-item ${unlocked ? 'unlocked' : 'locked'}">
                    <div class="badge-emoji">${badge.emoji}</div>
                    <div class="badge-name">${badge.name}</div>
                </div>
            `;
        }).join('');

        return `
            <div class="badges-section">
                <h2>🏅 Badge-urile Tale</h2>
                <div class="badges-grid">
                    ${badgesHTML}
                </div>
            </div>
        `;
    }

    renderFavoriteTable(stats) {
        if (stats.learnedCount === 0) {
            return `
                <div class="favorite-table">
                    <h2>❤️ Tabla Ta Preferată</h2>
                    <p class="no-data">Învață prima tablă pentru a-ți descoperi preferata!</p>
                </div>
            `;
        }

        // Find table with most stars (simplified - în realitate ar trebui să grupăm pe table)
        const favoriteTable = this.progress.learnedTables[0] || 2;

        return `
            <div class="favorite-table">
                <h2>❤️ Tabla Ta Preferată</h2>
                <div class="favorite-card">
                    <div class="favorite-number">${favoriteTable}</div>
                    <p>Ești super la tabla lui ${favoriteTable}!</p>
                    <div class="favorite-stars">⭐⭐⭐</div>
                </div>
            </div>
        `;
    }

    renderNextChallenge(stats) {
        let nextTable = null;
        for (let i = 1; i <= 10; i++) {
            if (!this.progress.learnedTables.includes(i)) {
                nextTable = i;
                break;
            }
        }

        if (!nextTable) {
            return `
                <div class="next-challenge">
                    <h2>🎯 Următoarea Provocare</h2>
                    <div class="challenge-card completed">
                        <div class="challenge-icon">🏆</div>
                        <p>Felicitări! Ai completat toate tablele!</p>
                        <p class="challenge-subtitle">Continuă să exersezi cu jocurile!</p>
                    </div>
                </div>
            `;
        }

        return `
            <div class="next-challenge">
                <h2>🎯 Următoarea Provocare</h2>
                <div class="challenge-card">
                    <div class="challenge-icon">📚</div>
                    <p class="challenge-title">Tabla lui ${nextTable}</p>
                    <p class="challenge-subtitle">Gata să înveți?</p>
                    <button class="btn btn-accent" onclick="document.getElementById('studentDashboardModal').classList.remove('active'); showTab('learn'); setTimeout(() => window.LearningModule.showTable(${nextTable}, window.progress, () => window.progress.markTableLearned(${nextTable})), 100)">
                        🚀 Începe Acum!
                    </button>
                </div>
            </div>
        `;
    }
}

// Initialize
window.studentDashboard = new StudentDashboard();

// Add CSS
const studentDashboardStyles = document.createElement('style');
studentDashboardStyles.textContent = `
    .student-dashboard-content {
        max-width: 900px;
        max-height: 90vh;
        overflow-y: auto;
    }

    .student-dashboard {
        padding: 1rem;
    }

    .dashboard-header {
        text-align: center;
        margin-bottom: 2rem;
    }

    .dashboard-header h1 {
        font-family: var(--font-display);
        font-size: 2.5rem;
        color: var(--primary);
        margin-bottom: 0.5rem;
        animation: bounce 0.6s ease;
    }

    .welcome-message {
        font-size: 1.3rem;
        color: var(--gray-700);
        font-weight: 600;
    }

    .progress-overview h2,
    .badges-section h2,
    .favorite-table h2,
    .next-challenge h2 {
        font-size: 1.5rem;
        color: var(--gray-900);
        margin-bottom: 1rem;
        font-weight: 700;
    }

    .progress-card {
        background: linear-gradient(135deg, var(--info), var(--info-dark));
        color: var(--white);
        padding: 2rem;
        border-radius: var(--radius-xl);
        text-align: center;
        box-shadow: var(--shadow-lg);
        margin-bottom: 2rem;
    }

    .progress-circle {
        position: relative;
        width: 120px;
        height: 120px;
        margin: 0 auto 1rem;
    }

    .progress-circle svg {
        width: 100%;
        height: 100%;
        transform: rotate(-90deg);
    }

    .progress-text {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
    }

    .progress-number {
        display: block;
        font-size: 2rem;
        font-weight: 700;
        font-family: var(--font-display);
    }

    .progress-label {
        font-size: 0.9rem;
    }

    .progress-bar-container {
        background: rgba(255, 255, 255, 0.3);
        height: 10px;
        border-radius: var(--radius-full);
        overflow: hidden;
        margin-bottom: 1rem;
    }

    .progress-bar-fill {
        height: 100%;
        background: var(--white);
        border-radius: var(--radius-full);
        transition: width 0.5s ease;
    }

    .progress-message {
        font-size: 1.2rem;
        font-weight: 600;
        margin: 0;
    }

    .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 1rem;
        margin-bottom: 2rem;
    }

    .stat-card {
        background: var(--white);
        padding: 1.5rem;
        border-radius: var(--radius-lg);
        text-align: center;
        box-shadow: var(--shadow-md);
        transition: transform 0.3s ease;
    }

    .stat-card:hover {
        transform: translateY(-5px);
    }

    .stat-card.stars {
        background: linear-gradient(135deg, #FFE66D, #FFC93C);
    }

    .stat-card.badges {
        background: linear-gradient(135deg, #95E1D3, #5FD4C1);
    }

    .stat-card.games {
        background: linear-gradient(135deg, #A78BFA, #8B5CF6);
    }

    .stat-card.streak {
        background: linear-gradient(135deg, #FF6B6B, #E63946);
        color: var(--white);
    }

    .stat-icon {
        font-size: 3rem;
        margin-bottom: 0.5rem;
    }

    .stat-value {
        font-size: 2.5rem;
        font-weight: 700;
        font-family: var(--font-display);
        margin-bottom: 0.25rem;
    }

    .stat-label {
        font-size: 0.9rem;
        font-weight: 600;
        opacity: 0.9;
    }

    .badges-section {
        margin-bottom: 2rem;
    }

    .badges-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
        gap: 1rem;
    }

    .badge-item {
        background: var(--gray-50);
        padding: 1rem;
        border-radius: var(--radius-md);
        text-align: center;
        transition: all 0.3s ease;
    }

    .badge-item.unlocked {
        background: linear-gradient(135deg, var(--warning), var(--warning-dark));
        box-shadow: var(--shadow-md);
        transform: scale(1.05);
    }

    .badge-item.locked {
        opacity: 0.4;
        filter: grayscale(100%);
    }

    .badge-emoji {
        font-size: 2.5rem;
        margin-bottom: 0.5rem;
    }

    .badge-name {
        font-size: 0.75rem;
        font-weight: 600;
        color: var(--gray-900);
    }

    .favorite-table,
    .next-challenge {
        margin-bottom: 2rem;
    }

    .favorite-card,
    .challenge-card {
        background: var(--gray-50);
        padding: 2rem;
        border-radius: var(--radius-lg);
        text-align: center;
        box-shadow: var(--shadow-sm);
    }

    .favorite-number {
        font-size: 5rem;
        font-weight: 700;
        font-family: var(--font-display);
        color: var(--primary);
        margin-bottom: 0.5rem;
    }

    .favorite-stars {
        font-size: 2rem;
        margin-top: 1rem;
    }

    .challenge-card.completed {
        background: linear-gradient(135deg, var(--success), var(--success-dark));
        color: var(--white);
    }

    .challenge-icon {
        font-size: 4rem;
        margin-bottom: 1rem;
    }

    .challenge-title {
        font-size: 2rem;
        font-weight: 700;
        font-family: var(--font-display);
        color: var(--primary);
        margin-bottom: 0.5rem;
    }

    .challenge-subtitle {
        color: var(--gray-700);
        margin-bottom: 1rem;
    }

    .dashboard-actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
        margin-top: 2rem;
    }

    .btn-large {
        font-size: 1.2rem;
        padding: 1rem 2rem;
    }

    .btn-accent {
        background: linear-gradient(135deg, var(--secondary), var(--secondary-light));
        color: var(--white);
    }

    .no-data {
        text-align: center;
        color: var(--gray-500);
        font-style: italic;
        padding: 2rem;
    }

    @media (max-width: 768px) {
        .dashboard-header h1 {
            font-size: 2rem;
        }

        .stats-grid {
            grid-template-columns: repeat(2, 1fr);
        }

        .badges-grid {
            grid-template-columns: repeat(3, 1fr);
        }

        .dashboard-actions {
            flex-direction: column;
        }
    }
`;
document.head.appendChild(studentDashboardStyles);
