// ============================================
// Seasonal Themes - Teme Sezoniere
// ============================================

class SeasonalThemes {
    constructor() {
        this.themes = {
            default: {
                name: 'Standard',
                colors: {
                    primary: '#FF6B6B',
                    secondary: '#4ECDC4',
                    accent: '#FFE66D'
                },
                mascotEmoji: '🦝',
                decoration: ''
            },
            christmas: {
                name: 'Crăciun',
                colors: {
                    primary: '#C41E3A',
                    secondary: '#165B33',
                    accent: '#FFD700'
                },
                mascotEmoji: '🎅',
                decoration: '❄️🎄⛄🎁'
            },
            halloween: {
                name: 'Halloween',
                colors: {
                    primary: '#FF6B35',
                    secondary: '#5B2E48',
                    accent: '#FFA500'
                },
                mascotEmoji: '🎃',
                decoration: '👻🦇🕷️🍬'
            },
            easter: {
                name: 'Paște',
                colors: {
                    primary: '#FFB6C1',
                    secondary: '#98D8C8',
                    accent: '#F7DC6F'
                },
                mascotEmoji: '🐰',
                decoration: '🥚🐣🌷🌼'
            },
            school: {
                name: 'Școală',
                colors: {
                    primary: '#3498DB',
                    secondary: '#2ECC71',
                    accent: '#F39C12'
                },
                mascotEmoji: '📚',
                decoration: '✏️📐📏🎒'
            },
            summer: {
                name: 'Vară',
                colors: {
                    primary: '#FFD93D',
                    secondary: '#6BCB77',
                    accent: '#FF6B6B'
                },
                mascotEmoji: '🌞',
                decoration: '🏖️🌺🍉🏄'
            }
        };

        this.currentTheme = localStorage.getItem('selectedTheme') || 'default';
        this.autoDetectSeason();
    }

    autoDetectSeason() {
        const month = new Date().getMonth() + 1; // 1-12

        if (month === 12 || month === 1) {
            this.currentTheme = 'christmas';
        } else if (month === 10) {
            this.currentTheme = 'halloween';
        } else if (month === 3 || month === 4) {
            this.currentTheme = 'easter';
        } else if (month === 9) {
            this.currentTheme = 'school';
        } else if (month >= 6 && month <= 8) {
            this.currentTheme = 'summer';
        }

        // Check if user has manually selected a theme
        const manualTheme = localStorage.getItem('selectedTheme');
        if (manualTheme) {
            this.currentTheme = manualTheme;
        }
    }

    applyTheme(themeName = this.currentTheme) {
        const theme = this.themes[themeName] || this.themes.default;
        this.currentTheme = themeName;
        localStorage.setItem('selectedTheme', themeName);

        // Apply CSS variables
        const root = document.documentElement;
        root.style.setProperty('--primary', theme.colors.primary);
        root.style.setProperty('--secondary', theme.colors.secondary);
        root.style.setProperty('--accent', theme.colors.accent);

        // Update page decoration
        this.addDecoration(theme.decoration);

        // Update mascot if exists
        const mascotElements = document.querySelectorAll('.mascot-emoji');
        mascotElements.forEach(el => {
            el.textContent = theme.mascotEmoji;
        });
    }

    addDecoration(decoration) {
        // Remove old decoration
        const oldDecor = document.querySelector('.seasonal-decoration');
        if (oldDecor) oldDecor.remove();

        if (!decoration) return;

        const decorContainer = document.createElement('div');
        decorContainer.className = 'seasonal-decoration';

        const symbols = decoration.split('');
        for (let i = 0; i < 20; i++) {
            const decorItem = document.createElement('div');
            decorItem.className = 'decor-item';
            decorItem.textContent = symbols[Math.floor(Math.random() * symbols.length)];
            decorItem.style.left = Math.random() * 100 + '%';
            decorItem.style.animationDelay = Math.random() * 5 + 's';
            decorItem.style.animationDuration = (10 + Math.random() * 10) + 's';
            decorContainer.appendChild(decorItem);
        }

        document.body.appendChild(decorContainer);
    }

