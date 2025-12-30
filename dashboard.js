// ============================================
// Parent Dashboard
// ============================================

window.ParentDashboard = {
    show(progress) {
        const container = document.getElementById('parentDashboard');

        container.innerHTML = `
            <div class="dashboard-content">
                <h2>👨‍👩‍👧 Dashboard Părinți</h2>
                <p class="dashboard-intro">Urmăriți progresul copilului dumneavoastră</p>

                <div class="dashboard-stats">
                    <div class="dash-stat">
                        <div class="dash-label">Table Învățate</div>
                        <div class="dash-value">${progress.tablesLearned.length}/10</div>
                        <div class="dash-bar">
                            <div class="dash-fill" style="width: ${(progress.tablesLearned.length / 10) * 100}%"></div>
                        </div>
                    </div>

                    <div class=" dash-stat">
                        <div class="dash-label">Jocuri Jucate</div>
                        <div class="dash-value">${progress.gamesPlayed}</div>
                    </div>

                    <div class="dash-stat">
                        <div class="dash-label">Răspunsuri Corecte</div>
                        <div class="dash-value">${progress.correctAnswers}</div>
                    </div>

                    <div class="dash-stat">
                        <div class="dash-label">Stele Acumulate</div>
                        <div class="dash-value">⭐ ${progress.totalStars}</div>
                    </div>
                </div>

                <div class="tables-progress">
                    <h3>Progres pe Table:</h3>
                    <div class="tables-chart">
                        ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => `
                            <div class="table-item ${progress.tablesLearned.includes(num) ? 'learned' : 'not-learned'}">
                                <div class="table-num">×${num}</div>
                                <div class="table-status">${progress.tablesLearned.includes(num) ? '✓' : '○'}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="recommendations">
                    <h3>Recomandări:</h3>
                    <ul>
                        ${this.getRecommendations(progress).map(rec => `<li>${rec}</li>`).join('')}
                    </ul>
                </div>

                <div class="dashboard-actions">
                    <button class="btn btn-primary" onclick="window.print()">📄 Printează Raport</button>
                    <button class="btn btn-danger" onclick="app.resetProgress()">🗑️ Resetează Progres</button>
                </div>
            </div>
        `;
    },

    getRecommendations(progress) {
        const recommendations = [];

        if (progress.tablesLearned.length === 0) {
            recommendations.push('👋 Începeți cu tabla lui 1 și 2 - sunt cele mai ușoare!');
        } else if (progress.tablesLearned.length < 5) {
            recommendations.push('🎯 Continuați să exersați! Sunteți pe drumul cel bun!');
        } else if (progress.tablesLearned.length < 10) {
            recommendations.push('💪 Aproape gata! Mai sunt câteva table de învățat!');
        } else {
            recommendations.push('🏆 Excelent! Toate tablele au fost învățate!');
        }

        if (progress.gamesPlayed < 5) {
            recommendations.push('🎮 Încercați mai multe jocuri pentru a exersa!');
        }

        const toLearn = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].filter(n => !progress.tablesLearned.includes(n));
        if (toLearn.length > 0) {
            recommendations.push(`📚 Table de exersat: ${toLearn.join(', ')}`);
        }

        return recommendations;
    }
};

const dashboardStyles = document.createElement('style');
dashboardStyles.textContent = `
    .dashboard-content {
        padding: 2rem;
        max-width: 800px;
        margin: 0 auto;
    }

    .dashboard-content h2 {
        font-family: var(--font-display);
        font-size: 2.5rem;
        color: var(--primary);
        text-align: center;
        margin-bottom: 1rem;
    }

    .dashboard-intro {
        text-align: center;
        color: var(--gray-700);
        margin-bottom: 2rem;
    }

    .dashboard-stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1.5rem;
        margin-bottom: 3rem;
    }

    .dash-stat {
        background: var(--gray-50);
        padding: 1.5rem;
        border-radius: var(--radius-lg);
        text-align: center;
        box-shadow: var(--shadow-sm);
    }

    .dash-label {
        font-weight: 600;
        color: var(--gray-700);
        margin-bottom: 0.5rem;
    }

    .dash-value {
        font-size: 2.5rem;
        font-weight: 700;
        color: var(--primary);
        margin-bottom: 0.5rem;
    }

    .dash-bar {
        height: 10px;
        background: var(--gray-200);
        border-radius: var(--radius-full);
        overflow: hidden;
        margin-top: 1rem;
    }

    .dash-fill {
        height: 100%;
        background: linear-gradient(90deg, var(--success), var(--success-dark));
        transition: width 0.5s ease;
    }

    .tables-progress {
        margin-bottom: 3rem;
    }

    .tables-progress h3 {
        font-family: var(--font-display);
        font-size: 1.5rem;
        color: var(--info);
        margin-bottom: 1rem;
    }

    .tables-chart {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 1rem;
    }

    .table-item {
        padding: 1rem;
        border-radius: var(--radius-md);
        text-align: center;
        transition: all 0.3s ease;
    }

    .table-item.learned {
        background: linear-gradient(135deg, var(--success), var(--success-dark));
        color: var(--white);
    }

    .table-item.not-learned {
        background: var(--gray-200);
        color: var(--gray-700);
    }

    .table-num {
        font-size: 1.5rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
    }

    .table-status {
        font-size: 1.2rem;
    }

    .recommendations {
        background: var(--warning);
        padding: 2rem;
        border-radius: var(--radius-lg);
        margin-bottom: 2rem;
    }

    .recommendations h3 {
        font-family: var(--font-display);
        font-size: 1.5rem;
        margin-bottom: 1rem;
    }

    .recommendations ul {
        list-style: none;
        padding: 0;
    }

    .recommendations li {
        padding: 0.5rem 0;
        font-size: 1.1rem;
        font-weight: 500;
    }

    .dashboard-actions {
        display: flex;
        justify-content: center;
        gap: 1rem;
        flex-wrap: wrap;
    }

    @media (max-width: 768px) {
        .tables-chart {
            grid-template-columns: repeat(3, 1fr);
        }
    }
`;
document.head.appendChild(dashboardStyles);
