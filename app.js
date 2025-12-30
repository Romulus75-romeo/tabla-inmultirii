// ============================================
// Main App - Core Logic and State Management
// ============================================

class MultiplicationApp {
    constructor() {
        this.currentSection = 'home';
        this.progress = this.loadProgress();
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupAvatarSelector();
        this.setupTablesGrid();
        this.setupGamesGrid();
        this.setupDuelButtons();
        this.setupParentAccess();
        this.setupDailyTraining();
        this.setupMultiplayer();
        this.setupCharts();
        this.updateStats();
        this.createBadgesGrid();
    }

    // ============================================
    // Navigation
    // ============================================
    setupNavigation() {
        const navBtns = document.querySelectorAll('.nav-btn');
        const sections = document.querySelectorAll('.content-section');

        navBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetSection = btn.dataset.section;

                // Update active nav button
                navBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Update active section
                sections.forEach(s => s.classList.remove('active'));
                document.getElementById(targetSection).classList.add('active');

                this.currentSection = targetSection;
            });
        });
    }

    // ============================================
    // Avatar System
    // ============================================
    setupAvatarSelector() {
        const avatarGrid = document.getElementById('avatarGrid');
        const avatars = ['🦝', '🐰', '🤖', '🦊', '🐻', '🐼', '🦁', '🐯'];

        avatars.forEach((emoji, index) => {
            const avatarDiv = document.createElement('div');
            avatarDiv.className = 'avatar-option';
            avatarDiv.textContent = emoji;
            avatarDiv.dataset.avatar = index;

            if (this.progress.selectedAvatar === index) {
                avatarDiv.classList.add('selected');
            }

            avatarDiv.addEventListener('click', () => {
                document.querySelectorAll('.avatar-option').forEach(a => a.classList.remove('selected'));
                avatarDiv.classList.add('selected');
                this.progress.selectedAvatar = index;
                this.saveProgress();
                this.playSound('select');
            });

            avatarGrid.appendChild(avatarDiv);
        });
    }

    // ============================================
    // Tables Grid (Learning Section)
    // ============================================
    setupTablesGrid() {
        const tablesGrid = document.getElementById('tablesGrid');

        for (let i = 1; i <= 10; i++) {
            const tableCard = document.createElement('div');
            tableCard.className = 'table-card';
            if (this.progress.tablesLearned.includes(i)) {
                tableCard.classList.add('completed');
            }

            tableCard.innerHTML = `
                <div class="table-number">×${i}</div>
                <div class="table-label">Tabla lui ${i}</div>
            `;

            tableCard.addEventListener('click', () => {
                this.openLearningModal(i);
            });

            tablesGrid.appendChild(tableCard);
        }
    }

    // ============================================
    // Games Grid
    // ============================================
    setupGamesGrid() {
        const gameCards = document.querySelectorAll('.game-card');

        gameCards.forEach(card => {
            const playBtn = card.querySelector('.btn');
            const gameName = card.dataset.game;

            playBtn.addEventListener('click', () => {
                this.openGameModal(gameName);
            });
        });
    }

    // ============================================
    // Duel Setup
    // ============================================
    setupDuelButtons() {
        const difficultyBtns = document.querySelectorAll('[data-difficulty]');

        difficultyBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const difficulty = btn.dataset.difficulty;
                this.startDuel(difficulty);
            });
        });
    }

    // ============================================
    // Parent Access
    // ============================================
    setupParentAccess() {
        const parentBtn = document.getElementById('parentBtn');
        const parentModal = document.getElementById('parentModal');
        const closeParentModal = document.getElementById('closeParentModal');

        parentBtn.addEventListener('click', () => {
            this.showParentDashboard();
        });

        closeParentModal.addEventListener('click', () => {
            parentModal.classList.remove('active');
        });
    }

    // ============================================
    // Daily Training Setup
    // ============================================
    setupDailyTraining() {
        const startBtn = document.getElementById('startDailyBtn');
        const streakInfo = document.getElementById('streakInfo');
        const statusText = document.getElementById('dailyTrainingStatus');

        if (!startBtn || !window.dailyTraining) return;

        // Update streak display
        const info = window.dailyTraining.getStreakInfo();
        if (info.completedToday) {
            statusText.textContent = '✅ Completat astăzi! Revino mâine!';
            startBtn.disabled = true;
            startBtn.textContent = 'Completat Astăzi ✓';
        }

        if (info.streak > 0) {
            streakInfo.innerHTML = `<div class="streak-badge">🔥 ${info.streak} zile consecutive</div>`;
        }

        startBtn.addEventListener('click', () => {
            const modal = document.getElementById('gameModal');
            const container = document.getElementById('gameContainer');

            modal.classList.add('active');

            // Setup close button
            const closeBtn = document.getElementById('closeModal');
            const closeHandler = () => {
                modal.classList.remove('active');
                container.innerHTML = '';
                closeBtn.removeEventListener('click', closeHandler);
            };
            closeBtn.addEventListener('click', closeHandler);

            window.dailyTraining.start(container, (result) => {
                this.progress.correctAnswers += result.correct;
                this.saveProgress();
                this.updateStats();
                modal.classList.remove('active');
                container.innerHTML = '';
                closeBtn.removeEventListener('click', closeHandler);

                // Update button state
                statusText.textContent = '✅ Completat astăzi! Revino mâine!';
                startBtn.disabled = true;
                startBtn.textContent = 'Completat Astăzi ✓';

                const newInfo = window.dailyTraining.getStreakInfo();
                streakInfo.innerHTML = `<div class="streak-badge">🔥 ${newInfo.streak} zile consecutive</div>`;
                this.showConfetti();
            });
        });
    }

    // ============================================
    // Modal Management
    // ============================================
    openLearningModal(tableNumber) {
        const modal = document.getElementById('learningModal');
        modal.classList.add('active');

        // Learning.js will handle the content
        if (window.LearningModule) {
            window.LearningModule.showTable(tableNumber, this.progress, () => {
                this.markTableAsLearned(tableNumber);
            });
        }

        document.getElementById('closeLearningModal').onclick = () => {
            modal.classList.remove('active');
        };
    }

    openGameModal(gameName) {
        const modal = document.getElementById('gameModal');
        const gameContainer = document.getElementById('gameContainer');
        modal.classList.add('active');

        // Different games will populate the container
        gameContainer.innerHTML = `<p>Se încarcă jocul ${gameName}...</p>`;

        // Call the appropriate game module
        switch (gameName) {
            case 'multiple-choice':
                if (window.MultipleChoiceGame) {
                    window.MultipleChoiceGame.start(gameContainer, (score) => {
                        this.recordGameResult('multiple-choice', score);
                    });
                }
                break;
            case 'race':
                if (window.RaceGame) {
                    window.RaceGame.start(gameContainer, (score) => {
                        this.recordGameResult('race', score);
                    });
                }
                break;
            case 'puzzle':
                if (window.PuzzleGame) {
                    window.PuzzleGame.start(gameContainer, (score) => {
                        this.recordGameResult('puzzle', score);
                    });
                }
                break;
            case 'circus':
                if (window.CircusGame) {
                    window.CircusGame.start(gameContainer, (score) => {
                        this.recordGameResult('circus', score);
                    });
                }
                break;
            case 'rocket':
                if (window.RocketGame) {
                    window.RocketGame.start(gameContainer, (score) => {
                        this.recordGameResult('rocket', score);
                    });
                }
                break;
        }

        document.getElementById('closeModal').onclick = () => {
            modal.classList.remove('active');
            gameContainer.innerHTML = '';
        };
    }

    startDuel(difficulty) {
        const modal = document.getElementById('gameModal');
        const gameContainer = document.getElementById('gameContainer');
        modal.classList.add('active');

        if (window.DuelGame) {
            window.DuelGame.start(gameContainer, difficulty, (result) => {
                this.recordDuelResult(result);
            });
        }

        document.getElementById('closeModal').onclick = () => {
            modal.classList.remove('active');
            gameContainer.innerHTML = '';
        };
    }

    showParentDashboard() {
        const modal = document.getElementById('parentModal');
        modal.classList.add('active');

        if (window.ParentDashboard) {
            window.ParentDashboard.show(this.progress);
        }
    }

    // ============================================
    // Progress Management
    // ============================================
    markTableAsLearned(tableNumber) {
        if (!this.progress.tablesLearned.includes(tableNumber)) {
            this.progress.tablesLearned.push(tableNumber);
            this.saveProgress();
            this.updateStats();
            this.updateTablesGrid();
            this.checkCertificate();
            this.showConfetti();
            this.playSound('success');
        }
    }

    recordGameResult(gameName, score) {
        this.progress.gamesPlayed++;
        this.progress.totalStars += score.stars || 0;
        this.progress.correctAnswers += score.correct || 0;

        // Award badges based on performance
        this.checkAndAwardBadges(gameName, score);

        this.saveProgress();
        this.updateStats();
        this.playSound('victory');
    }

    recordDuelResult(result) {
        this.progress.duelsPlayed++;
        if (result.won) {
            this.progress.duelsWon++;
            this.showConfetti();
        }
        this.saveProgress();
        this.updateStats();
    }

    checkAndAwardBadges(gameName, score) {
        const badges = this.progress.badges;

        // First game badge
        if (this.progress.gamesPlayed === 1 && !badges.includes('first-game')) {
            badges.push('first-game');
        }

        // Perfect score badge
        if (score.correct === 10 && !badges.includes('perfect-score')) {
            badges.push('perfect-score');
        }

        // Speed badge (if completed in under 60 seconds)
        if (score.time < 60 && !badges.includes('speedster')) {
            badges.push('speedster');
        }

        // Persistent player (10 games)
        if (this.progress.gamesPlayed >= 10 && !badges.includes('persistent')) {
            badges.push('persistent');
        }

        // Expert (100 correct answers)
        if (this.progress.correctAnswers >= 100 && !badges.includes('expert')) {
            badges.push('expert');
        }
    }

    checkCertificate() {
        if (this.progress.tablesLearned.length === 10) {
            // All tables learned, generate certificate
            if (window.CertificateGenerator) {
                window.CertificateGenerator.generate(this.progress);
            }
        }
    }

    updateTablesGrid() {
        const tableCards = document.querySelectorAll('.table-card');
        tableCards.forEach((card, index) => {
            const tableNumber = index + 1;
            if (this.progress.tablesLearned.includes(tableNumber)) {
                card.classList.add('completed');
            }
        });
    }

    createBadgesGrid() {
        const badgesGrid = document.getElementById('badgesGrid');
        const allBadges = [
            { id: 'table-1', icon: '🥉', name: 'Tabla lui 1' },
            { id: 'table-2', icon: '🥈', name: 'Tabla lui 2' },
            { id: 'table-3', icon: '🥇', name: 'Tabla lui 3' },
            { id: 'table-4', icon: '🏅', name: 'Tabla lui 4' },
            { id: 'table-5', icon: '🎖️', name: 'Tabla lui 5' },
            { id: 'table-6', icon: '🏆', name: 'Tabla lui 6' },
            { id: 'table-7', icon: '👑', name: 'Tabla lui 7' },
            { id: 'table-8', icon: '💎', name: 'Tabla lui 8' },
            { id: 'table-9', icon: '⭐', name: 'Tabla lui 9' },
            { id: 'table-10', icon: '🌟', name: 'Tabla lui 10' },
            { id: 'first-game', icon: '🎮', name: 'Primul Joc' },
            { id: 'perfect-score', icon: '💯', name: 'Scor Perfect' },
            { id: 'speedster', icon: '⚡', name: 'Vitezoman' },
            { id: 'persistent', icon: '🔥', name: 'Persistent' },
            { id: 'expert', icon: '🧠', name: 'Expert' },
        ];

        allBadges.forEach(badge => {
            const badgeDiv = document.createElement('div');
            badgeDiv.className = 'badge-item';

            // Check if unlocked
            const isTableBadge = badge.id.startsWith('table-');
            const tableNum = isTableBadge ? parseInt(badge.id.split('-')[1]) : null;
            const isUnlocked = isTableBadge
                ? this.progress.tablesLearned.includes(tableNum)
                : this.progress.badges.includes(badge.id);

            if (isUnlocked) {
                badgeDiv.classList.add('unlocked');
            }

            badgeDiv.innerHTML = `
                <div class="badge-icon">${badge.icon}</div>
                <div class="badge-name">${badge.name}</div>
            `;

            badgesGrid.appendChild(badgeDiv);
        });
    }

    // ============================================
    // Stats Display
    // ============================================
    updateStats() {
        document.getElementById('totalStars').textContent = this.progress.totalStars;
        document.getElementById('totalBadges').textContent = this.progress.badges.length + this.progress.tablesLearned.length;
        document.getElementById('tablesLearned').textContent = this.progress.tablesLearned.length;
        document.getElementById('gamesPlayed').textContent = this.progress.gamesPlayed;
        document.getElementById('correctAnswers').textContent = this.progress.correctAnswers;
    }

    // ============================================
    // Visual Effects
    // ============================================
    showConfetti() {
        const container = document.getElementById('confettiContainer');
        const colors = ['#FF6B6B', '#4ECDC4', '#95E1D3', '#FFE66D', '#A78BFA'];

        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 0.5 + 's';
            container.appendChild(confetti);

            setTimeout(() => confetti.remove(), 3000);
        }
    }

    playSound(type) {
        // Sound effects would be implemented here
        // For now, we'll keep it silent to avoid annoyance
        console.log(`Playing sound: ${type}`);
    }

    // ============================================
    // Local Storage
    // ============================================
    loadProgress() {
        const saved = localStorage.getItem('multiplicationProgress');
        if (saved) {
            return JSON.parse(saved);
        }

        // Default progress
        return {
            selectedAvatar: 0,
            tablesLearned: [],
            gamesPlayed: 0,
            correctAnswers: 0,
            totalStars: 0,
            badges: [],
            duelsPlayed: 0,
            duelsWon: 0,
            lastPlayed: new Date().toISOString()
        };
    }

    saveProgress() {
        this.progress.lastPlayed = new Date().toISOString();
        localStorage.setItem('multiplicationProgress', JSON.stringify(this.progress));
    }

    setupMultiplayer() {
        const multiCard = document.querySelector('[data-game="multiplayer"]');
        if (!multiCard) return;

        const playBtn = multiCard.querySelector('.btn');
        playBtn.addEventListener('click', () => {
            const modal = document.getElementById('gameModal');
            const container = document.getElementById('gameContainer');
            modal.classList.add('active');

            if (window.multiplayerGame) {
                window.multiplayerGame.start(container, (result) => {
                    this.progress.correctAnswers += result.player1 + result.player2;
                    this.saveProgress();
                    this.updateStats();
                    this.showConfetti();
                    modal.classList.remove('active');
                });
            }

            document.getElementById('closeModal').onclick = () => {
                modal.classList.remove('active');
                container.innerHTML = '';
            };
        });
    }

    setupCharts() {
        const chartsBtn = document.getElementById('showChartsBtn');
        if (!chartsBtn) return;

        chartsBtn.addEventListener('click', () => {
            const modal = document.getElementById('chartsModal');
            modal.classList.add('active');

            if (window.progressCharts) {
                window.progressCharts.showCharts(this.progress);
            }
        });
    }

    resetProgress() {
        if (confirm('Ești sigur că vrei să ștergi tot progresul? Această acțiune nu poate fi anulată!')) {
            localStorage.removeItem('multiplicationProgress');
            location.reload();
        }
    }
}