    showThemeSelector() {
        const modal = document.getElementById('themeModal');
        if (!modal) {
            this.createThemeModal();
        }
        document.getElementById('themeModal').classList.add('active');
    }

    createThemeModal() {
        const modal = document.createElement('div');
        modal.id = 'themeModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <button class="modal-close" onclick="document.getElementById('themeModal').classList.remove('active')">✖️</button>
                <h2>🎨 Alege Tema</h2>
                <div class="theme-grid">
                    ${Object.keys(this.themes).map(key => {
            const theme = this.themes[key];
            return `
                            <div class="theme-card ${this.currentTheme === key ? 'active' : ''}" data-theme="${key}">
                                <div class="theme-preview" style="background: linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary});">
                                    <span class="theme-emoji">${theme.mascotEmoji}</span>
                                </div>
                                <div class="theme-name">${theme.name}</div>
                            </div>
                        `;
        }).join('')}
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Add click handlers
        document.querySelectorAll('.theme-card').forEach(card => {
            card.addEventListener('click', () => {
                const themeName = card.dataset.theme;
                this.applyTheme(themeName);

                document.querySelectorAll('.theme-card').forEach(c => c.classList.remove('active'));
                card.classList.add('active');

                setTimeout(() => {
                    modal.classList.remove('active');
                }, 500);
            });
        });
    }
}

// Initialize
window.seasonalThemes = new SeasonalThemes();

// Apply theme on page load
document.addEventListener('DOMContentLoaded', () => {
    window.seasonalThemes.applyTheme();
});

// CSS Styles
const themeStyles = document.createElement('style');
themeStyles.textContent = `
    .seasonal-decoration {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 9999;
        overflow: hidden;
    }

    .decor-item {
        position: absolute;
        font-size: 2rem;
        opacity: 0.6;
        animation: float-down linear infinite;
    }

    @keyframes float-down {
        0% {
            top: -10%;
            transform: translateX(0) rotate(0deg);
        }
        100% {
            top: 110%;
            transform: translateX(100px) rotate(360deg);
        }
    }

    .theme-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 1.5rem;
        padding: 2rem;
    }

    .theme-card {
        cursor: pointer;
        border-radius: var(--radius-lg);
        overflow: hidden;
        transition: all 0.3s ease;
        border: 3px solid transparent;
    }

    .theme-card:hover {
        transform: scale(1.05);
        box-shadow: var(--shadow-lg);
    }

    .theme-card.active {
        border-color: var(--primary);
        box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.3);
    }

    .theme-preview {
        height: 150px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .theme-emoji {
        font-size: 4rem;
    }

    .theme-name {
        padding: 1rem;
        text-align: center;
        background: var(--white);
        font-weight: 600;
        color: var(--gray-900);
    }

    .theme-toggle-btn {
        position: fixed;
        bottom: 20px;
        left: 20px;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--primary), var(--secondary));
        color: white;
        border: none;
        font-size: 2rem;
        cursor: pointer;
        box-shadow: var(--shadow-lg);
        z-index: 998;
        transition: all 0.3s ease;
    }

    .theme-toggle-btn:hover {
        transform: scale(1.1) rotate(15deg);
    }

    @media (max-width: 768px) {
        .theme-toggle-btn {
            bottom: 90px;
            left: 10px;
            width: 50px;
            height: 50px;
            font-size: 1.5rem;
        }
    }
`;
document.head.appendChild(themeStyles);

// Add theme toggle button
const themeBtn = document.createElement('button');
themeBtn.className = 'theme-toggle-btn no-print';
themeBtn.textContent = '🎨';
themeBtn.title = 'Schimbă Tema';
themeBtn.onclick = () => window.seasonalThemes.showThemeSelector();
document.body.appendChild(themeBtn);
