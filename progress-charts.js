// ============================================
// Progress Charts - Grafice de Progres
// ============================================

class ProgressCharts {
    constructor() {
        this.chartInstances = {};
    }

    loadChartJS() {
        return new Promise((resolve, reject) => {
            if (window.Chart) {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    async showCharts(progress) {
        await this.loadChartJS();

        const container = document.getElementById('chartsContainer');
        if (!container) return;

        container.innerHTML = `
            <div class="charts-modal-content">
                <h2>📊 Grafice de Progres</h2>
                
                <div class="charts-grid">
                    <div class="chart-card">
                        <h3>Progress pe Table</h3>
                        <canvas id="tablesChart"></canvas>
                    </div>

                    <div class="chart-card">
                        <h3>Acuratețe Răspunsuri</h3>
                        <canvas id="accuracyChart"></canvas>
                    </div>

                    <div class="chart-card">
                        <h3>Activitate Săptămânală</h3>
                        <canvas id="activityChart"></canvas>
                    </div>

                    <div class="chart-card">
                        <h3>Distribuție Jocuri</h3>
                        <canvas id="gamesChart"></canvas>
                    </div>
                </div>

                <button class="btn btn-primary" onclick="window.progressCharts.closeCharts()">Închide</button>
            </div>
        `;

        this.createTablesChart(progress);
        this.createAccuracyChart(progress);
        this.createActivityChart(progress);
        this.createGamesChart(progress);
    }

    createTablesChart(progress) {
        const ctx = document.getElementById('tablesChart');
        if (!ctx) return;

        const labels = Array.from({ length: 10 }, (_, i) => `Tabla ${i + 1}`);
        const data = labels.map((_, i) => progress.tablesLearned.includes(i + 1) ? 1 : 0);

        this.chartInstances.tables = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Învățat',
                    data: data,
                    backgroundColor: data.map(v => v ? '#4ECDC4' : '#E0E0E0'),
                    borderColor: data.map(v => v ? '#2AB7AE' : '#BDBDBD'),
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 1,
                        ticks: {
                            callback: (value) => value === 1 ? '✓' : ''
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    createAccuracyChart(progress) {
        const ctx = document.getElementById('accuracyChart');
        if (!ctx) return;

        const correct = progress.correctAnswers || 0;
        const total = progress.totalAnswers || 1;
        const wrong = total - correct;
        const accuracy = ((correct / total) * 100).toFixed(1);

        this.chartInstances.accuracy = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Corecte', 'Greșite'],
                datasets: [{
                    data: [correct, wrong],
                    backgroundColor: ['#95E1D3', '#F94144'],
                    borderWidth: 3,
                    borderColor: '#FFFFFF'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    title: {
                        display: true,
                        text: `Acuratețe: ${accuracy}%`,
                        font: {
                            size: 18,
                            weight: 'bold'
                        }
                    }
                }
            }
        });
    }

    createActivityChart(progress) {
        const ctx = document.getElementById('activityChart');
        if (!ctx) return;

        // Simulare activitate săptămânală (sau din dailyTraining)
        const dailyData = window.dailyTraining?.data?.history || [];
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (6 - i));
            return date.toLocaleDateString('ro-RO', { weekday: 'short' });
        });

        const activityData = last7Days.map(() => Math.floor(Math.random() * 10));

        this.chartInstances.activity = new Chart(ctx, {
            type: 'line',
            data: {
                labels: last7Days,
                datasets: [{
                    label: 'Răspunsuri Corecte',
                    data: activityData,
                    fill: true,
                    backgroundColor: 'rgba(78, 205, 196, 0.2)',
                    borderColor: '#4ECDC4',
                    borderWidth: 3,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    createGamesChart(progress) {
        const ctx = document.getElementById('gamesChart');
        if (!ctx) return;

        this.chartInstances.games = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Multiple Choice', 'Race', 'Puzzle', 'Circus', 'Rocket'],
                datasets: [{
                    data: [20, 15, 18, 12, 10], // Simulare
                    backgroundColor: [
                        '#FF6B6B',
                        '#4ECDC4',
                        '#FFE66D',
                        '#A78BFA',
                        '#95E1D3'
                    ],
                    borderWidth: 2,
                    borderColor: '#FFFFFF'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    closeCharts() {
        // Destroy all chart instances
        Object.values(this.chartInstances).forEach(chart => {
            if (chart) chart.destroy();
        });
        this.chartInstances = {};

        const modal = document.getElementById('chartsModal');
        if (modal) modal.classList.remove('active');
    }
}

// Initialize
window.progressCharts = new ProgressCharts();

// CSS for charts
const chartsStyles = document.createElement('style');
chartsStyles.textContent = `
    .charts-modal-content {
        padding: 2rem;
        max-width: 1200px;
        margin: 0 auto;
    }

    .charts-modal-content h2 {
        text-align: center;
        color: var(--primary);
        margin-bottom: 2rem;
    }

    .charts-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
        gap: 2rem;
        margin-bottom: 2rem;
    }

    .chart-card {
        background: var(--white);
        padding: 1.5rem;
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-md);
    }

    .chart-card h3 {
        text-align: center;
        color: var(--gray-900);
        margin-bottom: 1rem;
        font-size: 1.2rem;
    }

    .chart-card canvas {
        max-height: 300px;
    }

    @media (max-width: 768px) {
        .charts-grid {
            grid-template-columns: 1fr;
        }
    }
`;
document.head.appendChild(chartsStyles);