// ============================================
// Game Engine - Shared Logic
// ============================================
class GameEngine {
    constructor() {
        this.currentQuestions = [];
        this.currentQuestionIndex = 0;
        this.score = { correct: 0, wrong: 0, stars: 0, time: 0 };
        this.startTime = null;
    }

    generateQuestion(minTable = 1, maxTable = 10) {
        const num1 = Math.floor(Math.random() * (maxTable - minTable + 1)) + minTable;
        const num2 = Math.floor(Math.random() * 10) + 1;
        const answer = num1 * num2;

        // Generate wrong answers
        const wrongAnswers = new Set();
        while (wrongAnswers.size < 2) {
            const wrong = answer + (Math.floor(Math.random() * 20) - 10);
            if (wrong !== answer && wrong > 0) {
                wrongAnswers.add(wrong);
            }
        }

        const allAnswers = [answer, ...Array.from(wrongAnswers)];
        this.shuffleArray(allAnswers);

        return {
            num1,
            num2,
            correctAnswer: answer,
            options: allAnswers
        };
    }

    generateQuestions(count = 10, minTable = 1, maxTable = 10) {
        this.currentQuestions = [];
        for (let i = 0; i < count; i++) {
            this.currentQuestions.push(this.generateQuestion(minTable, maxTable));
        }
        this.currentQuestionIndex = 0;
        this.startTime = Date.now();
    }

    checkAnswer(userAnswer, correctAnswer) {
        const isCorrect = userAnswer === correctAnswer;
        if (isCorrect) {
            this.score.correct++;
        } else {
            this.score.wrong++;
        }
        return isCorrect;
    }

    calculateStars(correct, total) {
        const percentage = (correct / total) * 100;
        if (percentage >= 90) return 3;
        if (percentage >= 70) return 2;
        if (percentage >= 50) return 1;
        return 0;
    }

    getElapsedTime() {
        return Math.floor((Date.now() - this.startTime) / 1000);
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
}

// ============================================
// Initialize App
// ============================================
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new MultiplicationApp();
});
