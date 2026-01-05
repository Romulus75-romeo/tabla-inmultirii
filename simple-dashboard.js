// ============================================
// SIMPLE Student Dashboard - Direct DOM Manipulation
// ============================================

function showStudentDashboard() {
    console.log('showStudentDashboard called');

    // Get progress
    const progress = JSON.parse(localStorage.getItem('multiplicationProgress')) || {
        learnedTables: [],
        badges: [],
        totalStars: 0,
        gamesPlayed: 0
    };

    // Create overlay
    let overlay = document.getElementById('dashboardOverlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'dashboardOverlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 9999;
            display: flex;
            justify-content: center;
            align-items: center;
        `;
        document.body.appendChild(overlay);
    }

    // Create content
    const learnedCount = progress.learnedTables.length;
    const progressPercent = (learnedCount / 10) * 100;

    overlay.innerHTML = `
        <div style="
            background: white;
            padding: 2rem;
            border-radius: 15px;
            max-width: 800px;
            max-height: 90vh;
            overflow-y: auto;
            position: relative;
        ">
            <button onclick="document.getElementById('dashboardOverlay').remove()" style="
                position: absolute;
                top: 1rem;
                right: 1rem;
                background: #ff4444;
                color: white;
                border: none;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                cursor: pointer;
                font-size: 20px;
            ">✖</button>
            
            <h1 style="text-align: center; color: #FF6B6B; font-size: 2rem; margin-bottom: 1rem;">
                🎉 Tabloul Tău de Campion!
            </h1>
            
            <div style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 2rem; border-radius: 10px; text-align: center; margin-bottom: 2rem;">
                <div style="font-size: 3rem; font-weight: bold;">${learnedCount}/10</div>
                <div style="font-size: 1.2rem;">Table Învățate</div>
                <div style="background: rgba(255,255,255,0.3); height: 10px; border-radius: 5px; margin: 1rem 0;">
                    <div style="background: white; height: 100%; width: ${progressPercent}%; border-radius: 5px;"></div>
                </div>
                <div style="font-size: 1.1rem; margin-top: 1rem;">
                    ${learnedCount === 0 ? 'Hai să începem aventura! 🚀' :
            learnedCount < 5 ? `Super început! Mai ${10 - learnedCount} table! 💪` :
                learnedCount < 10 ? `Ești aproape campion! Încă ${10 - learnedCount}! 🏆` :
                    '🎊 CAMPION ABSOLUT! Ai învățat toate tablele!'}
                </div>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
                <div style="background: linear-gradient(135deg, #FFE66D, #FFC93C); padding: 1.5rem; border-radius: 10px; text-align: center;">
                    <div style="font-size: 2.5rem;">⭐</div>
                    <div style="font-size: 2rem; font-weight: bold;">${progress.totalStars || 0}</div>
                    <div>Stele</div>
                </div>
                <div style="background: linear-gradient(135deg, #95E1D3, #5FD4C1); padding: 1.5rem; border-radius: 10px; text-align: center;">
                    <div style="font-size: 2.5rem;">🏅</div>
                    <div style="font-size: 2rem; font-weight: bold;">${progress.badges?.length || 0}/15</div>
                    <div>Badge-uri</div>
                </div>
                <div style="background: linear-gradient(135deg, #A78BFA, #8B5CF6); padding: 1.5rem; border-radius: 10px; text-align: center; color: white;">
                    <div style="font-size: 2.5rem;">🎮</div>
                    <div style="font-size: 2rem; font-weight: bold;">${progress.gamesPlayed || 0}</div>
                    <div>Jocuri</div>
                </div>
            </div>
            
            <div style="text-align: center; margin-top: 2rem;">
                <button onclick="document.getElementById('dashboardOverlay').remove(); showTab('learn')" style="
                    background: linear-gradient(135deg, #4ECDC4, #44A08D);
                    color: white;
                    border: none;
                    padding: 1rem 2rem;
                    border-radius: 10px;
                    font-size: 1.2rem;
                    font-weight: bold;
                    cursor: pointer;
                    margin: 0.5rem;
                ">🚀 Hai să Învățăm!</button>
                
                <button onclick="document.getElementById('dashboardOverlay').remove(); showTab('games')" style="
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    color: white;
                    border: none;
                    padding: 1rem 2rem;
                    border-radius: 10px;
                    font-size: 1.2rem;
                    font-weight: bold;
                    cursor: pointer;
                    margin: 0.5rem;
                ">🎮 Hai să Jucăm!</button>
            </div>
        </div>
    `;

    overlay.style.display = 'flex';
    console.log('Dashboard displayed');
}

// Make it global
window.showStudentDashboard = showStudentDashboard;
